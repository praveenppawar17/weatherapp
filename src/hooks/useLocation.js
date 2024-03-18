import { useState } from "react";

const useLocation = () => {
  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchLocationData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setError(error);
        }
      );
    } else {
      setError(new Error("Geolocation is not supported by this browser."));
    }
  };

  const fetchLocationData = (latitude, longitude) => {
    fetch(`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${process.env.REACT_APP_API_KEY}&q=${latitude},${longitude}&language=en-us`)
      .then(response => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error("Request had bad syntax or the parameters supplied were invalid.");
          } else if (response.status === 401) {
            throw new Error("Unauthorized. API authorization failed.");
          } else if (response.status === 403) {
            throw new Error("Unauthorized. You do not have permission to access this endpoint.");
          } else if (response.status === 404) {
            throw new Error("Server has not found a route matching the given URI.");
          } else if (response.status === 500) {
            throw new Error("Server encountered an unexpected condition which prevented it from fulfilling the request.");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        return response.json();
      })
      .then(data => {
        setLocationData(data);
      })
      .catch((error) => {
        setError(error);
      });
  };

  return { locationData, error, getLocation };
};

export default useLocation;


