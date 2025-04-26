import { createAuthClient } from "better-auth/react";

// ReturnType used to infer the type of the authClient instance (monorepo)
export const authClient: ReturnType<typeof createAuthClient> =
  createAuthClient();
