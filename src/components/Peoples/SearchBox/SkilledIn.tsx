import type { Skill } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import Select from "react-select";

const SkilledIn: React.FC<{
  allSkill: Skill[];
  changeSelectedSkill: Dispatch<SetStateAction<Skill[]>>;
}> = ({ allSkill, changeSelectedSkill }) => {
  return (
    <>
      <div className="flex flex-wrap items-center border border-gray-400 w-full rounded-lg xs:px-2 sm:flex-nowrap">
        <h2 className="whitespace-nowrap text-lg font-semibold">Skilled In</h2>
        <div className="flex w-full flex-wrap items-center rounded-lg md:flex-nowrap">
          <Select
            onChange={(skills) =>
              changeSelectedSkill(
                [...skills].map((skill) => ({
                  id: skill.value,
                  title: skill.label,
                }))
              )
            }
            isClearable={false}
            styles={{
              option: (style) => ({ ...style, color: "black" }),
              control: (style) => ({
                ...style,
                border: "0px",
                backgroundColor: "transparent",
              }),
              multiValue: (style) => ({
                ...style,
                // backgroundColor: "rgb(22, 163, 74)",
                backgroundColor: "rgb(8, 125, 178)",
                fontSize: "15px",
                padding: "3px",
                fontWeight: "600",
                borderRadius: "8px",
              }),
              multiValueLabel: (style) => ({
                ...style,
                color: "rgb(243, 244, 246)",
              }),
            }}
            classNames={{
              control: () => "p-1 ",
              multiValue: () => "text-blue-100",
            }}
            isMulti={true}
            name="Skills"
            options={allSkill
              .sort(
                (a, b) =>
                  a.title.toLowerCase().charCodeAt(0) -
                  b.title.toLowerCase().charCodeAt(0)
              )
              .map((skill) => ({
                label: skill.title,
                value: skill.id,
              }))}
          />
        </div>
      </div>
    </>
  );
};

export default SkilledIn;
