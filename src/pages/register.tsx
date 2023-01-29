import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PagesLinks from "../lib/PagesLink";
import { LoadingFullScreen } from "../components/loading";
import { api } from "../utils/api";
import dynamic from "next/dynamic";
import Head from "next/head";

const Register = dynamic(() => import("../components/Register/Register"), {
  loading: () => <LoadingFullScreen text="Getting Things Ready" />,
});

const RegisterPage: NextPage = () => {
  const router = useRouter();

  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push(PagesLinks.getLoginLink(router));
    },
  });

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    onSuccess(user) {
      if (user.notRegistered) return;
      router.push(PagesLinks.HOME_Link);
    },
  });

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;
  if (!userInfo.data) return <LoadingFullScreen text="Loading Data" />;
  if (!userInfo.data.notRegistered)
    return <LoadingFullScreen text="Getting Things Ready" />;

  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Register />
    </>
  );
};

export default RegisterPage;
