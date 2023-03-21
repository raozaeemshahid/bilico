import { createTRPCRouter } from "../../trpc";
import { getProfile } from "./getProfile";
import { searchPeoples } from "./searchPeoples";
import { getUserPosts } from "./getUserPosts";
import { reactPost } from "./reactPost";
import { getReactions } from "./getReactions";
import { getComments } from "./getComments";
import { getReplies } from "./getReplies";
import { createComment } from "./createComment";
import { deleteComment } from "./deleteComment";

export const publicApi = createTRPCRouter({
  getProfile,
  searchPeoples,
  getUserPosts,
  reactPost,
  getReactions,
  getComments,
  getReplies,
  createComment,
  deleteComment,
});
