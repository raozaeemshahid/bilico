import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import Loading, { LoadingFullScreen } from "../Loading";
import { useRouter } from "next/router";
import PagesLinks from "../../lib/PagesLink";
import HomeLayout from "../HomeLayout";
import Profile from "./Profile";
import Tabs from "./Tabs";

const ProfileComponent: React.FC<{userId: string}> = ({userId}) => {
  const router = useRouter();
  const { data: userSession, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      void router.push(PagesLinks.getLoginLink());
    },
  });


  if (!userSession || !userSession.user)
    return <Loading text="Signing You In" />;
  return (
    <>
      <Profile userId={userId} />
      <Tabs userId={userId} />
    </>
  );
};

export default ProfileComponent;
