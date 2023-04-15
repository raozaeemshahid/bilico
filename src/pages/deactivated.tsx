import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { LoadingFullScreen } from "../components/Loading";
import { api } from "../utils/api";
import { toast } from "react-toastify";

const Deactivated: NextPage = () => {
  const router = useRouter();
  const reactivateApi = api.me.ReactivateAccount.useMutation();

  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    onSuccess(user) {
      if (user.deactivated) return;
      void router.push(PagesLinks.HOME_Link);
    },
  });

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  if (!userInfo.data) return <LoadingFullScreen text="Loading Data" />;
  if (!userInfo.data.deactivated)
    return <LoadingFullScreen text="Getting Things Ready" />;

  const reactivate = () => {
    void toast
      .promise(reactivateApi.mutateAsync(), {
        error: "Couldn't Reactivate",
        pending: "Reactivating Account",
        success: "Account Reactivated",
      })
      .then(() => void router.push(PagesLinks.HOME_Link));
  };
  if (reactivateApi.isLoading) return <LoadingFullScreen />;

  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen w-screen items-center justify-center">
        <div>
          <h1 className="title-font mb-4 text-center font-medium text-gray-300 sm:text-2xl md:text-4xl">
            You&apos;ve been deactivated
          </h1>
          <div className="flex min-w-fit flex-wrap justify-center">
            <button
              className="m-2 flex rounded bg-green-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-green-700"
              onClick={() => {
                void signOut();
                void router.push(PagesLinks.getLoginLink());
              }}
            >
              Sign out
            </button>
            <button
              className="m-2 flex rounded bg-blue-500 py-2 px-4 font-bold text-white shadow-sm shadow-blue-500 hover:bg-blue-700"
              onClick={reactivate}
            >
              Reactivate
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Deactivated;
