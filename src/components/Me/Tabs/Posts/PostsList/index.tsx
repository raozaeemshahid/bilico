import { api } from "../../../../../utils/api";
import BadWordsFilter from "../../../../../utils/BadWordFilter";
import moment from "moment";
import Image from "next/image";
import Loading from "../../../../Loading";

const Postslist: React.FC = () => {
  const userData = api.me.data.useQuery();
  const getPosts = api.me.getPosts.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  if (!getPosts.data || !userData.data) return <Loading />;

  return (
    <>
      <div className="">
        {getPosts.data.pages.map((page) =>
          page.items.map((post) => (
            <div key={post.id} className="m-2 my-4 w-full rounded-lg bg-gray-800 p-3 px-4">
              <div className="">
                <div className="flex items-center gap-3">
                  <div>
                    {!!userData.data.image && (
                      <Image
                        alt="Profile Pic"
                        className="rounded-full"
                        width={40}
                        height={40}
                        src={userData.data.image}
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-md">{userData.data.name}</h3>
                    <h3 className="text-sm text-gray-100 opacity-80">
                      {moment(post.CreateAt).fromNow()}
                    </h3>
                  </div>
                </div>
                <h4 className="m-2 my-4 text-base">
                  {BadWordsFilter.clean(post.Body)}
                </h4>
                <div className="flex gap-4">
                  <h5 className="text-xs text-gray-200 opacity-80">
                    {post._count.Reactions} Reactions
                  </h5>
                  <h5 className="text-xs text-gray-200 opacity-80">
                    {post._count.Comments} Comments
                  </h5>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Postslist;
