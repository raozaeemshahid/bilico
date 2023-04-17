import CompactNumberFormatter from "../../utils/CompactNumberFormatter";

interface Props<T> {
  tabList: T[];
  currentTab: T;
  changeCurrentTab: (id: T) => void;
  count: { [index: string]: number };
}

const SmallTabs = <T extends string>({
  changeCurrentTab,
  currentTab,
  tabList,
  count,
}: Props<T>) => {
  return (
    <>
      <div className="flex flex-wrap justify-center">
        {tabList.map((tab) => {
          return (
            <div
              key={tab}
              className={`mx-1 my-1 inline-block rounded-t-lg border border-gray-900 text-xs font-semibold shadow-md shadow-gray-900 xs:text-sm ${
                tab == currentTab
                  ? "bg-gray-900 text-gray-300"
                  : "text-gray-100 hover:bg-gray-500 hover:text-gray-300"
              }`}
            >
              <button
                onClick={() => changeCurrentTab(tab)}
                className="whitespace-nowrap  px-5 py-1"
              >
                {`${
                  count[tab]
                    ? `${CompactNumberFormatter.format(count[tab] || 0)} `
                    : ``
                } ${tab}`}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SmallTabs;
