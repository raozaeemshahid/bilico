import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Navbar from "../../../components/Navbar";
import { NavbarLinkCreator } from "../../../lib/NavbarLinkProvider";
import { useEffect, useState } from "react";
import { LoadingFullScreen } from "../../../components/loading";
import { useRouter } from "next/router";
import PagesLinks from "../../../lib/PagesLink";

const Profile: NextPage = () => {
  const { data: userSession, status } = useSession();
  const router = useRouter();

  const [userId, changeUserId] = useState<string>();

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.userId) {
      router.push(PagesLinks.NOT_FOUND_LINK);
      return;
    }
    if (status == "unauthenticated") {
      router.push(PagesLinks.getLoginLink(router));
    }
  }, [router.isReady, status]);

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;

  return (
    <>
      <Navbar links={[NavbarLinkCreator.HomeLink()]} />
    </>
  );
};

export default Profile;
