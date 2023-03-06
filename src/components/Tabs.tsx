interface Props<T> {
  tabList: T[];
  currentTab: T;
  changeCurrentTab: (id: T) => void;
}

const Tabs = <T = any>({ changeCurrentTab, currentTab, tabList }: Props<T>) => {
  return (
    <>
      <ul className="flex flex-wrap justify-center">
        {tabList.map((tab) => (
          <li className="mx-2 my-2 sm:my-0">
            {tab == currentTab ? (
              <span
                className="active inline-block rounded-t-lg border-4 border-y-0 border-gray-900 bg-gray-900 p-4 py-3 text-gray-300 shadow-lg shadow-gray-900"
                aria-current="page"
              >
                {tab as string}
              </span>
            ) : (
              <button
                onClick={() => changeCurrentTab(tab)}
                className="inline-block rounded-t-lg border-4 border-y-0 border-gray-900 p-4 py-3 text-gray-100 shadow-lg shadow-gray-900  hover:bg-gray-500 hover:text-gray-300"
              >
                {tab as string}
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Tabs;
