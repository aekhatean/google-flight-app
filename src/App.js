import React from "react";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FlightIcon from "@mui/icons-material/Flight";

import theme from "./theme";
import { FlightSearchProvider } from "./contexts/FlightSearchContext";
import FlightSearchForm from "./components/FlightSearchForm";
import PriceGraph from "./components/PriceGraph";
import FlightFilters from "./components/FlightFilters";
import FlightResults from "./components/FlightResults";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FlightSearchProvider>
          <Box
            sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 4 }}
          >
            <Box sx={{ bgcolor: "primary.main", color: "white", py: 2, mb: 3 }}>
              <Container maxWidth="lg">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FlightIcon sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h1">
                    Flight Search
                  </Typography>
                </Box>
              </Container>
            </Box>

            <Container maxWidth="lg">
              <FlightSearchForm />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                <Box sx={{ width: { xs: "100%", md: "300px" } }}>
                  <FlightFilters />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <PriceGraph />
                  <FlightResults />
                </Box>
              </Box>
            </Container>
          </Box>
        </FlightSearchProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
