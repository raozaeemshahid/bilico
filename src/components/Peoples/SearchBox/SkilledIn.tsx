import { Skill } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import Select from "react-select";

const SkilledIn: React.FC<{
  allSkill: Skill[];
  selectedSkill: Skill[];
  changeSelectedSkill: Dispatch<SetStateAction<Skill[]>>;
}> = ({ allSkill, changeSelectedSkill, selectedSkill}) => {
  return (
    <>
      <div className="flex items-center flex-wrap w-full rounded-lg md:flex-nowrap">
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
            control: () => "p-1",
            multiValue: () => "text-blue-100",
          }}
          // className="p-11"
          // defaultValue={selectedSkill.map((skill) => ({
          //   label: skill.title,
          //   value: skill.id,
          // }))}
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
    </>
  );
};

export default SkilledIn;
