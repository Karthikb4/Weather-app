import React, { use, useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
// import { Camera } from 'lucide-react';
import Header from "./components/Header";
import Searchbar from "./components/Searchbar";
import TimeAndLocation from "./components/TimeAndLocation";
import TempratureDetails from "./components/TempratureDetails";
import Forecast from "./components/Forecast";
import {
  getFormatedForecastdata,
  getFormatedWeatherdata,
} from "./services/WeatherService";
import Shimmer from "./components/Shimmer";
import TemperatureContext from "./utils/TemperatureContext";
import useCurrentLocation from "./utils/useCurrentLocation";

const App = () => {
  const [WeatherData, setWeatherData] = useState(null);
  const [ForecastData, setForecastData] = useState(null);
  const [TempUnit, setTempUnit] = useState("null");
  const [SearchTxt, setSearchTxt] = useState("");
  const { unit } = useContext(TemperatureContext);
  const {location,setLocation} = useCurrentLocation(); // ✅ Use the hook here ;Hooks must be called at the top level of a function component and not inside an async function.

  const fetchWeatherData = async () => {
    try {
       // Ensure we only fetch data when we have either SearchTxt or valid location
    if (!SearchTxt && (!location || location.lat === null || location.lon === null)) {
      console.log("No search text or valid location, skipping fetch.");
      return;
    }

    const params = SearchTxt ? { q: SearchTxt } : { lat: location.lat, lon: location.lon }; // the params take "lon" not "lng"

      // Fetch both weather and forecast data at the same time
    const [weatherdata, forecastdata] = await Promise.all([
      getFormatedWeatherdata(params),
      getFormatedForecastdata(params), // Make sure API supports lat/lon for forecasts
    ]);//✅ Both API calls happen at the same time (faster execution)
      setWeatherData(weatherdata);
      setForecastData(forecastdata);
      console.log(weatherdata, forecastdata);
    } catch (error) {
      console.log(error);
      console.log("Error fetching the city", error.message);
      alert("Invalid City entered");
      setWeatherData(null);
      setForecastData(null);
    }
  };

  useEffect(() => {
    if (SearchTxt || (location && location.lat !== null && location.lon !== null)) {
      fetchWeatherData();
      setTempUnit(unit);
    }
  }, [SearchTxt, location]);
    

  if (WeatherData === null) return <Shimmer />;
  const { formatedLocalTime, name, country } = WeatherData;

  return (
    <TemperatureContext.Provider value={{ TempUnit, setTempUnit }}>
      <div className="mx-auto border-red-500  max-w-screen-lg my-4  py-4 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 from-cyan-600 to-blue-700">
        <Header setSearchTxt={setSearchTxt} />
        <Searchbar data={{ SearchTxt, setSearchTxt,setLocation }} />
        <TimeAndLocation
          time={formatedLocalTime}
          name={name}
          country={country}
        />
        <TempratureDetails data={WeatherData} />
        <Forecast
          name="3 HOURS STEP FORECAST"
          data={ForecastData.ThreeHourForecastData}
        />
        <Forecast
          name="DAILY FORECAST"
          data={ForecastData.newDayForecastData}
        />
      </div>
    </TemperatureContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
