import type { Gender } from "@prisma/client";
import Connect from "./Connect";
import Follow from "./Follow";
import InfoText from "./Text";
import Trust from "./Trust";

const Relation: React.FC<{
  following: {
    doesFollowVisitor: boolean;
    isFollowedByVisitor: boolean;
  };
  relationWithVisitor:
    | "Blocked By Visitor"
    | "Request Sent"
    | "Request Recieved"
    | "Connected"
    | "Strangers";
  trust: {
    userTrustsVisitor: boolean;
    isTrustedByVisitor: boolean;
  };
  Gender: Gender | null;
  userName: string;
}> = ({ Gender, trust, following, relationWithVisitor, userName }) => {
  return (
    <div className="mt-1 flex flex-col items-center justify-center gap-2">
      <InfoText
        pronounciation={
          Gender == "Male"
            ? "He"
            : Gender == "Female"
            ? "She"
            : userName.split(" ")[0] || "They"
        }
        userTrustsVisitor={trust.userTrustsVisitor}
        doesFollowVisitor={following.doesFollowVisitor}
      />
      <div className="flex gap-2 text-sm">
        <Connect
          relationWithVisitor={relationWithVisitor}
          userName={userName}
        />
        {relationWithVisitor !== "Blocked By Visitor" && (
          <Follow
            following={following.isFollowedByVisitor}
            userName={userName}
          />
        )}
        {relationWithVisitor !== "Blocked By Visitor" && (
          <Trust trusts={trust.isTrustedByVisitor} userName={userName} />
        )}
      </div>
    </div>
  );
};
export default Relation;
