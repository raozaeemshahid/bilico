import { type NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { LoadingFullScreen } from "../components/loading";
import { useEffect } from "react";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { api } from "../utils/api";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("../components/Home/Home"), {
  loading: () => <LoadingFullScreen text="Getting Things Ready" />,
});

const Home: NextPage = () => {
  const { data: userSession, status } = useSession();
  const router = useRouter();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: router.isReady && status === "authenticated",
    onSuccess(user) {
      if (user.banned) return router.push(PagesLinks.BANNED_LINK);
      if (user.deactivated) return router.push(PagesLinks.DEATIVATED_LINK);
      if (user.notRegistered) return router.push(PagesLinks.REGISTER_LINK);
      // if (user.incompleteProfile)
      //   return router.push(PagesLinks.EDIT_ACCOUNT_LINK);
      if (user.notFound) {
        signOut();
        router.push(PagesLinks.getLoginLink());
        return;
      }
    },
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (status == "unauthenticated")
      router.push(PagesLinks.getLoginLink(router));
  }, [router, router.isReady, status]);

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;

  if (!userInfo.data) return <LoadingFullScreen text="Loading Data" />;
  if (!userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;
  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta
          name="description"
          content="Let's Connect, Learn and Grow Together"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </>
  );
};

export default Home;
