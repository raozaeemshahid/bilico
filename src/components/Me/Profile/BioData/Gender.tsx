import { type Gender } from "@prisma/client";

import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { FaGenderless } from "react-icons/fa";

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
