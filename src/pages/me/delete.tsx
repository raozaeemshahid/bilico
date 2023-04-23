import type { NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { LoadingFullScreen } from "../../components/Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import { api } from "../../utils/api";

import HomeLayout from "../../components/HomeLayout";
import Link from "next/link";
import { toast } from "react-toastify";
import { useContext } from "react";
import { ModalContext } from "../_app";

const Delete: NextPage = () => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });
  const deleteMeApi = api.me.deleteMyAccount.useMutation();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: router.isReady && status === "authenticated",
    onSuccess(user) {
      if (user.banned) return void router.push(PagesLinks.BANNED_LINK);
      if (user.deactivated)
        return void router.push(PagesLinks.DEACTIVATED_LINK);
      if (user.notRegistered) return void router.push(PagesLinks.REGISTER_LINK);
      if (user.notFound) {
        void signOut();
        void router.push(PagesLinks.getLoginLink());
        return;
      }
    },
  });
  const controlModal = useContext(ModalContext);

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
  const deleteMe = () => {
    controlModal.changeModal({
      text: "Delete your account?",
      confirmText: "Delete",
      confirm: () => {
        void toast.promise(deleteMeApi.mutateAsync(), {
          error: "Couldn't Delete Account",
          pending: "Deleting Account",
          success: "Deleted",
        });
        void signOut().then(() => {
          void router.push(PagesLinks.getLoginLink());
        });
      },
    });
  };
  if (deleteMeApi.isLoading) return <LoadingFullScreen />;
  return (
    <>
      <Head>
        <title>Delete Account - Bilico</title>
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
          <h2 className="text-center text-3xl font-bold">Delete Account</h2>
          <p className="text-gray-300">
            Deleting your account means deleting all your data on bilico at
            once, this isn&apos;t scheduling to delete instead it&apos;ll delete
            your everything on bilico the moment you click on confirm deletion.
            Hence this action can&apos;t be undone, are you sure?
          </p>
          <p className="text-gray-300">
            If you want to take a break for while, consider{" "}
            <Link
              className="bg-text-600 cursor-pointer hover:underline"
              href={PagesLinks.DEACTIVATED_ME_LINK}
            >
              deactivation
            </Link>
            .
          </p>
          <div className="flex min-w-fit flex-row-reverse flex-wrap justify-start">
            <button
              className="m-2 flex rounded bg-red-600 py-2 px-4 font-bold text-white shadow-sm shadow-green-600 hover:bg-red-700"
              onClick={deleteMe}
            >
              Delete
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

export default Delete;
