import { router } from "../trpc";

import { reportToAdmin } from "./reportToAdmin";
import { publicApi } from "./public";
import { me } from "./me";
export const appRouter = router({
  reportToAdmin,
  publicApi,
  me,
});

// export type definition of API
export type AppRouter = typeof appRouter;
