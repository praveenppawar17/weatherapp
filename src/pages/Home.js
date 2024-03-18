import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { data } from "../constants";
import useLocation from "../hooks/useLocation";
import Modal from "react-modal"; 
import axios from "axios";

const Home = () => {
  const [location, setLocation] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  // custom hook for gettng location data
  const { locationData, error, getLocation } = useLocation();

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
      setModalIsOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (location !== "") {
      const delayDebounceFn = setTimeout(() => {
        axios.get(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=RxrGdevALPxOhKn8RmJxy3FrbN0tDDrE&q=${location}&language=en-us`)
        .then(response => {
          console.log("respon... ", response.data)
          if (!response.data.length) {
            setIsEmpty(true);
            setErrorMessage(`City "${location}" not found`);
            setModalIsOpen(true); 
          } else {
            setIsEmpty(false);
          }
          setFilteredData(response.data);
        })
      }, 200);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setLocation(value);
    if (value === "") {
      setFilteredData([]);
      setIsEmpty(false);
      setErrorMessage(""); 
    }
  };

  useEffect(() => {
    if (locationData) {
      navigate(`/weather/${locationData.Key}/${locationData.ParentCity.LocalizedName}/${locationData.Country.LocalizedName}`);
    }
  }, [locationData, navigate]);

  const getDeviceLocationData = () => {
    getLocation(); 
    setLocation(""); 
  };

  return (
    <div className="App">
      <div className="form-container">
        <h3 className="header">Weather App</h3>
        <hr className="divider" />
        <form>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={handleInputChange}
            className="location-input"
          />
        </form>
        {!isEmpty && (
          <div className="custom-list-container">
            <div className="custom-listtry">
              <ul className="custom-list">
                {filteredData.map((item) => (
                  <li key={item.Key} className="custom-list-item">
                    <Link to={`/weather/${item.Key}/${item.LocalizedName}/${item.Country.LocalizedName}`}>{item.LocalizedName}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", paddingBottom: "10px"}}>
          <div className="horizontal-line"></div>{" "}
          <p style={{ color: "#ccc", margin: "0 10px" }}>or</p>
          <div className="horizontal-line"></div>{" "}
        </div>
        <button className="button" onClick={getDeviceLocationData}>
          Get Device Location
        </button>
        {/* modal component for displaying error mssage */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "10px",
              padding: "20px",
            },
          }}
          contentLabel="Error Modal"
        >
          <p style={{ color: "red" }}>{errorMessage}</p>
          <button className="button" onClick={() => setModalIsOpen(false)}>
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Home;













