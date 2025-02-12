import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to access the dynamic URL parameter

const CountryInfo = () => {
  const { code } = useParams(); // Extract the country code from the URL
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();
        setCountry(data[0]); // Assuming the API returns an array
      } catch (error) {
        console.error("Error fetching country information:", error);
      }
    };

    fetchCountryInfo();
  }, [code]); // Re-fetch data if the code changes

  if (!country) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      
      
      <div className="space-y-4 text-lg text-gray-700">
        <p className="flex items-center">
          <span className="font-semibold">Population: </span>
          <span>{country.population.toLocaleString()}</span>
        </p>
        <p className="flex items-center">
          <span className="font-semibold">Flag: </span>
          <p>{country.flag}</p>
        </p>
        
        <p className="flex items-center">
          <span className="font-semibold">Currencies: </span>
          <span>{Object.values(country.currencies).map((currency) => currency.name).join(', ')}</span>
        </p>
        
        <p className="flex items-center">
          <span className="font-semibold">Languages: </span>
          <span>{Object.values(country.languages).join(', ')}</span>
        </p>
        
        <p className="flex items-center">
          <span className="font-semibold">Region: </span>
          <span>{country.region}</span>
        </p>
      </div>

     
    </div>
  );
};

export default CountryInfo;
