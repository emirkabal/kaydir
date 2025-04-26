import { prisma } from "@kaydir/db";
import Elysia, { t } from "elysia";
import { middleware } from "../lib/auth";
import { randomUUID } from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_ACCESS_KEY!,
  },
});

export const posts = new Elysia({
  prefix: "/posts",
})

  .use(middleware)
  .get(
    "",
    async ({ query }) => {
      const { authorId, take, skip } = query;

      const list = await prisma.post.findMany({
        where: {
          authorId: authorId ? authorId : undefined,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        take,
        skip,
      });

      return list;
    },
    {
      query: t.Object({
        authorId: t.Optional(t.String()),
        take: t.Number({
          default: 10,
        }),
        skip: t.Number({
          default: 0,
        }),
      }),
    }
  );
