import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import { debounce } from "lodash"; // Import debounce from lodash

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [regions, setRegions] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State to store search input

  const loadMoreRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

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
      }
    };

    fetchFilters();
  }, []);

  // Debounced fetchCountries function
  const debouncedFetchCountries = useCallback(
    debounce(async () => {
      if (filterLoading || !searchQuery.trim()) return; // Don't fetch if no search query or loading is in progress

      setFilterLoading(true);

      try {
        let url = `/api/country-or-capital/${searchQuery}?page=${page}&limit=20`;

        const response = await axios.get(url);

        const newCountries = response.data.countries || [];
        setCountries(newCountries);
        setPage(1);
        setHasMore(newCountries.length > 0);
      } catch (error) {
        setError("Failed to fetch country data");
      } finally {
        setFilterLoading(false);
      }
    }, 500), // 500ms debounce delay
    [searchQuery, page] // Only re-run if searchQuery or page changes
  );

  // Fetch countries with filters
  const fetchCountries = useCallback(async () => {
    if (loading || filterLoading || !hasMore) return;
    setLoading(true);

    try {
      let url = "http://localhost:7000/api/countries";
      
      // Construct URL based on filters and search query
      if (selectedRegion) {
        url = `http://localhost:7000/api/countries/region/${selectedRegion}`;
      } else if (selectedTimezone) {
        url = `http://localhost:7000/api/search-timezone?timezone=${selectedTimezone}`;
      } else if (searchQuery) {
        url = `http://localhost:7000/api/country-or-capital/${searchQuery}`;
      }

      const response = await axios.get(url, {
        params: { page:100, limit: 500 },
      });

      const newCountries = response.data.countries || [response.data]; // Handle case when searching for a single country

      if (newCountries.length === 0) {
        setHasMore(false);
      }

      setCountries((prevCountries) => {
        // Keep the previously fetched countries if no filters/search applied
        if (selectedRegion || selectedTimezone || searchQuery) {
          return newCountries;
        } else {
          return [...prevCountries, ...newCountries];
        }
      });

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError("Failed to fetch country data");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  }, [loading, filterLoading, hasMore, page, selectedRegion, selectedTimezone, searchQuery]);

  // Intersection observer for infinite scroll
  const handleIntersection = useCallback(([entry]) => {
    if (entry.isIntersecting && hasMore && !filterLoading) {
      fetchCountries();
    }
  }, [fetchCountries, hasMore, filterLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px",
    });

    const currentRef = loadMoreRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Handling region change
  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setSelectedTimezone("");
    setSearchQuery(""); // Clear search query when changing region
    setPage(1);
    setCountries([]);
    setFilterLoading(true);
  };

  // Handling timezone change
  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
    setSelectedRegion("");
    setSearchQuery(""); // Clear search query when changing timezone
    setPage(1);
    setCountries([]);
    setFilterLoading(true);
  };

  // Handling search query change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
     // Call debounced function
  };

  const handleCountryClick = (code) => {
    navigate(`/country_information/${code}`); // Navigate to the dynamic route with country code
  };

  if (loading && page === 1 && !filterLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-center text-3xl mb-4 text-red-500">Countries List</h1>

      {/* Search Bar */}
      <div className="flex justify-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by country or capital"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded"
        />
      </div>

      {/* Region and Timezone Filters */}
      <div className="flex justify-center space-x-4 mb-4">
        <select
          value={selectedRegion}
          onChange={handleRegionChange}
          className="px-4 py-2 border rounded"
        >
          <option value="">Select Region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>

        <select
          value={selectedTimezone}
          onChange={handleTimezoneChange}
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

      {/* Countries Display */}
      <div className="grid grid-cols-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {countries.map((country, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-md text-center cursor-pointer"
            onClick={() => handleCountryClick(country.code)} // Country code passed on click
          >
            <h3 className="font-bold text-xl">{country.name}</h3>
            <p className="text-gray-600">{country.region}</p>
            <p>{country.flag}</p>
            <p>{country.currentTime}</p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && !filterLoading && (
        <div className="text-center mt-4">
          <button
            onClick={fetchCountries}
            className="px-6 py-2 bg-blue-500 text-white rounded-full"
          >
            Load More
          </button>
        </div>
      )}

      {/* Load More Intersection Observer */}
      <div ref={loadMoreRef} className="mt-4" />
    </div>
  );
};

export default CountriesList;
