import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import moment from "moment";
import { AiOutlineUser } from "react-icons/ai";
import { RiCakeLine } from "react-icons/ri";
import { MdOutlinePlace } from "react-icons/md";
import dynamic from "next/dynamic";

const BsGenderFemale = dynamic(() =>
  import("react-icons/bs").then((icons) => icons.BsGenderFemale)
);
const BsGenderMale = dynamic(() =>
  import("react-icons/bs").then((icons) => icons.BsGenderMale)
);
const FaGenderless = dynamic(() =>
  import("react-icons/fa").then((icons) => icons.FaGenderless)
);
const BioData: React.FC = () => {
  const { status } = useSession();
  // const userInfo = api.me.info.useQuery(undefined, {
  //   enabled: status === "authenticated" && router.isReady,
  // });
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (!userData.data || !userData.data.success)
    return <Loading text="Loading Data" />;

  return (
    <>
      <div className="roudned flex min-w-fit w-full flex-col gap-1 border-2 sm:border-r-0 sm:border-t-0 border-gray-400 rounded-lg bg-gray-800 p-3">
        <h3 className="flex items-center gap-2">
          <AiOutlineUser /> Joined {moment(userData.data.createdAt).fromNow()}
        </h3>

        {!!userData.data.Gender && (
          <div className="flex items-center gap-2">
            {userData.data.Gender == "Male" && <BsGenderMale />}
            {userData.data.Gender == "Female" && <BsGenderFemale />}
            {userData.data.Gender == "Other" && <FaGenderless />}
            <h3>{userData.data.Gender}</h3>
          </div>
        )}
        {!!userData.data.DateOfBirth && (
          <h3 className="flex items-center gap-2">
            <RiCakeLine />
            {moment().diff(moment(userData.data.DateOfBirth), "years")} Years
            old
          </h3>
        )}
        {!!userData.data.Country && (
          <h3 className="flex items-center gap-2">
            <MdOutlinePlace />
            {userData.data.Country}
          </h3>
        )}
      </div>
    </>
  );
};

export default BioData;
