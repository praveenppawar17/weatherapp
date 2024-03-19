import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import WeatherDisplay from "./pages/WeatherDisplay";

function App() {
  return (
    <Router>
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/weather/:Key/:LocalizedName/:country"
            element={<WeatherDisplay />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
