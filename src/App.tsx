import React, { useEffect, useState } from "react";
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
import {
  Button,
  ButtonGroup,
  FormControlLabel,
  Stack,
  Switch,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import DatePicker from "@mui/lab/DatePicker";

export interface DeliveryTimeOptions {
  value: string;
  title: string;
}

// use a Map of set for order

function App() {
  let [deliveryTime, setDeliveryTime] = useState(""); // <"10:30" | "12:30" | "18:30" | "">
  let [dateValue, setDateValue] = useState<Date | null>(new Date());

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

  let [availableDeliveryTimes, setAvailableDeliveryTimes] =
    useState<Array<DeliveryTimeOptions>>(deliveryTimes);

  let [placedOrdersValue, setPlacedOrdersValue] = useState<
    Map<string, Set<string>>
  >(new Map());

  const handleDeliveryTimeChange = (event: SelectChangeEvent) => {
    setDeliveryTime(event.target.value as string);
  };

  const handleDateChange = (newValue: Date | null) => {
    if (newValue) {
      console.log("new dateValue", newValue);

      setDateValue(newValue);

      checkAndUpdateAvailableDates();
    }
  };

  const handleSumbit = () => {

    if (dateValue && deliveryTime) {

      let newDateValue = parseDate(dateValue);

      if (placedOrdersValue.has(newDateValue)) {
        placedOrdersValue.get(newDateValue)?.add(deliveryTime);

        setPlacedOrdersValue(placedOrdersValue);
      } else {
        console.log("putting", newDateValue);

        placedOrdersValue.set(newDateValue, new Set([deliveryTime]));

        setPlacedOrdersValue(placedOrdersValue);
      }
    }

    checkAndUpdateAvailableDates();

    console.log(placedOrdersValue);
  };

  const handleReset = () => {
    console.log("resetting");
  };

  const parseDate = (date: Date) => `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

  const checkAndUpdateAvailableDates = () => {
    
    if (dateValue) {
      let newDateValue = parseDate(dateValue)

      console.log('has', placedOrdersValue.has(newDateValue));
      
      if (placedOrdersValue.has(newDateValue)) {

        availableDeliveryTimes = deliveryTimes.filter(
          (_t) => !placedOrdersValue.get(newDateValue)?.has(_t.value)
        );

        console.log("availableDeliveryTimes on", newDateValue, availableDeliveryTimes);

        // reset delivery time input
        setDeliveryTime("");
        // there should be a message if there's no avaiable delivery time for the selected date
        setAvailableDeliveryTimes(availableDeliveryTimes);
      } else if (!placedOrdersValue.has(newDateValue)) {
        console.log("else block");

        setAvailableDeliveryTimes(deliveryTimes);
      }
    }
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <div className="app">
      <Stack spacing={3} direction="column" alignItems="center">
        <FormControlLabel
          control={<Switch {...label} />}
          label="Apply pre-existing orders"
        />

        <Box sx={{ width: "fit-content" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack>
              <MobileDatePicker
                minDate={new Date()}
                label="Delivery date"
                inputFormat="MM/dd/yyyy"
                value={dateValue}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
              {/**
               * use shouldDisableDate to disable dates with no avaiable delivery time
               *  */}
            </Stack>
          </LocalizationProvider>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <FormControl required={true}>
            <InputLabel id="demo-simple-select-label">Delivery Time</InputLabel>
            <Select
              disabled={availableDeliveryTimes.length < 1}
              labelId="demo-simple-select-label"
              value={deliveryTime}
              id="demo-simple-select"
              label="Delivery Time"
              onChange={handleDeliveryTimeChange}
              inputProps={{ "aria-label": "Choose delivery time" }}
            >
              {/* <MenuItem key='hello' value="" selected>
              <em>Choose</em>
            </MenuItem> */}
              {availableDeliveryTimes.map((timeOption, i) => (
                <MenuItem key={i} value={`${timeOption.value}`}>
                  {timeOption.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {availableDeliveryTimes.length < 1
                ? `No delivery time for selected date`
                : `Choose delivery time`}
            </FormHelperText>
          </FormControl>
        </Box>

        <Box sx={{ width: "fit-content" }}>
          <ButtonGroup aria-label="button group">
            <Button variant="outlined" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="contained" onClick={handleSumbit}>
              Submit
            </Button>
          </ButtonGroup>
        </Box>
      </Stack>
    </div>
  );
}

export default App;
