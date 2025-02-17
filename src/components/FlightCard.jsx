import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
  Collapse,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";

const FlightCard = ({ flight }) => {
  const [expanded, setExpanded] = useState(false);
  const [airlines, setAirlines] = useState([]);

  useEffect(() => {
    if (flight.legs && Array.isArray(flight.legs)) {
      const airlineSet = new Set();
      flight.legs.forEach((leg) =>
        airlineSet.add(leg.carriers?.marketing[0]?.name)
      );
      setAirlines(Array.from(airlineSet).sort());
    }
  }, [flight.legs]);

  // Helper functions to format data
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  };

  const formatLayovers = (segmants) => {
    const layovers = [];
    segmants.forEach((seg, index) => {
      if (index < segmants.length - 1) {
        layovers.push(
          `${seg.destination.name} ${seg.destination.type} - ${seg.destination.country}`
        );
      }
    });
    if (!segmants || !segmants.length || segmants.length === 1)
      return "Nonstop";
    if (segmants.length === 2) return `1 stop: ${layovers.join(", ")}`;
    return `${segmants.length - 1} stops: ${layovers.join(", ")}`;
  };

  const getStopLabel = (segmants) => {
    if (!segmants || !segmants.length || segmants.length === 1)
      return "Nonstop";
    if (segmants.length === 2) return "1 stop";
    return `${segmants.length - 1} stops`;
  };

  return (
    <Card elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid
          container
          direction="row"
          spacing={4}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              src={flight.legs[0].carriers.marketing[0].logoUrl}
              alt={flight.legs[0].carriers.marketing[0].name}
              title={flight.legs[0].carriers.marketing[0].name}
              sx={{ mr: 1, width: 32, height: 32 }}
            />
            <Box>
              <Typography variant="subtitle1">
                {airlines ? airlines.join(", ") : "Multiple Airlines"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {flight.id ? `Flight #${flight.id}` : ""}
              </Typography>
            </Box>
          </Grid>

          {/* Flight times */}
          <Grid item xs={12} sm={4}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <FlightTakeoffIcon color="action" fontSize="small" />
              </Grid>
              <Grid item>
                <Typography variant="body1" fontWeight="medium">
                  {formatTime(flight.legs[0].departure)}
                </Typography>
              </Grid>
              <Grid item sx={{ flexGrow: 1, px: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: 1,
                      flexGrow: 1,
                      borderBottom: "1px dashed rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Chip
                    label={getStopLabel(flight.legs[0].segments)}
                    size="small"
                    color={
                      flight.legs[0].segments.length === 1
                        ? "success"
                        : "default"
                    }
                    sx={{ my: 0.5 }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <FlightLandIcon color="action" fontSize="small" />
              </Grid>
              <Grid item>
                <Typography variant="body1" fontWeight="medium">
                  {formatTime(flight.legs[0].arrival)}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <AccessTimeIcon
                fontSize="small"
                sx={{ mr: 0.5 }}
                color="action"
              />
              <Typography variant="body2" color="text.secondary">
                Duration: {formatDuration(flight.legs[0].durationInMinutes)}
              </Typography>
            </Box>

            {flight.legs[0].segments && flight.legs[0].segments.length > 1 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {formatLayovers(flight.legs[0].segments)}
              </Typography>
            )}
          </Grid>

          {/* Price and learn more button */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="primary" fontWeight="medium">
              {flight.price.formatted}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AirplaneTicketIcon />}
              sx={{ mt: 1 }}
            >
              Learn more
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FlightCard;
