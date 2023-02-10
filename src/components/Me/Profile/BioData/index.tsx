import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../../../utils/api";
import Loading from "../../../Loading";
import moment from "moment";
import Gender from "./Gender";
import { AiOutlineUser } from "react-icons/ai";
import { FaBirthdayCake } from "react-icons/fa";

const BioData: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();
  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });
  const userData = api.me.data.useQuery(undefined, {
    enabled: userInfo.data && userInfo.data.success,
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;
  console.log(userData.data);

  return (
    <>
      <div className="flex w-full flex-wrap sm:flex-nowrap">
        <div className="roudned m-2 flex w-full flex-col gap-1 rounded-lg bg-gray-600 p-3">
          <h3 className="flex items-center gap-2">
            <AiOutlineUser /> Joined {moment(userData.data.createdAt).fromNow()}
          </h3>
          <Gender gender={userData.data.Gender} />
          <h3 className="flex items-center gap-2">
            <FaBirthdayCake />{" "}
            {moment().diff(moment(userData.data.DateOfBirth), "years")} Years
            Old
          </h3>
        </div>
        <div className="roudned m-2 w-full rounded-lg bg-gray-600 p-3">
          Interests
        </div>
      </div>
    </>
  );
};

export default BioData;
