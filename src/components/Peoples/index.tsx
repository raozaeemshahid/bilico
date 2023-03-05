import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import HomeLayout from "../HomeLayout";
import SearchBox from "./SearchBox";
import { useState } from "react";
import SearchResults from "./Results";

const Home: React.FC = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });

  const [searchQuery, changeSearachQuery] = useState<{
    searchKeywords: string;
    requiredSkills: string[];
  }>();

  if (!userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-3xl font-bold">Peoples</h2>
        <SearchBox changeSearchQuery={changeSearachQuery} />
        {!!searchQuery && <SearchResults searchQuery={searchQuery} />}
      </div>
    </>
  );
};

export default Home;
