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
  userName: string;
}> = ({ relationWithVisitor, userName }) => {
  if (relationWithVisitor == "Strangers")
    return <Strangers userName={userName} />;
  if (relationWithVisitor == "Request Sent")
    return <RequestSent userName={userName} />;
  if (relationWithVisitor == "Request Recieved")
    return <RequestReceived userName={userName} />;
  if (relationWithVisitor == "Blocked By Visitor")
    return <Blocked userName={userName} />;
  return <ConnectComponent userName={userName} />;
};
export default memo(Connect);
