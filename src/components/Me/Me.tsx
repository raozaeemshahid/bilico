import { type NextPage } from "next";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { api } from "../../utils/api";
import { signOut, useSession } from "next-auth/react";
import { LoadingFullScreen } from "../loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import { NavbarLinkCreator } from "../../lib/NavbarLinkProvider";
import { Session } from "next-auth";

const Home: React.FC = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(PagesLinks.getLoginLink());
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
      <Navbar links={[NavbarLinkCreator.HomeLink()]} />
    </>
  );
};

export default Home;
