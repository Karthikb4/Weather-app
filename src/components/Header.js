import React from "react";

const Header = ({ setSearchTxt }) => {
  const cities = [
    {
      id: 1,
      name: "London",
    },
    {
      id: 2,
      name: "Hong Kong",
    },
    {
      id: 3,
      name: "New York",
    },
    {
      id: 4,
      name: "Mumbai",
    },
    {
      id: 5,
      name: "Sydney",
    },
  ];
  return (
    <div className="flex text-white border-red-50  items-center  justify-around">
      {cities.map((city) => {
        return (
          <button
            key={city.id}
            value={city.name}
            className="text-lg  font-medium hover:bg-gray-700/20 px-3 py-2 rounded-md transition ease-in"
            onClick={(event) => {
              document.querySelector("input").value = "";
              setSearchTxt(event.target.value);
            }}
          >
            {city.name}
          </button>
        );
      })}
    </div>
  );
};

export default Header;
