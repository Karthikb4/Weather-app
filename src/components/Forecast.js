import React, { useContext } from "react";
import TemperatureContext from "../utils/TemperatureContext";

const Forecast = ({ name, data }) => {
  const { TempUnit } = useContext(TemperatureContext);
  return (
    <div className=" mt-6">
      <div className="flex text-[20px] items-center justify-start  mb-2">
        <p className="font-md uppercase">{name}</p>
      </div>
      <hr className="mt-1 mb-2" />
      <div className="flex mt-3 items-center justify-between space-x-9 overflow-x-auto scrollbar-hidden ">
        {data.map(({ time, day, icon, temp }, ind) => {
          if (TempUnit === "C") {
            temp = (temp - 273.15).toFixed(2);
          } else {
            temp = ((temp - 273.15) * (9 / 5) + 32).toFixed(2);
          }
          return (
            <div
              className="flex  flex-col items-center  justify-center shrink-0"
              key={ind}
            >
              <p className="font-light  text-md">{time || day}</p>
              <img src={icon} alt="weather icon" className="w-15 my-1 " />
              <p className="text-[17px] font-medium ">
                {temp}°{TempUnit}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
