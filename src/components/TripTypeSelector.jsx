import React from "react";
import { ToggleButtonGroup, ToggleButton, styled } from "@mui/material";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 20,
  "& .MuiToggleButtonGroup-grouped": {
    margin: 2,
    border: 0,
    borderRadius: 20,
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  padding: "4px 16px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const TripTypeSelector = ({ value, onChange }) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <StyledToggleButtonGroup
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="trip type"
      size="small"
      fullWidth
    >
      <StyledToggleButton value="one-way" aria-label="one way">
        One way
      </StyledToggleButton>
      <StyledToggleButton value="round" aria-label="round trip">
        Round trip
      </StyledToggleButton>
    </StyledToggleButtonGroup>
  );
};

export default TripTypeSelector;
