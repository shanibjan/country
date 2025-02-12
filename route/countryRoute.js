import express from "express";
import moment from 'moment';

const router = express.Router();

// Route to get all regions from countries
router.get("/regions", async (req, res) => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    // Extract all regions from countries and remove duplicates
    const regions = countries
      .map(country => country.region)
      .filter((region, index, self) => self.indexOf(region) === index);

    res.json({ regions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to get all timezones from countries
router.get("/timezones", async (req, res) => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    // Extract all timezones from countries and remove duplicates
    const timezones = countries
      .map(country => country.timezones)
      .flat()
      .filter((timezone, index, self) => self.indexOf(timezone) === index);

    res.json({ timezones });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to get all countries with additional details including current time
router.get("/countries", async (req, res) => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const currentTime = moment().format("hh:mm A");

    const countryData = countries.map((country) => ({
      name: country.name.common,
      flag: country.flag,
      region: country.region,
      code: country.cca2,
      currentTime: currentTime,
    }));

    res.json({ countries: countryData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to fetch country or capital data based on name or capital
router.get("/country-or-capital/:name", async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({ error: "Country name or capital is required" });
  }

  try {
    const capitalResponse = await fetch(`https://restcountries.com/v3.1/capital/${name}`);
    const capitals = await capitalResponse.json();

    if (capitals && capitals.length > 0) {
      const capitalData = capitals[0];

      const capitalInfo = {
        name: capitalData.name.common,
        code: capitalData.cca2,
        population: capitalData.population,
        currencies: capitalData.currencies ? Object.values(capitalData.currencies).map(currency => currency.name) : 'No currency available',
        languages: capitalData.languages ? Object.values(capitalData.languages) : 'No languages available',
        flag: capitalData.flags ? capitalData.flag : 'No flag available',
        region: capitalData.region,
      };

      return res.json(capitalInfo);
    } else {
      const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
      const countries = await countryResponse.json();

      if (countries && countries.length > 0) {
        const countryData = countries[0];
        const countryInfo = {
          name: countryData.name.common,
          population: countryData.population,
          currencies: countryData.currencies ? Object.values(countryData.currencies).map(currency => currency.name) : 'No currency available',
          languages: countryData.languages ? Object.values(countryData.languages) : 'No languages available',
          flag: countryData.flags ? countryData.flag : 'No flag available',
          region: countryData.region,
        };

        return res.json(countryInfo);
      } else {
        return res.status(404).json({ error: "Country or capital not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country or capital data" });
  }
});

// Route to fetch country by country code
router.get("/countries/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const response = await fetch("https://restcountries.com/v3.1/all");
      const countries = await response.json();
  
      const country = countries.find((country) => country.cca2 === code);
  
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
  
      const countryData = {
        population: country.population,
        currencies: country.currencies ? Object.values(country.currencies).map(currency => currency.name) : 'No currency available',
        languages: country.languages ? Object.values(country.languages) : 'No languages available',
        flag: country.flags ? country.flag : 'No flag available',
        region: country.region,
      };
  
      res.json({ countryWithCode: countryData });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch country data" });
    }
  });
  

// Route to fetch countries by region
router.get("/countries/region/:region", async (req, res) => {
  try {
    const region = req.params.region;
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const filteredCountries = countries.filter((country) => country.region === region);

    const countriesWithDetails = filteredCountries.map(country => ({
      name: country.name.common,
      flag: country.flag,
      region: country.region,
      code: country.cca2,
      currentTime: "Time not available",
    }));

    res.json({ countries: countriesWithDetails });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to search countries by name and region
router.get("/countries-search", async (req, res) => {
  try {
    const name = req.query.name;
    const region = req.query.region;

    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const filteredCountries = countries.filter((country) => {
      const countryName = country.name.common.toLowerCase();
      const countryRegion = country.region.toLowerCase();

      return (
        (!name || countryName.includes(name.toLowerCase())) &&
        (!region || countryRegion === region.toLowerCase())
      );
    });

    res.json({ filteredCountries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to search countries by capital name
router.get("/search-capital", async (req, res) => {
  try {
    const capital = req.query.capital;

    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    let filteredCountries = countries;
    if (capital) {
      filteredCountries = countries.filter(
        (country) =>
          country.capital &&
          country.capital.some((c) => c.toLowerCase() === capital.toLowerCase())
      );
    }

    res.json({ countries: filteredCountries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to search countries by region
router.get("/search-region", async (req, res) => {
  try {
    const region = req.query.region;

    if (!region) {
      return res.status(400).json({ error: "Region query parameter is required" });
    }

    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const filteredCountries = countries.filter(
      (country) => country.region && country.region.toLowerCase() === region.toLowerCase()
    );

    if (filteredCountries.length === 0) {
      return res.status(404).json({ error: "No countries found for the specified region" });
    }

    res.json({ countries: filteredCountries });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

// Route to search countries by timezone
router.get("/search-timezone", async (req, res) => {
  try {
    const timezone = req.query.timezone;

    if (!timezone) {
      return res.status(400).json({ error: "Timezone query parameter is required" });
    }

    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();

    const filteredCountries = countries.filter((country) => {
      return country.timezones && country.timezones.some((tz) => tz.toLowerCase() === timezone.toLowerCase());
    });

    if (filteredCountries.length === 0) {
      return res.status(404).json({ error: "No countries found for the specified timezone" });
    }

    const countriesWithDetails = filteredCountries.map(country => ({
      name: country.name.common,
      flag: country.flag,
      region: country.region,
      code: country.cca2,
      currentTime: "Time not available",
    }));

    res.json({ countries: countriesWithDetails });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch country data" });
  }
});

export default router;
