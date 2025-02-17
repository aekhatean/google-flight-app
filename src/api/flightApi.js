import axios from "axios";

// Create an axios instance with common configuration
const api = axios.create({
  baseURL: "https://sky-scrapper.p.rapidapi.com/api/v1/flights",
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
    "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
  },
});

// Search flights with the given parameters
export const searchFlights = async (params) => {
  try {
    const response = await api.get("/searchFlights", { params });
    return response.data;
  } catch (error) {
    console.error("Error searching flights:", error);
    throw error;
  }
};

// Get flight details for a specific flight
export const getFlightDetails = async (flightId) => {
  try {
    const response = await api.get(`/getFlightDetails/${flightId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting flight details:", error);
    throw error;
  }
};

// Get suggested airports based on input
export const getAirportSuggestions = async (query) => {
  try {
    const response = await api.get("/searchAirport", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting airport suggestions:", error);
    throw error;
  }
};

// Get price history for a route
export const getPriceHistory = async (from, to, fromDate) => {
  try {
    const response = await api.get("/getPriceCalendar", {
      params: {
        originSkyId: from.skyId,
        destinationSkyId: to.skyId,
        originEntityId: from.entityId,
        destinationEntityId: to.entityId,
        fromDate,
        currency: "USD",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting price history:", error);
    throw error;
  }
};

// TODO: get flight details from API
