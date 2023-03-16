import type { NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { LoadingFullScreen } from "../../components/Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import { api } from "../../utils/api";

import HomeLayout from "../../components/HomeLayout";

const Deactivate: NextPage = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });
  const deactivateApi = api.me.DeactivateAccount.useMutation();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: router.isReady && status === "authenticated",
    onSuccess(user) {
      if (user.banned) return void router.push(PagesLinks.BANNED_LINK);
      if (user.deactivated) return void router.push(PagesLinks.DEACTIVATED_LINK);
      if (user.notRegistered) return void router.push(PagesLinks.REGISTER_LINK);
      if (user.incompleteProfile)
        return void router.push(PagesLinks.EDIT_ACCOUNT_LINK);
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
  const deactivate = () => {
    void deactivateApi.mutateAsync().then(() => {
      void signOut();
      void router.push(PagesLinks.getLoginLink());
    });
  };
  if (deactivateApi.isLoading) return <LoadingFullScreen />;
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
        <div className="my-2 flex flex-col gap-3 xs:mx-3">
          <h2 className="text-center text-3xl font-bold">Deactivate Account</h2>
          <p className="text-gray-300">
            It&apos;s ok to take a break from social media, deactivating your account
            means you won&apos;t appear in any search results and no one will be able
            to see your profile, although they can see your posts, comments and
            reactions so far.
          </p>
          <p className="text-gray-300">
            Once deactivated, You can reactivate your account anytime by logging
            in again.
          </p>
          <div className="flex min-w-fit flex-row-reverse flex-wrap justify-start">
            <button
              className="m-2 flex rounded bg-red-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-red-700"
              onClick={deactivate}
            >
              Deactivate
            </button>
            <button
              className="m-2 flex rounded bg-blue-500 py-2 px-4 font-bold text-white shadow-sm shadow-blue-500 hover:bg-blue-700"
              onClick={() => {
                void router.push(PagesLinks.HOME_Link);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </HomeLayout>
    </>
  );
};

export default Deactivate;
