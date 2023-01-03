import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PagesLinks from "../lib/PagesLink";
import { LoadingFullScreen } from "../components/loading";
import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic";
import Head from "next/head";

const Register = dynamic(() => import("../components/Register/Register"), {
  loading: () => <LoadingFullScreen text="Getting Things Ready" />,
});

const RegisterPage: NextPage = () => {
  const { data: userSession, status } = useSession();
  const router = useRouter();
  const userInfo = trpc.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
    onSuccess(user) {
      if (user.notRegistered) return;
      router.push(PagesLinks.HOME_Link);
    },
  });

  useEffect(() => {
    if (!router.isReady) return;
    if (status == "unauthenticated")
      router.push(PagesLinks.getLoginLink(router));
  }, [router, router.isReady, status]);

  if (status == "loading" || !userSession || !userSession.user)
    return <LoadingFullScreen text="Signing You In" />;

  if (!userInfo.data) return <LoadingFullScreen text="Loading Data" />;
  if (!userInfo.data.notRegistered)
    return <LoadingFullScreen text="Getting Things Ready" />;

  return (
    <>
      <Head>
        <title>Bilico</title>
        <meta
          name="description"
          content="Let's Connect, Learn and Grow Together"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Register />
    </>
  );
};

export default RegisterPage;
