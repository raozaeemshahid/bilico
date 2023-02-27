import { useEffect, useState } from "react";
import { api } from "../../../../../utils/api";
import { Interest } from "@prisma/client";

const InterestFound: React.FC<{ postBody: string }> = ({ postBody }) => {
  const [interestsFoundInPost, changeInterestsFound] = useState<Interest[]>([]);
  const allInterests = api.me.getAllInterestsAndSkills.useQuery();
  useEffect(() => {
    if (!allInterests.isSuccess) return;
    const words = postBody.toLowerCase();
    const interestsFound: string[] = [];
    allInterests.data.interests.forEach((interest) => {
      if (words.includes(interest.title.toLowerCase()))
        interestsFound.push(interest.title);
    });
    console.log("InterestFound", interestsFound);
    changeInterestsFound(
      allInterests.data.interests.filter(
        (interest) =>
          !!interestsFound.find(
            (i) => i.toLowerCase() == interest.title.toLowerCase()
          )
      )
    );
  }, [allInterests.isSuccess]);
  return (
    <div className="m-1">
      <div className="flex gap-2">
        {interestsFoundInPost.map((interest) => (
          <h3 key={interest.id}>{interest.title}</h3>
        ))}
      </div>
    </div>
  );
};
export default InterestFound;
