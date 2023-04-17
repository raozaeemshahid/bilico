import type { Dispatch, SetStateAction} from 'react'
import { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";

const DropDownBody: React.FC<{
  isOpen: boolean;
  changeIsOpen: Dispatch<SetStateAction<boolean>>;
  options: { label: string; onClick: () => void }[];
}> = ({ options, isOpen = false, changeIsOpen }) => {
  if (!isOpen) return <></>;
  return (
    <>
      <div className="rounded-lg bg-gray-700 p-2 shadow-lg shadow-gray-900">
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

const TopRightDropDown: React.FC<{
  options: { label: string; onClick: () => void }[];
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
    <div className="flex w-full justify-end">
      <div className="absolute mx-1">
        <div className="flex flex-col items-end">
          <button
            onClick={() => changeIsOpen((isOpen) => !isOpen)}
            ref={TogglerRef}
          >
            <BsThreeDots />
          </button>
          <div ref={BodyRef}>
          <DropDownBody
            isOpen={isOpen}
            changeIsOpen={changeIsOpen}
            options={options}
          />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopRightDropDown;
