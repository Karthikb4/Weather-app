import React, { useContext, useEffect, useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import TemperatureContext from "../utils/TemperatureContext";
import SuggestionList from "./SuggestionList";
import { API_KEY, SUGGESTIONS_BASE_URL } from "../utils/constants";

const Searchbar = ({ data: { SearchTxt, setSearchTxt, setLocation } }) => {
  const { TempUnit, setTempUnit } = useContext(TemperatureContext);
  // const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const UpdateSuggestionList = async (val) => {
    // setSearchTxt(val); // ✅ Always update input field state first
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      let url = new URL(SUGGESTIONS_BASE_URL);
      url.search = new URLSearchParams({ q: val, limit: 1 , appid: API_KEY });
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setSuggestions(data);
      setSelectedIndex(-1); // ALWAYS SET TO -1 WHEN CHANGE OF CONTENT INTHE SEARCH TEXT
    } catch (error) {
      console.log("Error Fetching the suggestions list->", error);
    }
  };

  const ToggleSuggestions = (key) => {
    if (key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (key === "Enter" && selectedIndex !== -1) {
      selectSuggestion(selectedIndex);
    }
  };

  const selectSuggestion = (selectedIndex) => {
    if (suggestions.length > 0) {
      console.log("ENTER PRESSED");
      const selectedPlace = suggestions[selectedIndex];
      // document.querySelector("input").blur();
      console.log(selectedPlace);

      const {lat,lon,name,country}=selectedPlace;
      if(lat && lon)
      {
        setLocation({lat,lon})
        setSearchTxt("");
      }
      console.log(`${selectedPlace.name},${selectedPlace.country}`);
      document.querySelector("input").blur();
      
      setSuggestions([]); // Clear the suggestions after selection
      setSelectedIndex(-1); // Reset the index
    }
  };
  const ChangeUnit = (unit) => {
    console.log(unit, TempUnit);
    setTempUnit(unit);
  };

  useEffect(() => {
    if (selectedIndex !== -1) {
      const selectedPlace = suggestions[selectedIndex];
      document.querySelector(
        "input"
      ).value = `${selectedPlace.name},${selectedPlace.country}`;
    }
  }, [selectedIndex]);

  return (
    <div className="flex flex-row justify-center  my-6 ">
      <div className="flex flex-row  items-center space-x-10  relative">
        <div className="flex bg-white w-[400px] items-center shrink-0">
          <BiSearch
            size={35}
            className="text-gray-300  shrink-0 "
            // onClick={}
          />
          <input
            type="text"
            placeholder="Search by City...."
            className="bg-white  shrink-0 grow capitalize font-light text-gray-500  text-lg p-2  focus:outline-0 placeholder:lowercase"
            onChange={(event) => UpdateSuggestionList(event.target.value)}
            onKeyDown={(event) => {
              if (suggestions.length) ToggleSuggestions(event.key);
            }}
          />
        </div>
        {/* {console.log( <SuggestionList data={suggestions} IND={selectedIndex} />)} */}
        {suggestions.length ? (
          <SuggestionList
            className="h-[100px]"
            data={suggestions}
            ind={selectedIndex}
            selectSuggestion={selectSuggestion}
          />
        ) : null}
        <BiCurrentLocation
          size={35}
          className=" text-white cursor-pointer shrink-0 transition ease-out hover:scale-125"
          onClick={() => {
            console.log("FETCHING CURRENT LOCATION AND DATA");
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                  });
                  setSearchTxt(""); // Clear any existing search
                  document.querySelector("input").value="";
                },
                (error) =>
                  console.log("ERROR COULD NOT FETCH THE LOCATION ", error)
              );
            } else {
              console.log("GeoLocation not availiable in the browser");
            }
          }}
        />

        <div className="flex flex-row w-1/4">
          <button
            value="C"
            className="text-white text-2xl cursor-pointer  font-medium transition ease-out hover:scale-125"
            onClick={(event) => ChangeUnit(event.target.value)}
          >
            °C
          </button>
          <p className=" text-white text-2xl  font-medium mx-1">|</p>
          <button
            value="F"
            className=" text-white cursor-pointer text-2xl font-medium transition ease-out hover:scale-125"
            onClick={(event) => ChangeUnit(event.target.value)}
          >
            °F
          </button>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
