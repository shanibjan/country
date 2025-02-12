import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import CountryInfo from "./components/CountryInfo.jsx";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/country_information/:code" element={<CountryInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
