import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  RadioGroup,
  Radio,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SortIcon from "@mui/icons-material/Sort";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useFlightSearch } from "../contexts/FlightSearchContext";

const FlightFilters = () => {
  const { flights, filters, setFilters, sortBy, setSortBy, resetFilters } =
    useFlightSearch();

  const [expanded, setExpanded] = React.useState(true);

  // Get all unique airlines from flights
  const airlines = useMemo(() => {
    if (!flights.length) return [];

    const airlineSet = new Set();
    flights.forEach((flight) => {
      if (flight.legs && Array.isArray(flight.legs)) {
        flight.legs.forEach((leg) =>
          airlineSet.add(leg.carriers?.marketing[0]?.name)
        );
      }
    });

    return Array.from(airlineSet).sort();
  }, [flights]);

  // Find price range
  const priceRange = useMemo(() => {
    if (!flights.length) return [0, 1000];

    let min = Infinity;
    let max = 0;

    flights.forEach((flight) => {
      if (flight.price) {
        min = Math.min(min, flight.price.raw);
        max = Math.max(max, flight.price.raw);
      }
    });

    // Round to nearest 100
    min = Math.floor(min / 100) * 100;
    max = Math.ceil(max / 100) * 100;

    return [min, max];
  }, [flights]);

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: newValue[1],
    }));
  };

  const handleAirlineChange = (event) => {
    const airlineName = event.target.name;
    const isChecked = event.target.checked;

    setFilters((prev) => {
      const updatedAirlines = isChecked
        ? [...prev.airlines, airlineName]
        : prev.airlines.filter((a) => a !== airlineName);

      return {
        ...prev,
        airlines: updatedAirlines,
      };
    });
  };

  const handleStopsChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      stops: event.target.value,
    }));
  };

  if (!flights.length) return null;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FilterAltIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <IconButton onClick={() => setExpanded(!expanded)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <SortIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">Sort by</Typography>
          </Box>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={(e, newValue) => newValue && setSortBy(newValue)}
            size="small"
            sx={{ width: "100%" }}
          >
            <ToggleButton value="best" sx={{ width: "33%" }}>
              Best
            </ToggleButton>
            <ToggleButton value="price" sx={{ width: "33%" }}>
              Price
            </ToggleButton>
            <ToggleButton value="duration" sx={{ width: "33%" }}>
              Duration
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Stops
          </Typography>
          <RadioGroup value={filters.stops} onChange={handleStopsChange}>
            <FormControlLabel
              value="any"
              control={<Radio />}
              label="Any number of stops"
            />
            <FormControlLabel
              value="nonstop"
              control={<Radio />}
              label="Nonstop only"
            />
            <FormControlLabel
              value="1stop"
              control={<Radio />}
              label="Up to 1 stop"
            />
            <FormControlLabel
              value="2stops"
              control={<Radio />}
              label="Up to 2 stops"
            />
          </RadioGroup>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Price
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              getAriaLabel={() => "Price range"}
              value={[priceRange[0], filters.maxPrice || priceRange[1]]}
              onChange={handlePriceChange}
              min={priceRange[0]}
              max={priceRange[1]}
              step={50}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `$${value}`}
              getAriaValueText={(value) => `$${value}`}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[1]}
            </Typography>
          </Box>
        </Box>

        {airlines.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Airlines
              </Typography>
              <FormControl component="fieldset">
                <FormGroup>
                  {airlines.map((airline) => (
                    <FormControlLabel
                      key={airline}
                      control={
                        <Checkbox
                          checked={filters.airlines.includes(airline)}
                          onChange={handleAirlineChange}
                          name={airline}
                        />
                      }
                      label={airline}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Box>
          </>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={resetFilters} variant="text">
            Reset filters
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FlightFilters;
