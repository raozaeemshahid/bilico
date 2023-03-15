import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import PagesLinks from "../lib/PagesLink";
import { LoadingFullScreen } from "../components/Loading";
import { api } from "../utils/api";

const Deactivated: NextPage = () => {
  const router = useRouter();

  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink(router));
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

  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto px-5 py-24 lg:w-2/3">
        <div className="mb-12 flex w-full flex-col">
          <h1 className="title-font mb-4 text-center font-medium text-gray-300 sm:text-2xl md:text-4xl">
            You've been deactivated
          </h1>
        </div>
      </div>
    </>
  );
};

export default Deactivated;
