import { Skill } from "@prisma/client";
import { api } from "../../../utils/api";
import FetchMoreInfiniteComponent from "../../FetchMoreInfiniteQueryComponent";
import Loading from "../../Loading";
import User from "./User";

const SearchResults: React.FC<{
  searchQuery: { searchKeywords: string; requiredSkills: string[] };
}> = ({ searchQuery }) => {
  const apiResults = api.publicApi.searchPeoples.useInfiniteQuery(
    {
      limit: 10,
      requiredSkills: searchQuery.requiredSkills,
      searchKeywords: searchQuery.searchKeywords,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  if (!apiResults.data) return <Loading />;
  return (
    <>
      <div className="mx-5 flex w-full flex-col gap-5 sm:p-2 ">
        {apiResults.data.pages.map((page) =>
          page.items.map((user) => (
            <User
              key={user.id}
              id={user.id}
              image={user.image}
              name={user.name}
              skills={user.Skills}
              bio={user.Bio}
            />
          ))
        )}
        <FetchMoreInfiniteComponent
          endingMsg="You're all caught up!"
          fetchNextPage={apiResults.fetchNextPage}
          hasNextPage={apiResults.hasNextPage}
          isFetchingNextPage={apiResults.isFetchingNextPage}
        />
      </div>
    </>
  );
};

export default SearchResults;
