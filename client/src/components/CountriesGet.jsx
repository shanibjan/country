import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountriesGet = () => {
  const [regions, setRegions] = useState([]); // For storing regions
  const [timezones, setTimezones] = useState([]); // For storing timezones
  const [countries, setCountries] = useState([]); // For storing countries
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedRegion, setSelectedRegion] = useState(""); // Selected region filter
  const [selectedTimezone, setSelectedTimezone] = useState(""); // Selected timezone filter

  // Fetch regions and timezones when component mounts
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch regions
        const regionResponse = await axios.get("http://localhost:7000/api/regions");
        setRegions(regionResponse.data.regions);

        // Fetch timezones
        const timezoneResponse = await axios.get("http://localhost:7000/api/timezones");
        setTimezones(timezoneResponse.data.timezones);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch countries based on selected filters (region or timezone)
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:7000/api/countries";
        if (selectedRegion || selectedTimezone) {
          url += `?region=${selectedRegion}&timezone=${selectedTimezone}`;
        }

        const response = await axios.get(url);
        setCountries(response.data.countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [selectedRegion, selectedTimezone]); // Fetch when filters change

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl mb-4 text-red-500">Countries List</h1>

      {/* Filter Section */}
      <div className="mb-4">
        <div className="flex space-x-4 justify-center">
          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Region</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>
                {region}
              </option>
            ))}
          </select>

          {/* Timezone Filter */}
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="">Select Timezone</option>
            {timezones.map((timezone, index) => (
              <option key={index} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display Loading State */}
      {loading ? (
        <div className="text-center">Loading countries...</div>
      ) : (
        <div>
          {/* Country Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {countries.map((country, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-md text-center">
                <h3 className="font-bold text-xl">{country.name}</h3>
                <p className="text-gray-600">{country.region}</p>
                <p>{country.flag}</p>
                <p>{country.currentTime}</p>
              </div>
            ))}
          </div>

          {/* Show message if no countries are available */}
          {countries.length === 0 && (
            <div className="text-center text-red-500 mt-4">No countries found for the selected filters.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountriesGet;
