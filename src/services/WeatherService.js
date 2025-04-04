import { DateTime } from "luxon";
import { API_KEY, BASE_URL } from "../utils/constants";

const getWeatherdata = async (infoType, searchParams) => {
  const url = new URL(BASE_URL + infoType);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });
  // console.log(url);
  //   console.log(fetch(url));
  return fetch(url).then((result) => {
    if (!result.ok) {
      throw new Error("THE CITY TYPED IS INVALID");
    }
    return result.json();
  });
};

const iconURLFromCode = (icon) =>
  `http://openweathermap.org/img/wn/${icon}@2x.png`;

const formatToLocalHours = (secs, offset, format = "hh:mm a") => {
  return DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);
};

const formatToLocalTime = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy | 'Local Time:' hh:mm a"
) => DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);

const formatToDay = (secs, offset, format = "ccc") => {
  return DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(format);
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lon, lat },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
    timezone,
  } = data;

  const { main: details, icon } = weather[0];

  const formatedLocalTime = formatToLocalTime(dt, timezone);

  return {
    temp,
    feels_like,
    temp_max,
    temp_min,
    humidity,
    speed,
    name,
    country,
    details,
    sunrise: formatToLocalTime(sunrise, timezone, "hh:mm a"),
    sunset: formatToLocalTime(sunset, timezone, "hh:mm a"),
    icon: iconURLFromCode(icon),
    formatedLocalTime,
    dt,
    timezone,
  };
};

const formatCurrentForecast = (data) => {
  // console.log(data);
  const {
    list,
    city: { timezone },
  } = data;
  console.log(list);

  let DayForecastData = {};
  const ThreeHourForecastData = list.map((entry) => {
    const time = formatToLocalHours(entry.dt, timezone);
    const icon = iconURLFromCode(entry.weather[0].icon);
    const temp = entry.main.temp;
    const day = formatToDay(entry.dt, timezone);

    // If the day is not in the object, initialize it
    if (!DayForecastData[day]) {
      DayForecastData[day] = { temps: [], icons: [] };
    }
    DayForecastData[day].temps.push(temp);
    DayForecastData[day].icons.push(icon);

    return { time, icon, temp };
  });
  const newDayForecastData = Object.keys(DayForecastData).map((day) => {
    const temps = DayForecastData[day].temps;
    const avgTemp = (
      temps.reduce((sum, t) => sum + t, 0) / temps.length
    ).toFixed(2);
    console.log(avgTemp);
    let min = Infinity;
    const icon_closer = temps.reduce((closest_ind, t, index) => {
      if (Math.abs(avgTemp - t) < min) {
        min = Math.abs(avgTemp - t);
        return index;
      }
      return closest_ind;
    }, 0);
    return {
      day,
      temp: avgTemp,
      icon: DayForecastData[day].icons[icon_closer],
    };
  });
  return { ThreeHourForecastData, newDayForecastData };
};

const getFormatedWeatherdata = async (searchParams) => {
  return getWeatherdata("weather", searchParams).then(formatCurrentWeather);
};

const getFormatedForecastdata = async (searchParams) => {
  return getWeatherdata("forecast", searchParams).then(formatCurrentForecast);
};

export { getFormatedWeatherdata, getFormatedForecastdata };
