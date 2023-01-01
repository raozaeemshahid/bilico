import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingFullScreen } from "../../components/loading";
import PagesLinks from "../../lib/PagesLink";

export const getServerSideProps = () => {
  return {}
}

const Profile: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    router.push(PagesLinks.ME);
  }, [router.isReady]);

  return <LoadingFullScreen />;
};

export default Profile;
