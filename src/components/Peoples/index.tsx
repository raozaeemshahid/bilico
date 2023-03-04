import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import HomeLayout from "../HomeLayout";
import SearchBox from "./SearchBox";

const Home: React.FC = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });

  if (!userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;
  return (
    <>
      <HomeLayout
        userInfo={{
          name: userInfo.data.name,
          newMessages: userInfo.data.newMessages,
          newNotifications: userInfo.data.newNotifications,
          newRequests: userInfo.data.newRequests,
        }}
      >
        <div className="flex flex-col gap-2 items-center justify-center">
          <h2 className="text-3xl font-bold">Peoples</h2> 
          <SearchBox />
        </div>
      </HomeLayout>
    </>
  );
};

export default Home;
