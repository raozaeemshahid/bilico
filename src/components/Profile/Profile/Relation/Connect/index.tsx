import { memo } from "react";
import Blocked from "./Blocked";
import ConnectComponent from "./Connected";
import RequestReceived from "./RequestReceived";
import RequestSent from "./RequestSent";
import Strangers from "./Strangers";

const Connect: React.FC<{
  relationWithVisitor:
    | "Blocked By Visitor"
    | "Request Sent"
    | "Request Recieved"
    | "Connected"
    | "Strangers";
}> = ({ relationWithVisitor }) => {
  if (relationWithVisitor == "Strangers") return <Strangers />;
  if (relationWithVisitor == "Request Sent") return <RequestSent />;
  if (relationWithVisitor == "Request Recieved") return <RequestReceived />;
  if (relationWithVisitor == "Blocked By Visitor") return <Blocked />;
  return <ConnectComponent />;
};
export default memo(Connect);
