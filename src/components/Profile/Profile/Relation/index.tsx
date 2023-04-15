import { Gender } from "@prisma/client";
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
    | "Blocked By Vistor"
    | "Request Sent"
    | "Request Recieved"
    | "Connected"
    | "Strangers";
  trust: {
    userTrustsVisitor: boolean;
    isTrustedByVisitor: boolean;
  };
  Gender: Gender | null;
}> = ({ Gender, trust, following, relationWithVisitor }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <InfoText
        pronounciation={
          Gender == "Male" ? "He" : Gender == "Female" ? "She" : "They"
        }
        userTrustsVisitor={trust.userTrustsVisitor}
        doesFollowVisitor={following.doesFollowVisitor}
      />
      <div className="flex gap-2 text-sm">
        <Connect relationWithVisitor={relationWithVisitor} />
        {relationWithVisitor !== "Blocked By Vistor" && (
          <Follow following={following.isFollowedByVisitor} />
        )}
        {relationWithVisitor !== "Blocked By Vistor" && (
          <Trust trusts={trust.isTrustedByVisitor} />
        )}
      </div>
    </div>
  );
};
export default Relation;
