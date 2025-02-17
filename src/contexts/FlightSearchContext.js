import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import dayjs from "dayjs";

const FlightSearchContext = createContext();

export const useFlightSearch = () => useContext(FlightSearchContext);

export const FlightSearchProvider = ({ children }) => {
  // Initialize date objects once
  const initialDepartDate = useMemo(() => dayjs(), []);
  const initialReturnDate = useMemo(() => dayjs().add(7, "day"), []);

  // Search parameters
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState(initialDepartDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [tripType, setTripType] = useState("round");
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  // For integeration with FlightDeatails API
  const [cabinClass, setCabinClass] = useState("economy");

  // Results state
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("best");
  const [filters, setFilters] = useState({
    maxPrice: null,
    airlines: [],
    maxDuration: null,
    stops: "any", // 'any', 'nonstop', '1stop', '2stops'
    departureTime: "any", 
    arrivalTime: "any",
  });

  // Price graph data
  const [showPriceGraph, setShowPriceGraph] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);

  // Helper functions
  const handleSwapLocations = useCallback(() => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  }, [from, to, setFrom, setTo]);

  const resetSearch = useCallback(() => {
    setFlights([]);
    setError("");
  }, [setFlights, setError]);

  const resetFilters = useCallback(() => {
    setFilters({
      maxPrice: null,
      airlines: [],
      maxDuration: null,
      stops: "any",
      departureTime: "any",
      arrivalTime: "any",
    });
    setSortBy("best");
  }, [setFilters, setSortBy]);

  // Apply filters to flight results
  const getFilteredFlights = useCallback(() => {
    if (!flights.length) return [];

    let result = [...flights];

    if (filters.maxPrice) {
      result = result.filter((flight) => flight.price.raw <= filters.maxPrice);
    }

    if (filters.airlines.length) {
      result = result.filter((flight) =>
        flight.legs?.some((leg) =>
          filters.airlines.includes(leg.carriers?.marketing[0]?.name)
        )
      );
    }

    if (filters.stops !== "any") {
      result = result.filter((flight) => {
        const numStops = flight.segments ? flight.segments.length - 1 : 0;
        switch (filters.stops) {
          case "nonstop":
            return numStops === 0;
          case "1stop":
            return numStops === 1;
          case "2stops":
            return numStops === 2;
          default:
            return true;
        }
      });
    }

    // Sort results
    if (sortBy === "price") {
      result.sort((a, b) => (a.price.raw || 0) - (b.price.raw || 0));
    } else if (sortBy === "duration") {
      result.sort((a, b) => {
        const aDuration = a.durationMinutes || 0;
        const bDuration = b.durationMinutes || 0;
        return aDuration - bDuration;
      });
    }
    // 'best' is the default sorting from the API

    return result;
  }, [flights, filters, sortBy]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      // Search parameters
      from,
      setFrom,
      to,
      setTo,
      departDate,
      setDepartDate,
      returnDate,
      setReturnDate,
      tripType,
      setTripType,
      adults,
      setAdults,
      childrenCount,
      setChildrenCount,
      infants,
      setInfants,
      cabinClass,
      setCabinClass,

      // Results state
      loading,
      setLoading,
      flights,
      setFlights,
      error,
      setError,
      sortBy,
      setSortBy,
      filters,
      setFilters,

      // Price graph
      showPriceGraph,
      setShowPriceGraph,
      priceHistory,
      setPriceHistory,

      // Helper functions
      handleSwapLocations,
      resetSearch,
      resetFilters,
      getFilteredFlights,
    }),
    [
      from,
      setFrom,
      to,
      setTo,
      departDate,
      setDepartDate,
      returnDate,
      setReturnDate,
      tripType,
      setTripType,
      adults,
      setAdults,
      childrenCount,
      setChildrenCount,
      infants,
      setInfants,
      cabinClass,
      setCabinClass,
      loading,
      setLoading,
      flights,
      setFlights,
      error,
      setError,
      sortBy,
      setSortBy,
      filters,
      setFilters,
      showPriceGraph,
      setShowPriceGraph,
      priceHistory,
      setPriceHistory,
      handleSwapLocations,
      resetSearch,
      resetFilters,
      getFilteredFlights,
    ]
  );

  return (
    <FlightSearchContext.Provider value={value}>
      {children}
    </FlightSearchContext.Provider>
  );
};
