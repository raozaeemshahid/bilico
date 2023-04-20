const splitAndGetStartingString = ({
  string,
  maxLength = 40,
}: {
  string: string;
  maxLength?: number;
}) => {
  if (string.length <= maxLength) return string;
  return (
    new Array(maxLength)
      .fill("")
      .map((_, index) => string[index] || "")
      .join("") + "..."
  );
};
export default splitAndGetStartingString;
