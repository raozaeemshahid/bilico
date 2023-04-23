import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { LoadingFullScreen } from "../../../components/Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../../lib/PagesLink";
import Head from "next/head";
import HomeLayout from "../../../components/HomeLayout";
import { api } from "../../../utils/api";
import { signOut } from "next-auth/react";
import { z } from "zod";
import ProfileComponent from "../../../components/Profile";
import FailedFullBodyComponent from "../../../components/FailedFullBodyComponent";

const Profile: NextPage = () => {
  const router = useRouter();

  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink(router));
    },
  });

  const [userId, changeUserId] = useState<string>();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    onSuccess(data) {
      if (data.banned) return void router.push(PagesLinks.BANNED_LINK);
      if (data.deactivated)
        return void router.push(PagesLinks.DEACTIVATED_LINK);
      if (data.notFound) {
        void signOut();
        return void router.push(PagesLinks.getLoginLink());
      }
      if (data.notRegistered) return void router.push(PagesLinks.REGISTER_LINK);
    },
  });

  const getProfile = api.publicApi.getProfile.useQuery(
    { userId: !!userId ? userId : "" },
    {
      enabled: !!userId,
    }
  );

  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.userId) {
      void router.push(PagesLinks.NOT_FOUND_LINK);
      return;
    }
    const parseUserId = z
      .string()
      .uuid()
      .safeParse(
        Array.isArray(router.query.userId)
          ? router.query.userId[0]
          : router.query.userId
      );
    if (!parseUserId.success)
      return void router.push(PagesLinks.NOT_FOUND_LINK);
    changeUserId(parseUserId.data);
  }, [router, router.isReady, status]);

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
  if (!userId || !getProfile.data)
    return <LoadingFullScreen text="Getting Things Ready" />;
  if (getProfile.data.notFound)
    return <FailedFullBodyComponent text="User not found" />;
  if (getProfile.data.userDeactivated)
    return <FailedFullBodyComponent text="User is deactivated" />;
  if (getProfile.data.blocked)
    return <FailedFullBodyComponent text="You've been blocked by user" />;
  if (!getProfile.data.success) return <LoadingFullScreen />;

  return (
    <>
      <Head>
        <title>{getProfile.data.name} - Bilico</title>
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
        <ProfileComponent userId={userId} />
      </HomeLayout>
    </>
  );
};

export default Profile;
