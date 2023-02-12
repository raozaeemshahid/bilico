import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import Loading from "../../Loading";

const EditBody: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });
  const listInterestsAndSkills = api.me.getAllInterestsAndSkills.useQuery(
    undefined,
    {
      enabled: status === "authenticated",
    }
  );

  console.log(listInterestsAndSkills.data);

  if (!userData.data || !userData.data.success || !listInterestsAndSkills.data)
    return <Loading text="Loading Data" />;
  return <>Hello from EditBody</>;
};

export default EditBody;
