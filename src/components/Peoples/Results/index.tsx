import { Skill } from "@prisma/client";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import User from "./User";

const SearchResults: React.FC<{
  searchQuery: { searchKeywords: string; requiredSkills: string[] };
}> = ({ searchQuery }) => {
  const apiResults = api.publicApi.searchPeoples.useInfiniteQuery({
    limit: 1,
    requiredSkills: searchQuery.requiredSkills,
    searchKeywords: searchQuery.searchKeywords,
  });
  console.log("apiResults", apiResults);
  if (!apiResults.data) return <Loading />;
  return (
    <>
      <div className="flex flex-col sm:mx-4 w-full gap-4">
        {apiResults.data.pages.map((page) =>
          page.items.map((user) => (
            <User
              key={user.id}
              id={user.id}
              image={user.image}
              name={user.name}
              skills={user.Skills}
            />
          ))
        )}
      </div>
    </>
  );
};

export default SearchResults;
