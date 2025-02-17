import React, { useState, useEffect } from "react";
import {
  TextField,
  Autocomplete,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { getAirportSuggestions } from "../api/flightApi";

const LocationInput = ({
  value,
  onChange,
  label,
  placeholder,
  icon,
  fullWidth = true,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue.length < 2) {
      setOptions([]);
      return undefined;
    }

    (async () => {
      setLoading(true);
      try {
        const response = await getAirportSuggestions(inputValue);
        if (active && response && response.data) {
          setOptions(response.data);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      id={`location-input-${label}`}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue : "");
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      getOptionLabel={(option) =>
        typeof option === "string"
          ? option
          : `${option.presentation.suggestionTitle}`
      }
      loading={loading}
      fullWidth={fullWidth}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={10} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default LocationInput;
