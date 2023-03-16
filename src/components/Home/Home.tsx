import type { NextPage } from "next";

import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../Loading";
import HomeLayout from "../HomeLayout";
const Home: NextPage = () => {
  const { data: userSession, status } = useSession();

  // const deleteMe = trpc.me.deleteMyAccount.useMutation();
  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;

  return <>Hello</>;
};

export default Home;
