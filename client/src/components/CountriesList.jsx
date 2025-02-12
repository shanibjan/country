import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CountriesList = () => {
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [filteredCountries, setFilteredCountries] = useState([]);

  const navigate = useNavigate();

  // Fetch available regions and timezones when component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const regionResponse = await axios.get("http://localhost:7000/api/regions");
        setRegions(regionResponse.data.regions);
        const timezoneResponse = await axios.get("http://localhost:7000/api/timezones");
        setTimezones(timezoneResponse.data.timezones);
      } catch (error) {
        console.error("Error fetching filters:", error);
        setError("Error fetching filters")
      }
    };
    fetchFilters();
  }, []);

  // Fetch all countries initially
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:7000/api/countries");
       
        setFilteredCountries(res.data.countries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Error fetching countries")
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch countries based on selected region
  useEffect(() => {
    
   
    if (!selectedRegion) return;

    const fetchCountriesByRegion = async () => {
      try {
        setLoading(true)
        setFilteredCountries([])
        const res = await axios.get(`http://localhost:7000/api/countries/region/${selectedRegion}`);
        setFilteredCountries(res.data.countries);
        setLoading(false)
      } catch (error) {
        console.error(error);
        setError("Error fetching countries")
        setLoading(false)
      }
    };

    fetchCountriesByRegion();
  }, [selectedRegion]);

  // Fetch countries based on selected timezone
  useEffect(() => {
    if (!selectedTimezone) return;

    const fetchCountriesByTimeZone = async () => {
      try {
        setLoading(true);
        setFilteredCountries([])
        const res = await axios.get(`http://localhost:7000/api/countries/timezone/${selectedTimezone}`);
        setFilteredCountries(res.data.countries);
        setLoading(false)
      } catch (error) {
        console.error(error);
        setError("Error fetching countries")
        setLoading(false)
      }
    };

    fetchCountriesByTimeZone();
  }, [selectedTimezone]);
  let searchedCountry=[]
  // Fetch countries by search query
  const handleSearch = async () => {
    
    if (!searchQuery.trim()) return;

    try {
      setLoading(true)
    setFilteredCountries([])
     
      const res = await axios.get(`http://localhost:7000/api/country-or-capital/${searchQuery}`);
      searchedCountry.push(res.data);
      setFilteredCountries(searchedCountry);
      setSearchQuery("")
      setLoading(false)
     
    } catch (error) {
      console.error(error);
      setError("Error fetching countries")
      setLoading(false)
    }
  };

  // Handling region change
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedTimezone("");
    setSearchQuery("");
  };

  // Handling timezone change
  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
    setSelectedRegion("");
    setSearchQuery("");
  };

  return (
    <div>
      <h1 className="text-center text-3xl mb-4 text-red-500">Countries List</h1>

      {/* Search Bar */}
      <div className="flex justify-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by country or capital"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded"
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">Search</button>
      </div>

      {/* Region and Timezone Filters */}
      <div className="flex justify-center space-x-4 mb-4">
        <select value={selectedRegion} onChange={handleRegionChange} className="px-4 py-2 border rounded">
          <option value="">Select Region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>

        <select value={selectedTimezone} onChange={handleTimezoneChange} className="px-4 py-2 border rounded">
          <option value="">Select Timezone</option>
          {timezones.map((timezone, index) => (
            <option key={index} value={timezone}>{timezone}</option>
          ))}
        </select>
      </div>

      {/* Loading and Error Handling */}
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Countries Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredCountries.map((country, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md text-center cursor-pointer"
            onClick={() => navigate(`/country_information/${country.code}`)}
          >
            <h3 className="font-bold text-xl">{country.name}</h3>
            <p className="text-gray-600">{country.region}</p>
            <p>{country.flag}</p>
            <p>{country.currentTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesList;
