import React from "react";
import { Paper, Typography, Box, CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFlightSearch } from "../contexts/FlightSearchContext";

const PriceGraph = () => {
  const { priceHistory, from, to, loading, showPriceGraph } = useFlightSearch();
  if (!showPriceGraph || !priceHistory.length) {
    return null;
  }

  if (loading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          minHeight: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Price history for {from.skyId} to {to.skyId}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Prices shown are the lowest available for each day
      </Typography>

      <Box sx={{ height: 300, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={priceHistory}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              angle={-45}
              textAnchor="end"
              height={70}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis tickFormatter={(value) => `$${value}`} />
            <Tooltip
              formatter={(value) => [`$${value}`, "Price"]}
              labelFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1a73e8"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block", textAlign: "center" }}
      >
        Prices may change due to availability, currency fluctuations, and other
        factors
      </Typography>
    </Paper>
  );
};

export default PriceGraph;
