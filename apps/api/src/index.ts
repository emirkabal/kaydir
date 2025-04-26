import "dotenv/config";
import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { auth } from "./lib/auth";
import { cors } from "@elysiajs/cors";
import { posts } from "./routes";

export const app = new Elysia({ adapter: node(), prefix: "/api" })
  .use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .mount(auth.handler)
  .get("/", () => "Hello Elysia")
  .use(posts)
  .listen(3001, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at ${hostname}:${port}`);
  });
