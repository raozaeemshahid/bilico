import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "../../../utils/api";
import Loading from "../../Loading";
import { useState } from "react";
import type { Interest, Skill } from "@prisma/client";
import Select from "react-select";
import { toast } from "react-toastify";

const EditBody: React.FC = () => {
  const router = useRouter();
  const { status } = useSession();

  const utils = api.useContext();

  const editMyAccount = api.me.editAccount.useMutation({
    onSuccess: () => {
      void utils.me.data.invalidate();
    },
  });

  const [selectedSkill, changeSelectedSkill] = useState<Skill[]>([]);
  const [selectedInterest, changeSelectedInterest] = useState<Interest[]>([]);

  const userInfo = api.me.info.useQuery(undefined, {
    enabled: status === "authenticated" && router.isReady,
  });
  const userData = api.me.data.useQuery(undefined, {
    enabled: status === "authenticated",
    onSuccess(data) {
      if (selectedSkill.length < 0 || selectedInterest.length < 0) return;
      changeSelectedInterest(data.Interests);
      changeSelectedSkill(data.Skills);
    },
  });
  const listInterestsAndSkills = api.me.getAllInterestsAndSkills.useQuery(
    undefined,
    {
      enabled: status === "authenticated" && userData.isSuccess,
    }
  );

  if (
    !userInfo.data ||
    !userData.data ||
    !userData.data.success ||
    !listInterestsAndSkills.data
  )
    return <Loading text="Loading Data" />;

  const SaveNewChanges = () => {
    const addedSkills: string[] = selectedSkill
      .filter(
        (currentSelectedSkill) =>
          userData.data.Skills.findIndex(
            (skill) => currentSelectedSkill.id == skill.id
          ) < 0
      )
      .map((skill) => skill.id);

    const addedInterests: string[] = selectedInterest
      .filter(
        (currentSelectedInterest) =>
          userData.data.Interests.findIndex(
            (interest) => interest.id == currentSelectedInterest.id
          ) < 0
      )
      .map((interest) => interest.id);

    const removedSkills: string[] = userData.data.Skills.filter(
      (skill) =>
        selectedSkill.findIndex(
          (currentSelectedSkill) => currentSelectedSkill.id == skill.id
        ) < 0
    ).map((skill) => skill.id);

    const removedInterests: string[] = userData.data.Interests.filter(
      (interest) =>
        selectedInterest.findIndex(
          (currentSelectedInterest) => currentSelectedInterest.id == interest.id
        ) < 0
    ).map((interest) => interest.id);

    if (
      addedInterests.length == 0 &&
      addedSkills.length == 0 &&
      removedInterests.length == 0 &&
      removedSkills.length == 0
    )
      return;

    void toast.promise(
      editMyAccount.mutateAsync({
        addedInterests,
        addedSkills,
        removedInterests,
        removedSkills,
      }),
      {
        error: "Couldn't Save",
        pending: "Saving Changes",
        success: "Saved",
      }
    );
  };
  return (
    <>
      <h1 className="m-5 text-center text-4xl font-bold">Edit Account</h1>

      <div className="m-4">
        <h3 className="my-4 text-3xl font-semibold">Interests</h3>
        <Select
          onChange={(interests) =>
            changeSelectedInterest(
              [...interests].map((interest) => ({
                id: interest.value,
                title: interest.label,
              }))
            )
          }
          styles={{
            option: (style) => ({ ...style, color: "black" }),
            control: (style) => ({
              ...style,
              backgroundColor: "rgb(75, 85, 99)",
            }),
            multiValue: (style) => ({
              ...style,
              backgroundColor: "rgb(22, 163, 74)",
              fontSize: "18px",
              padding: "3px",
              fontWeight: "700",
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
          defaultValue={userData.data.Interests.map((interest) => ({
            label: interest.title,
            value: interest.id,
          }))}
          isMulti={true}
          name="Interests"
          options={listInterestsAndSkills.data.interests
            .sort(
              (a, b) =>
                a.title.toLowerCase().charCodeAt(0) -
                b.title.toLowerCase().charCodeAt(0)
            )
            .map((interest) => ({
              label: interest.title,
              value: interest.id,
            }))}
        />
      </div>

      <div className="m-4">
        <h3 className="my-4 text-3xl font-semibold">Skills</h3>
        <Select
          onChange={(skill) =>
            changeSelectedSkill(
              [...skill].map((skill) => ({
                id: skill.value,
                title: skill.label,
              }))
            )
          }
          styles={{
            option: (style) => ({ ...style, color: "black" }),
            control: (style) => ({
              ...style,
              backgroundColor: "rgb(75, 85, 99)",
            }),
            multiValue: (style) => ({
              ...style,
              backgroundColor: "rgb(8, 125, 178)",
              fontSize: "18px",
              padding: "3px",
              fontWeight: "700",
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
          defaultValue={userData.data.Skills.map((skill) => ({
            label: skill.title,
            value: skill.id,
          }))}
          isMulti={true}
          name="Skills"
          options={listInterestsAndSkills.data.skills
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
      <div className="flex items-center justify-end">
        <div>
          {editMyAccount.isLoading ? (
            <Loading />
          ) : (
            <button
              className="m-4 flex rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
              onClick={SaveNewChanges}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EditBody;
