import { Listbox } from "@headlessui/react";
import { FaAngleDown } from "react-icons/fa";

const ReadSelect = ({ chapters, currentChapter, onChange }) => {

  const handleChange = (value) => {
    if (onChange) onChange(value);
  };

  return (
    <Listbox value={currentChapter?.id} onChange={handleChange}>
      <div className="relative w-28 sm:w-32 md:w-40  ">
      
        
        <Listbox.Button className="bg-surface text-text-primary p-1 sm:p-1.5 md:p-2 rounded-md text-sm w-full text-left cursor-pointer">
          { currentChapter? `Chapter ${currentChapter?.number}` : "Loading..."}
            <span className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-xs">
              <FaAngleDown />
            </span>
        </Listbox.Button>

        <Listbox.Options className="absolute mt-1 w-full bg-white rounded-md shadow-md z-10 cursor-pointer overflow-y-auto max-h-60">
          {chapters.map((chpt) => (
            <Listbox.Option
              key={chpt.id}
              value={chpt.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              Chapter {chpt.number || "?"}
            </Listbox.Option>
          ))}
        </Listbox.Options>

      </div>
    </Listbox>
  );
};

export default ReadSelect;