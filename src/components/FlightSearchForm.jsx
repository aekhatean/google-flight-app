import React from "react";
import {
  Paper,
  Button,
  IconButton,
  Typography,
  Box,
  Popover,
  MenuItem,
  Divider,
  FormControl,
  TextField,
  Select,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PriceChangeIcon from "@mui/icons-material/PriceChange";

import { useFlightSearch } from "../contexts/FlightSearchContext";
import { useFlightSearchOperations } from "../hooks/useFlightSearch";
import LocationInput from "./LocationInput";
import TripTypeSelector from "./TripTypeSelector";

const FlightSearchForm = () => {
  const {
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
    handleSwapLocations,
    showPriceGraph,
    setShowPriceGraph,
  } = useFlightSearch();

  const { performSearch } = useFlightSearchOperations();

  // State for passengers popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePassengersClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePassengersClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "passengers-popover" : undefined;

  const totalPassengers = adults + childrenCount + infants;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <TripTypeSelector value={tripType} onChange={setTripType} />
      </Box>

      <Grid container spacing={2}>
        {/* From and To fields with swap button */}
        <Grid item xs={12} md={5}>
          <LocationInput
            label="From"
            placeholder="Enter city or airport"
            value={from}
            onChange={setFrom}
            icon={<FlightTakeoffIcon color="action" />}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={2}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <IconButton
            onClick={handleSwapLocations}
            aria-label="swap locations"
            sx={{
              bgcolor: "background.paper",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <SwapHorizIcon />
          </IconButton>
        </Grid>

        <Grid item xs={12} md={5}>
          <LocationInput
            label="To"
            placeholder="Enter city or airport"
            value={to}
            onChange={setTo}
            icon={<FlightLandIcon color="action" />}
          />
        </Grid>

        {/* Date pickers */}
        <Grid item xs={12} md={tripType === "one-way" ? 4 : 5}>
          <DatePicker
            label="Departure"
            value={departDate}
            onChange={(newValue) => setDepartDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
            disablePast
            sx={{ width: "100%" }}
          />
        </Grid>

        {tripType === "round" && (
          <Grid item xs={12} md={5}>
            <DatePicker
              label="Return"
              value={returnDate}
              onChange={(newValue) => setReturnDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disablePast
              minDate={departDate}
              sx={{ width: "100%" }}
            />
          </Grid>
        )}

        {/* Passengers selector */}
        <Grid item xs={6} md={tripType === "one-way" ? 4 : 2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handlePassengersClick}
            endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            startIcon={<PersonIcon />}
            sx={{
              justifyContent: "space-between",
              height: "56px",
              borderRadius: "24px",
            }}
            aria-describedby={id}
          >
            {totalPassengers}{" "}
            {totalPassengers === 1 ? "passenger" : "passengers"}
          </Button>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePassengersClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: { width: 300, p: 2 },
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Passengers
            </Typography>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={8}>
                <Typography>Adults</Typography>
                <Typography variant="caption" color="text.secondary">
                  Age 12+
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {[...Array(9).keys()].map((i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={8}>
                <Typography>Children</Typography>
                <Typography variant="caption" color="text.secondary">
                  Age 2-11
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {[...Array(9).keys()].map((i) => (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={8}>
                <Typography>Infants</Typography>
                <Typography variant="caption" color="text.secondary">
                  Under 2
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={infants}
                    onChange={(e) => setInfants(e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    {[...Array(6).keys()].map((i) => (
                      <MenuItem key={i} value={i}>
                        {i}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography>Cabin class</Typography>
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth size="small">
                  <Select
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    MenuProps={{ disableScrollLock: true }}
                  >
                    <MenuItem value="economy">Economy</MenuItem>
                    <MenuItem value="premium_economy">Premium</MenuItem>
                    <MenuItem value="business">Business</MenuItem>
                    <MenuItem value="first">First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handlePassengersClose}>Done</Button>
            </Box>
          </Popover>
        </Grid>

        {/* Toggle price graph */}
        <Grid item xs={6} md={2}>
          <Tooltip title="Show price graph">
            <Button
              variant={showPriceGraph ? "contained" : "outlined"}
              fullWidth
              onClick={() => setShowPriceGraph(!showPriceGraph)}
              startIcon={<PriceChangeIcon />}
              sx={{
                height: "56px",
                borderRadius: "24px",
              }}
            >
              {showPriceGraph ? "Hide graph" : "Price graph"}
            </Button>
          </Tooltip>
        </Grid>

        {/* Search button */}
        <Grid item xs={12} md={tripType === "one-way" ? 4 : 3}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={performSearch}
            disabled={!from || !to}
            sx={{ height: "56px" }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FlightSearchForm;
