import type { NextPage } from "next";

import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { LoadingFullScreen } from "../Loading";
const Home: NextPage = () => {
  const { status } = useSession();

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  
  if (!userInfo.data || !userInfo.data.success)
    return <LoadingFullScreen text="Getting Things Ready" />;

  return <>Hello</>;
};

export default Home;
