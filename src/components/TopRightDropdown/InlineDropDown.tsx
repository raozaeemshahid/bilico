import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { BsThreeDots } from "react-icons/bs";
import { DropDownOption } from ".";

const DropDownBody: React.FC<{
  isOpen: boolean;
  changeIsOpen: Dispatch<SetStateAction<boolean>>;
  options: DropDownOption[];
}> = ({ options, isOpen = false, changeIsOpen }) => {
  if (!isOpen) return <></>;
  return (
    <>
      <div className="mt-1 rounded-lg bg-gray-700 p-1 shadow-lg shadow-gray-900">
        {options.map((option) => (
          <div
            key={option.label}
            onClick={() => {
              option.onClick();
              changeIsOpen(false);
            }}
            className="w-full rounded-md p-1 px-4 hover:cursor-pointer hover:bg-gray-800"
          >
            {option.label}
          </div>
        ))}
      </div>
    </>
  );
};

const DropDown: React.FC<{
  options: DropDownOption[];
}> = ({ options }) => {
  const [isOpen, changeIsOpen] = useState(false);
  const BodyRef = useRef<HTMLDivElement>(null);
  const TogglerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        BodyRef.current &&
        !BodyRef.current.contains(e.target as Node) &&
        !TogglerRef.current?.contains(e.target as Node)
      )
        changeIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="flex items-center justify-end">
      <div className="flex flex-col items-end">
        <button
          onClick={() => changeIsOpen((isOpen) => !isOpen)}
          ref={TogglerRef}
        >
          <BsThreeDots />
        </button>
        <div ref={BodyRef} className="absolute mt-2">
          <DropDownBody
            isOpen={isOpen}
            changeIsOpen={changeIsOpen}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};
export default DropDown;
