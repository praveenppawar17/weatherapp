import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./weatherDisplay.css";
import { weatherIcons } from "../constants";
import axios from "axios";
const WeatherDisplay = () => {
  const { Key, LocalizedName, country } = useParams();
  const [result, setResult] = useState({});
  const [svgUrl, setSvgUrl] = useState();
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(
        `http://dataservice.accuweather.com/currentconditions/v1/${Key}?apikey=${API_KEY}&language=en-us&details=true`
      )
      .then((res) => {
        let resResponse = {};
        resResponse.WeatherText = res.data[0].WeatherText;
        resResponse.Temperature = res.data[0].Temperature.Metric.Value;
        resResponse.RelativeHumidity = res.data[0].RelativeHumidity;
        resResponse.WindSpeed =
          res.data[0].Wind.Speed.Metric.Value +
          " " +
          res.data[0].Wind.Speed.Metric.Unit;
        let img = weatherIcons.filter((icon) => {
          console.log("WeatherText... ", resResponse.WeatherText);
          return icon.phrase === resResponse.WeatherText || "Sunshine";
        })[0];
        setSvgUrl(img.url);
        setResult(resResponse);
      })
      .catch((error) => {
        if (error.response && error.response.status === 503) {
          setErrorMessage("API request limit is exceeded...");
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      });
  }, []);
  return (
    <div className="container">
      <div className="card">
        <div className="weather-result">
          <Link to="/" className="backarrow">
            <ArrowBackIcon />
          </Link>
          <p>Weather App</p>
        </div>
        <hr className="divider" />
        <div className="cardbody">
          {errorMessage && <p style={{color:'red'}}>{errorMessage}</p>}
          {result.WeatherText && (
            <img
              className="weather-icon"
              src={
                svgUrl
                  ? svgUrl
                  : "https://www.awxcdn.com/adc-assets/images/weathericons/2.svg"
              }
              alt="WeatherText"
              width="50"
              height="50"
            />
          )}
          <div className="temperature">{result.Temperature}°C</div>
          <p>{result.WeatherText}</p>
          <p>
            {<RoomOutlinedIcon style={{ fontSize: "14px" }} />} {LocalizedName}{" "}
            {country}
          </p>
        </div>
        <div className="footer">
          <div className="humidity-container">
            <p className="humidity">Humidity: {result.RelativeHumidity}</p>
          </div>
          <div className="windspeed-container">
            <p className="wind-speed">Wind Speed: {result.WindSpeed}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
