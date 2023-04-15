import { memo } from "react";
const InfoText: React.FC<{
  userTrustsVisitor: boolean;
  doesFollowVisitor: boolean;
  pronounciation: string;
}> = ({ doesFollowVisitor, userTrustsVisitor, pronounciation }) => {
  const text: string[] = [];
  if (doesFollowVisitor) text.push("follows you");
  if (userTrustsVisitor) text.push("trusts you");

  if (text.length == 0) return <></>;
  return (
    <h2 className="text-sm text-gray-300">
      {pronounciation} {text.join(" and ")}
    </h2>
  );
};
export default memo(InfoText);
