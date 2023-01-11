import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingFullScreen } from "../../components/loading";
import PagesLinks from "../../lib/PagesLink";
import Head from "next/head";

const Profile: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.push(PagesLinks.ME);
  }, [router, router.isReady]);

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
      <LoadingFullScreen />
    </>
  );
};

export default Profile;
