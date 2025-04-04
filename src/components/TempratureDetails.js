import React, { useContext } from "react";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FaThermometerEmpty } from "react-icons/fa";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import TemperatureContext from "../utils/TemperatureContext";

const TempratureDetails = ({ data }) => {
  const { TempUnit } = useContext(TemperatureContext);

  const convertTemp = (temp) => {
    if (TempUnit === "C") {
      temp = (temp - 273.15).toFixed(2);
    } else {
      temp = ((temp - 273.15) * (9 / 5) + 32).toFixed(2);
    }
    return temp;
  };

  let {
    details,
    icon,
    temp,
    feels_like,
    humidity,
    speed,
    sunrise,
    sunset,
    temp_max,
    temp_min,
  } = data;

  temp = convertTemp(temp);
  feels_like = convertTemp(feels_like);
  temp_max = convertTemp(temp_max);
  temp_min = convertTemp(temp_min);

  const verticalDetails = [
    {
      id: 1,
      Icon: FaThermometerEmpty,
      title: "Real feel:",
      value: `${feels_like} °${TempUnit}`,
    },
    {
      id: 2,
      Icon: BiSolidDropletHalf,
      title: "Humidity:",
      value: `${humidity} %`,
    },
    {
      id: 3,
      Icon: FiWind,
      title: "Wind:",
      value: `${speed} km/hr`,
    },
  ];

  const horizontalDetails = [
    {
      id: 1,
      Icon: GiSunrise,
      title: "SunRise",
      value: sunrise,
    },
    {
      id: 2,
      Icon: GiSunset,
      title: "Sunset",
      value: sunset,
    },
    {
      id: 3,
      Icon: MdKeyboardArrowUp,
      title: "High",
      value: `${temp_max} °${TempUnit}`,
    },
    {
      id: 4,
      Icon: MdKeyboardArrowDown,
      title: "Low",
      value: `${temp_min} °${TempUnit}`,
    },
  ];

  return (
    <div className=" p-2">
      <div className="flex   justify-center items-center font-medium  py-2 text-xl text-cyan-300">
        <p>{details}</p>
      </div>
      <div className=" flex flex-row justify-between   my-3">
        <div>
          <img src={icon} alt="weather icon" className="w-25 " />
        </div>
        <div className="text-[35px] flex flex-col justify-center">
          <p>
            {temp}°{TempUnit}
          </p>
        </div>
        <div className="flex flex-col   items-center justify-center">
          <ul className="list-none">
            {verticalDetails.map((detail) => {
              return (
                <li key={detail.id} className="flex items-center space-x-2 my-1">
                  <detail.Icon size={25} className=" " />{" "}
                  <p>
                    {detail.title}{" "}
                    <span className="font-medium ml-1">{detail.value}</span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex flex-row justify-around items-center mt-4  ">
        {horizontalDetails.map((detail) => {
          return (
            <div
              key={detail.id}
              className="flex text-[14px] space-x-2 justify-center items-center"
            >
              {" "}
              <span>
                <detail.Icon size={30} />
              </span>{" "}
              <span>{detail.title}</span> <span>{detail.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TempratureDetails;
