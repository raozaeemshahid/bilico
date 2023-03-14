import Select from "react-select";
import { AllReactions } from "./Reactions";
interface Props<T> {
  tabList: T[];
  currentTab: T;
  changeCurrentTab: (id: T) => void;
}

const SmallTabs = <T extends string>({
  changeCurrentTab,
  currentTab,
  tabList,
}: Props<T>) => {
  return (
    <>
      <div className="block 2sm:hidden">
        <div className="flex justify-center">
          <Select
            className="basic-single"
            styles={{
              control: (style) => ({
                ...style,
                border: "0px",
                backgroundColor: "transparent",
              }),
              singleValue: (style) => ({ ...style, color: "white" }),
            }}
            classNamePrefix="select"
            defaultValue={{ label: tabList[0] }}
            isClearable={false}
            isSearchable={false}
            name="order-select"
            onChange={(data) => {
              if (!data || !data.label) return;
              changeCurrentTab(data.label);
            }}
            options={tabList.map((tab) => ({ label: tab }))}
          />
        </div>
      </div>
      <div className="hidden 2sm:block">
        <div className="flex flex-nowrap justify-center">
          {tabList.map((tab) => (
            <div
              key={tab}
              className="mx-1 my-2 inline-block rounded-t-lg border border-gray-900 shadow-lg shadow-gray-900 sm:my-0"
            >
              {tab == currentTab ? (
                <button
                  className="bg-gray-900 px-5 py-1 text-gray-300"
                  aria-current="page"
                >
                  {tab}
                </button>
              ) : (
                <button
                  onClick={() => changeCurrentTab(tab)}
                  className="px-5  py-1 text-gray-100 hover:bg-gray-500 hover:text-gray-300"
                >
                  {tab}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SmallTabs;
