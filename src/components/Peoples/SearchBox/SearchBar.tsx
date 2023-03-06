import { Dispatch, SetStateAction } from "react";

const SearchBar: React.FC<{
  searchKeywords: string;
  changeSearchKeywords: Dispatch<SetStateAction<string>>;
}> = ({ changeSearchKeywords, searchKeywords }) => {
  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-2 rounded-lg border border-gray-400 xs:px-2 sm:flex-nowrap">
        <h2 className="whitespace-nowrap text-lg font-semibold">Name </h2>
        <input
          className="w-full rounded-md bg-transparent py-2 text-gray-100 focus:outline-none "
          type="text"
          onChange={(e) => {
            changeSearchKeywords(e.target.value);
          }}
          value={searchKeywords}
          placeholder="Type..."
        />
      </div>
    </>
  );
};

export default SearchBar;
