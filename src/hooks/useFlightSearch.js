import { useEffect, useCallback } from "react";
import { useFlightSearch } from "../contexts/FlightSearchContext";
import { searchFlights, getPriceHistory } from "../api/flightApi";

export const useFlightSearchOperations = () => {
  const {
    from,
    to,
    departDate,
    returnDate,
    tripType,
    adults,
    childrenCount,
    infants,
    cabinClass,
    setLoading,
    setFlights,
    setError,
    setPriceHistory,
    showPriceGraph,
    resetSearch,
  } = useFlightSearch();

  const performSearch = useCallback(async () => {
    if (!from || !to) {
      setError("Please enter origin and destination");
      return;
    }

    resetSearch();
    setLoading(true);

    try {
      const params = {
        originSkyId: from.skyId,
        destinationSkyId: to.skyId,
        originEntityId: from.entityId,
        destinationEntityId: to.entityId,
        date: departDate.format("YYYY-MM-DD"),
        adults: adults.toString(),
        children: childrenCount.toString(),
        infants: infants.toString(),
        currency: "USD",
        cabin: cabinClass,
      };

      if (tripType === "round") {
        params.returnDate = returnDate.format("YYYY-MM-DD");
      }

      const searchData = await searchFlights(params);
      const pricesData = await getPriceHistory(
        from,
        to,
        departDate.format("YYYY-MM-DD")
      );

      if (pricesData?.data) {
        setPriceHistory(pricesData.data?.flights?.days);
      }

      if (searchData?.data?.itineraries) {
        const flights = searchData.data.itineraries;
        setFlights(flights);

        if (flights.length === 0) {
          setError("No flights found for this route and dates.");
        }
      } else {
        setError("Invalid response format from the API");
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch flight data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [
    from,
    to,
    resetSearch,
    setLoading,
    setError,
    departDate,
    adults,
    childrenCount,
    infants,
    cabinClass,
    tripType,
    returnDate,
    setPriceHistory,
    setFlights,
  ]);

  const fetchPriceHistory = useCallback(async () => {
    if (!from || !to) return;

    try {
      const data = await getPriceHistory(from, to);
      if (data && data.data) {
        setPriceHistory(data.data);
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  }, [from, to, setPriceHistory]);

  useEffect(() => {
    if (showPriceGraph) {
      fetchPriceHistory();
    }
  }, [showPriceGraph, fetchPriceHistory]);

  return { performSearch };
};
