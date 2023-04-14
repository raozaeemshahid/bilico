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
    isTrustedByVisitor: boolean;
    userTrustsVisitor: boolean;
  };
}> = () => {
  return <div className="flex items-center justify-center"></div>;
};
export default Relation;
