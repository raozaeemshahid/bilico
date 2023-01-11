import type { Dispatch, SetStateAction } from "react";
import { GrEdit } from "react-icons/gr";

const GenderComponent: React.FC<{
  gender: "Male" | "Female" | "Other" | undefined;
  changeGender: Dispatch<
    SetStateAction<"Male" | "Female" | "Other" | undefined>
  >;
}> = ({ changeGender, gender }) => {
  const SelectGender = (gen: "Male" | "Female" | "Other") => {
    changeGender(gen);
  };
  return (
    <>
      {gender === undefined ? (
        <div className="my-2">
          <h3 className="text-sm opacity-60">Select Your Gender</h3>
          <div className=" mt-1 flex flex-wrap">
            <button
              onClick={() => SelectGender("Male")}
              className="rounded-l border py-1 px-4  text-gray-800 shadow-sm hover:bg-gray-200"
            >
              Male
            </button>
            <button
              onClick={() => SelectGender("Female")}
              className="rounded-r border py-1 px-4  text-gray-800 shadow-sm hover:bg-gray-200"
            >
              Female
            </button>
            <button
              onClick={() => SelectGender("Other")}
              className="rounded-r border py-1 px-4  text-gray-800 shadow-sm hover:bg-gray-200"
            >
              Other
            </button>
          </div>
        </div>
      ) : (
        <div className="flex content-between items-center p-1">
          {`${
            gender !== "Male" && gender !== "Female" ? "Gender: " : ""
          } ${gender}`}
          <button
            onClick={() => {
              changeGender(undefined);
            }}
          >
            <GrEdit className="ml-2 hover:scale-110 active:scale-90" />
          </button>
        </div>
      )}
    </>
  );
};

export default GenderComponent;
