import HomeLayout from "../../HomeLayout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import PagesLinks from "../../../lib/PagesLink";
import { api } from "../../../utils/api";
import { LoadingFullScreen } from "../../Loading";
import EditBody from "./EditBody";

const EditAccount: React.FC = () => {
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
    <HomeLayout
      userInfo={{
        name: userInfo.data.name,
        newMessages: userInfo.data.newMessages,
        newNotifications: userInfo.data.newNotifications,
        newRequests: userInfo.data.newRequests,
      }}
    >
      <EditBody />
    </HomeLayout>
  );
};

export default EditAccount;
