import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const CountryInfo = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const data = await response.json();
        setCountry(data[0]);
      } catch (error) {
        console.error("Error fetching country information:", error);
      }
    };

    fetchCountryInfo();
  }, [code]);

  if (!country) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-6">
      <h2 className="text-center text-2xl font-bold mb-4">{country.name.common}</h2>
      
      <div className="flex justify-center mb-4">
        <img src={country.flags.svg} alt={`${country.name.common} flag`} className="w-32 h-20 rounded-md shadow-md" />
      </div>

      <div className="space-y-4 text-lg text-gray-700">
        <p className="flex items-center">
          <span className="font-semibold">Population: </span>&nbsp;
          <span>{country.population.toLocaleString()}</span>
        </p>
        
        <p className="flex items-center">
          <span className="font-semibold">Region: </span>&nbsp;
          <span>{country.region}</span>
        </p>

        {country.subregion && (
          <p className="flex items-center">
            <span className="font-semibold">Subregion: </span>&nbsp;
            <span>{country.subregion}</span>
          </p>
        )}

        <p className="flex items-center">
          <span className="font-semibold">Capital: </span>&nbsp;
          <span>{country.capital ? country.capital[0] : "N/A"}</span>
        </p>

        {country.currencies && (
          <p className="flex items-center">
            <span className="font-semibold">Currencies: </span>&nbsp;
            <span>{Object.values(country.currencies).map((currency) => currency.name).join(", ")}</span>
          </p>
        )}

        {country.languages && (
          <p className="flex items-center">
            <span className="font-semibold">Languages: </span>&nbsp;
            <span>{Object.values(country.languages).join(", ")}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CountryInfo;
