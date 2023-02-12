import { type Gender } from "@prisma/client";
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

const GenderComponent: React.FC<{ gender: Gender | null }> = ({ gender }) => {
  if (!gender) return <></>;
  return (
    <>
      <div className="flex items-center gap-2">
        {gender == "Male" && <BsGenderMale />}
        {gender == "Female" && <BsGenderFemale />}
        {gender == "Other" && <FaGenderless />}
        <h3>{gender}</h3>
      </div>
    </>
  );
};
export default GenderComponent;
