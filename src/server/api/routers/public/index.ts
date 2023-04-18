import { createTRPCRouter } from "../../trpc";
import Relation from "./Relation";
import { getProfile } from "./getProfile";
import { searchPeoples } from "./searchPeoples";
import { getUserPosts } from "./getUserPosts";
import { reactPost } from "./reactPost";
import { getReactions } from "./getReactions";
import { getComments } from "./getComments";
import { getReplies } from "./getReplies";
import { createComment } from "./createComment";
import { deleteComment } from "./deleteComment";
import { getReactionsCount } from "./getReactionsCount";
import { getCommentsCount } from "./getCommentsCount";
import { replyComment } from "./replyComment";
import { getPost } from "./getPost";
import { getHighlightedComment } from "./getHighlightedComment";

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
  getReactionsCount,
  getCommentsCount,
  replyComment,
  Relation,
  getPost,
  getHighlightedComment,
});
