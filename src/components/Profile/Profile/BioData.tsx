import moment from "moment";
import { AiOutlineUser } from "react-icons/ai";
import { RiCakeLine } from "react-icons/ri";
import { MdOutlinePlace } from "react-icons/md";
import dynamic from "next/dynamic";
import type { Gender } from "@prisma/client";

const BsGenderFemale = dynamic(() =>
  import("react-icons/bs").then((icons) => icons.BsGenderFemale)
);
const BsGenderMale = dynamic(() =>
  import("react-icons/bs").then((icons) => icons.BsGenderMale)
);
const FaGenderless = dynamic(() =>
  import("react-icons/fa").then((icons) => icons.FaGenderless)
);

const BioData: React.FC<{
  createdAt: Date;
  gender: Gender | null;
  age: number | null;
  country: string | null;
}> = ({ age, country, createdAt, gender }) => {
  return (
    <>
      <div className="roudned m-2 flex w-full min-w-fit flex-col gap-1 rounded-lg border-2 border-gray-400 bg-gray-800 p-3 sm:border-r-0 sm:border-t-0">
        <h3 className="flex items-center gap-2">
          <AiOutlineUser /> Joined {moment(createdAt).fromNow()}
        </h3>

        {!!gender && (
          <div className="flex items-center gap-2">
            {gender == "Male" && <BsGenderMale />}
            {gender == "Female" && <BsGenderFemale />}
            {gender == "Other" && <FaGenderless />}
            <h3>{gender}</h3>
          </div>
        )}
        {!!age && (
          <h3 className="flex items-center gap-2">
            <RiCakeLine />
            {age} Years old
          </h3>
        )}
        {!!country && (
          <h3 className="flex items-center gap-2">
            <MdOutlinePlace />
            {country}
          </h3>
        )}
      </div>
    </>
  );
};

export default BioData;
