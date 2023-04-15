import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingFullScreen } from "../../components/Loading";
import PagesLinks from "../../lib/PagesLink";
import Head from "next/head";

const Profile: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    void router.push(PagesLinks.ME);
  }, [router, router.isReady]);

  return (
    <>
      <Head>
        <title>Profile - Bilico</title>
        <meta name="description" content="A Social Media For Professionals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoadingFullScreen />
    </>
  );
};

export default Profile;
