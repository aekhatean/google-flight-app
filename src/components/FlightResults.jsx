import React from "react";
import { Box, Typography, CircularProgress, Alert, Chip } from "@mui/material";
import FlightCard from "./FlightCard";
import { useFlightSearch } from "../contexts/FlightSearchContext";

const FlightResults = () => {
  const {
    loading,
    error,
    flights,
    from,
    to,
    departDate,
    returnDate,
    tripType,
    getFilteredFlights,
  } = useFlightSearch();

  const filteredFlights = getFilteredFlights();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2, mb: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!flights.length) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          {from.skyId} to {to.skyId}
        </Typography>
        <Box>
          <Chip
            label={`${departDate.format("ddd, MMM D")}`}
            sx={{ mr: 1 }}
            variant="outlined"
          />
          {tripType === "round" && (
            <Chip
              label={`${returnDate.format("ddd, MMM D")}`}
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {filteredFlights.length}{" "}
        {filteredFlights.length === 1 ? "result" : "results"}
      </Typography>

      {filteredFlights.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No flights match your current filters. Try adjusting your filters or
          search criteria.
        </Alert>
      ) : (
        filteredFlights.map((flight, index) => (
          <FlightCard key={index} flight={flight} />
        ))
      )}
    </Box>
  );
};

export default FlightResults;
