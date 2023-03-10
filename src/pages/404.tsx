import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { NavbarLinkCreator } from "../lib/NavbarLinkProvider";
import { LoadingFullScreen } from "../components/Loading";
import Head from "next/head";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { api } from "../utils/api";
import { signOut } from "next-auth/react";
import HomeLayout from "../components/HomeLayout";

const NotFound: NextPage = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink(router));
    },
  });
  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    onSuccess(data) {
      if (data.banned) return void router.push(PagesLinks.BANNED_LINK);
      if (data.deactivated) return void router.push(PagesLinks.DEATIVATED_LINK);
      if (data.notFound) {
        void signOut();
        return void router.push(PagesLinks.getLoginLink());
      }
      if (data.incompleteProfile)
        return void router.push(PagesLinks.EDIT_ACCOUNT_LINK);
      if (data.notRegistered) return void router.push(PagesLinks.REGISTER_LINK);
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
        <div className="container mx-auto px-5 py-24 lg:w-2/3">
          <div className="mb-12 flex w-full flex-col">
            <h1 className="title-font mb-4 text-center font-medium text-gray-300 sm:text-2xl md:text-4xl">
              Content Is Not Accessible
            </h1>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default NotFound;
