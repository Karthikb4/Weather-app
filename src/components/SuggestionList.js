import { useState } from "react";

import React from "react";

const SuggestionList = ({ data: suggestions, ind: selectedIndex ,selectSuggestion}) => {
  console.log(suggestions, selectedIndex);
  return (
    <ul className="absolute left-0 w-[400px] top-[40px]  bg-white shadow-lg mt-1 max-h-60 overflow-y-auto">
      {suggestions.map((place, index) => {
        return (
        
          <li
            key={index}
            className={`px-3 py-2 cursor-pointer text-black ${
              index === selectedIndex ? "bg-gray-300" : "bg-white"
            }`}
            onClick={()=>selectSuggestion(index)}
          >
            {place.name},{place.country}
          </li>
          
        );
      })}
    </ul>
  );
};

export default SuggestionList;
