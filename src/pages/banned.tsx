import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { LoadingFullScreen } from "../components/Loading";
import Navbar from "../components/Navbar";
import PagesLinks from "../lib/PagesLink";
import { api } from "../utils/api";
import { getCallbackUrlFromRouter } from "../lib/helperFunctions";
import Head from "next/head";
import moment from "moment";

const Banned: NextPage = ({}) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink(router));
    },
  });
  const reportToAdmin = api.reportToAdmin.requestToUnban.useMutation();
  const [IsEligibleToApply, ChangeEligibility] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const amIBanned = api.me.amIBanned.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    retry: false,
    onSuccess(data) {
      if (data.userNotFound) {
        void signOut();
        return void router.push(PagesLinks.HOME_Link);
      }
      if (!data.isBanned || data.notBanned)
        return void router.push(getCallbackUrlFromRouter(router));
      ChangeEligibility(data.eligibleToApply);
    },
  });

  if (status === "loading") return <LoadingFullScreen text="Signing You In" />;
  if (amIBanned.isLoading || !amIBanned.data || !amIBanned.data.isBanned)
    return <LoadingFullScreen text="Loading Data" />;

  const SendRequest = () => {
    if (!messageInputRef || !messageInputRef.current || !IsEligibleToApply)
      return;
    reportToAdmin.mutate({
      message: messageInputRef.current.value,
    });
    ChangeEligibility(false);
  };
  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="container mx-auto px-5 py-24 lg:w-2/3">
        <div className="mb-12 flex w-full flex-col">
          {amIBanned.data.isBanned && (
            <h1 className="title-font mb-4 text-center font-medium text-white sm:text-2xl md:text-4xl">
              You&apos;ve been banned from Bilico
            </h1>
          )}
          {amIBanned.data.reason && (
            <p className="title-font text-base leading-relaxed">
              Reason: {amIBanned.data.reason}
            </p>
          )}
          {amIBanned.data.bannedUntil && (
            <p className="title-font text-base leading-relaxed">
              You&apos;ll be unbanned {moment(amIBanned.data.bannedUntil).fromNow()}
            </p>
          )}
        </div>
        {IsEligibleToApply && amIBanned.data.eligibleToApply && (
          <div className="mx-auto flex w-full flex-col items-end space-y-4 px-8 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="relative w-full flex-grow sm:mb-0">
              <label className="text-sm leading-7 text-gray-400">
                Request To Unban
              </label>
              <input
                type="text"
                id="full-name"
                name="full-name"
                ref={messageInputRef}
                placeholder="Write something on how do you reflect yourself?"
                className="w-full rounded border border-gray-700 bg-gray-800 bg-opacity-40 py-1 px-3 text-base leading-8 text-gray-100 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-900"
              />
            </div>
            <button
              onClick={SendRequest}
              className="rounded border-0 bg-indigo-500 py-2 px-8 text-lg text-white hover:bg-indigo-600 focus:outline-none"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Banned;
