import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import { LoadingFullScreen } from "../../components/Loading";

import EditAccount from "../../components/Edit/Account";
import { api } from "../../utils/api";
import HomeLayout from "../../components/HomeLayout";

const Account = () => {
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

  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;
  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;

  return (
    <>
      <Head>
        <title>Edit Account - Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomeLayout
        userInfo={{
          name: userInfo.data.name,
          newMessages: userInfo.data.newMessages,
          newNotifications: userInfo.data.newNotifications,
          newRequests: userInfo.data.newRequests,
        }}
      >
        <EditAccount />
      </HomeLayout>
    </>
  );
};

export default Account;
