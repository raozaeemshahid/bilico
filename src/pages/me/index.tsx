import type { NextPage } from "next";
import Navbar from "../../components/Navbar";
import { NavbarLinkCreator } from "../../lib/NavbarLinkProvider";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PagesLinks from "../../lib/PagesLink";
import { LoadingFullScreen } from "../../components/Loading";
import dynamic from "next/dynamic";
import { api } from "../../utils/api";

const MeComponent = dynamic(() => import("../../components/Me/Me"), {
  loading: () => <LoadingFullScreen text="Getting Things Ready" />,
});

const MyProfile: NextPage = () => {
  const router = useRouter();

  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(PagesLinks.getLoginLink(router));
    },
  });

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    onSuccess(data) {
      if (data.banned) return router.push(PagesLinks.BANNED_LINK);
      if (data.deactivated) return router.push(PagesLinks.DEATIVATED_LINK);
      if (data.notFound) {
        signOut();
        return router.push(PagesLinks.getLoginLink());
      }
      if (data.notRegistered) return router.push(PagesLinks.REGISTER_LINK);
    },
  });

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;

  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MeComponent />
    </>
  );
};

export default MyProfile;
