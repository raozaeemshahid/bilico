import { type NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { LoadingFullScreen } from "../components/Loading";
// import { useEffect } from "react";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { api } from "../utils/api";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("../components/Home/Home"), {
  loading: () => <LoadingFullScreen text="Getting Things Ready" />,
});

const Home: NextPage = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink(router));
    },
  });

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: router.isReady && status === "authenticated",
    onSuccess(user) {
      if (user.banned) return void router.push(PagesLinks.BANNED_LINK);
      if (user.deactivated) return void router.push(PagesLinks.DEATIVATED_LINK);
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
  if (!userInfo.data.success)
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
      <HomePage />
    </>
  );
};

export default Home;
