import { type NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import Navbar from "../components/Navbar";
import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import { LoadingFullScreen } from "../components/loading";
import { useEffect } from "react";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: userSession, status } = useSession();
  const router = useRouter();
  const deleteMe = trpc.me.deleteMyAccount.useMutation();
  const userInfo = trpc.me.info.useQuery(undefined, {
    enabled: router.isReady && status === "authenticated",
    onSuccess(user) {
      if (user.banned) return router.push(PagesLinks.getBannedLink());
      if (user.deactivated) return router.push(PagesLinks.getDeativatedLink());
      if (user.notRegistered) return router.push(PagesLinks.getRegisterLink());
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
      <Navbar
        links={[
          NavbarLinkCreator.BlogLink(),
          NavbarLinkCreator.questionLink(),
          NavbarLinkCreator.storyLink(),
          NavbarLinkCreator.profileLink(userSession),
        ]}
        btns={
          process.env.NODE_ENV === "development"
            ? [
                {
                  Text: "Delete",
                  onClick: async () => {
                    await deleteMe.mutateAsync();
                    signOut();
                  },
                },
              ]
            : undefined
        }
      />
    </>
  );
};

export default Home;
