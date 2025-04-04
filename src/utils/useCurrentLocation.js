import { useState, useEffect } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState({ lon: null, lat: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lon: position.coords.longitude,
            lat: position.coords.latitude,
          });
        },
        (error) => console.error("Failed to fetch Location", error)
      );
    } else {
      console.error("GeoLocation is not supported by the browser");
    }
  }, []);

  return {location,setLocation};
};

export default useCurrentLocation;
