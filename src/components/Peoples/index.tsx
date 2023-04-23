import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../Loading";
import { useRouter } from "next/router";
import SearchBox from './SearchBox'
import type { SearchInTab } from "./SearchBox";
import { useState } from "react";
import SearchResults from "./Results";

export interface PeopleSearchQuery {
  searchKeywords: string;
  requiredSkills: string[];
  searchIn: SearchInTab;
}
const Peoples: React.FC = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });

  const [searchQuery, changeSearachQuery] = useState<PeopleSearchQuery>();

  if (!userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="my-2 text-3xl font-bold">Peoples</h2>
        <SearchBox
          changeSearchQuery={changeSearachQuery}
          searchQuery={searchQuery}
        />
        {!!searchQuery && <SearchResults searchQuery={searchQuery} />}
      </div>
    </>
  );
};

export default Peoples;
