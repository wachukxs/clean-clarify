import React, { ChangeEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Button, Checkbox, FormControlLabel, Stack, Switch } from "@mui/material";
import TextField from "@mui/material/TextField";

export interface DeliveryTimeOptions {
  value: string;
  title: string;
}

function App() {
  let [age, setAge] = useState("30");
  let [dateValue, setDateValue] = useState<Date | null>(new Date());
  const handleAgeChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleDateChange = (newValue: Date | null) => {
    console.log("new dateValue", newValue);

    setDateValue(newValue);
  };

  const deliveryTimes: Array<DeliveryTimeOptions> = [
    {
      value: "10:30",
      title: "10:30 AM",
    },
    {
      value: "12:30",
      title: "12:30 PM",
    },
    {
      value: "18:30",
      title: "6:30 PM",
    },
  ];

  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <div className="app">
      

      <FormControlLabel control={<Switch {...label} />} label="Apply pre-existing orders" />

      <Box sx={{ width: "fit-content" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack>
            <MobileDatePicker
              label="Date mobile"
              inputFormat="MM/dd/yyyy"
              value={dateValue}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
      </Box>

      <Box sx={{ minWidth: 120 }}>
        <FormControl required={true}>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleAgeChange}
            inputProps={{ "aria-label": "Choose delivery time" }}
          >
            <MenuItem value="">
              <em>Choose</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          <FormHelperText>Choose delivery time</FormHelperText>
        </FormControl>
      </Box>

      <Button variant="text">Rest</Button>
      <Button variant="contained">Submit</Button>
    </div>
  );
}

export default App;
