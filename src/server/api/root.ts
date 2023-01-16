import { createTRPCRouter } from "./trpc";

import { reportToAdmin } from "./routers/reportToAdmin";
import { publicApi } from "./routers/public";
import { me } from "./routers/me";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  reportToAdmin,
  publicApi,
  me,
});

// export type definition of API
export type AppRouter = typeof appRouter;
