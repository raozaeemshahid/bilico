import type { NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { LoadingFullScreen } from "../components/Loading";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { api } from "../utils/api";

import HomePage from "../components/Home/Home";
import HomeLayout from "../components/HomeLayout";

const Home: NextPage = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: router.isReady && status === "authenticated",
    onSuccess(user) {
      if (user.banned) return void router.push(PagesLinks.BANNED_LINK);
      if (user.deactivated)
        return void router.push(PagesLinks.DEACTIVATED_LINK);
      if (user.notRegistered) return void router.push(PagesLinks.REGISTER_LINK);
      if (user.notFound) {
        void signOut();
        void router.push(PagesLinks.getLoginLink());
        return;
      }
    },
  });

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;

  if (!userInfo.data) return <LoadingFullScreen text="Loading Data" />;
  if (!userInfo.data.success || userInfo.data.incompleteProfile)
    return <LoadingFullScreen text="Getting Things Ready" />;
  if (userInfo.data.name !== userSession.user.name) {
    void signOut();
    void router.push(PagesLinks.getLoginLink());
    return <LoadingFullScreen />;
  }
  return (
    <>
      <Head>
        <title>Bilico</title>
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
        <HomePage />
      </HomeLayout>
    </>
  );
};

export default Home;
