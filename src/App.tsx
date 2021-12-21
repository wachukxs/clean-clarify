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
  AppBar,
  Button,
  ButtonGroup,
  FormControlLabel,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { isWeekend } from "date-fns";

export interface DeliveryTimeOptions {
  value: string;
  title: string;
}

//

function App() {
  // http://localhost:3000/sample-orders.json
  const fetchPreOrders = () => {
    fetch(`${document.location.href}sample-orders.json`)
      .then((response) => response.json())
      .then((data) => setPreOrders(data));
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

  const [preOrders, setPreOrders] = useState<Array<any>>([]);
  const [deliveryTime, setDeliveryTime] = useState(""); // <"10:30" | "12:30" | "18:30" | "">
  const [dateValue, setDateValue] = useState<Date | null>(new Date());
  const [checked, setChecked] = React.useState(false);

  const [availableDeliveryTimes, setAvailableDeliveryTimes] =
    useState<Array<DeliveryTimeOptions>>(deliveryTimes);
  // map of dates, map of delivery time, array of bookings
  const [placedOrdersValue, setPlacedOrdersValue] = useState<
    Map<String, Map<String, Array<String | Boolean>>>
  >(new Map());

  const checkWeekend = (d: string | Date) => {
    if (d instanceof Date) {
      return isWeekend(d);
    } else {
      let dateNumbers = d.split("-").map((v) => parseInt(v));
      return isWeekend(
        new Date(dateNumbers[0], dateNumbers[1] - 1, dateNumbers[2])
      );
    }
  };

  const applyPreOrders = () => {
    if (preOrders.length > 0) {
      for (let index = 0; index < preOrders.length; index++) {
        const _order = preOrders[index];
        console.log(_order);

        if (placedOrdersValue.has(_order.date)) {
          if (
            placedOrdersValue.get(_order.date)?.has(_order.time) &&
            placedOrdersValue.get(_order.date)?.get(_order.time)
          ) {
            let numberOfPossibleOrders = placedOrdersValue
              .get(_order.date)
              ?.get(_order.time)?.length;
            if (
              checkWeekend(_order.time) &&
              numberOfPossibleOrders &&
              numberOfPossibleOrders < 2
            ) {
              placedOrdersValue.get(_order.date)?.get(_order.time)?.push(true); // or customer obj
            } else if (
              !checkWeekend(_order.time) &&
              numberOfPossibleOrders &&
              numberOfPossibleOrders < 4
            ) {
              placedOrdersValue.get(_order.date)?.get(_order.time)?.push(true); // or customer obj
            } else {
              // no space
            }
          }
          // placedOrdersValue.get(_order.date)?.add(_order.time);

          setPlacedOrdersValue(placedOrdersValue);
        } else {
          console.log("putting", _order.date);
          placedOrdersValue.set(
            _order.date,
            new Map().set(_order.time, [true])
          );

          setPlacedOrdersValue(placedOrdersValue);
        }
      }
    }
  };

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

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleSumbit = () => {
    if (dateValue && deliveryTime) {
      let newDateValue = parseDate(dateValue);

      if (placedOrdersValue.has(newDateValue)) {
        if (
          placedOrdersValue.get(newDateValue)?.has(deliveryTime) &&
          placedOrdersValue.get(newDateValue)?.get(deliveryTime)
        ) {
          let numberOfPossibleOrders = placedOrdersValue
            .get(newDateValue)
            ?.get(deliveryTime)?.length;
          if (
            checkWeekend(deliveryTime) &&
            numberOfPossibleOrders &&
            numberOfPossibleOrders < 2
          ) {
            placedOrdersValue.get(newDateValue)?.get(deliveryTime)?.push(true); // or customer obj
          } else if (
            !checkWeekend(deliveryTime) &&
            numberOfPossibleOrders &&
            numberOfPossibleOrders < 4
          ) {
            placedOrdersValue.get(newDateValue)?.get(deliveryTime)?.push(true); // or customer obj
          } else {
            // no space
          }
        }
        // placedOrdersValue.get(_order.date)?.add(_order.time);

        setPlacedOrdersValue(placedOrdersValue);
      } else {
        console.log("putting", newDateValue);
        placedOrdersValue.set(
          newDateValue,
          new Map().set(deliveryTime, [true])
        );

        setPlacedOrdersValue(placedOrdersValue);
      }

      /* if (placedOrdersValue.has(newDateValue)) {
        // placedOrdersValue.get(newDateValue)?.add(deliveryTime);

        setPlacedOrdersValue(placedOrdersValue);
      } else {
        console.log("putting", newDateValue);

        // placedOrdersValue.set(newDateValue, new Set([deliveryTime]));

        setPlacedOrdersValue(placedOrdersValue);
      } */
    }

    checkAndUpdateAvailableDates();

    console.log(placedOrdersValue);
  };

  const handleReset = () => {
    console.log("resetting");
    setDeliveryTime("");
    setDateValue(new Date());
    setAvailableDeliveryTimes(deliveryTimes);
    setPlacedOrdersValue(
      new Map<String, Map<String, Array<String | Boolean>>>()
    );
  };

  useEffect(() => {
    if (checked && preOrders) {
      handleReset();

      applyPreOrders();
    }
  }, [checked]);

  useEffect(() => {
    fetchPreOrders();
  }, []);

  const parseDate = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  const checkAndUpdateAvailableDates = () => {
    if (dateValue) {
      let newDateValue = parseDate(dateValue);

      console.log("has", placedOrdersValue.has(newDateValue));

      if (
        placedOrdersValue.has(newDateValue) &&
        placedOrdersValue.get(newDateValue)?.has(deliveryTime)
      ) {
        if (
          checkWeekend(deliveryTime) &&
          placedOrdersValue.get(newDateValue)?.get(deliveryTime)?.length == 2
        ) {
          let newAvailableDeliveryTimes = deliveryTimes.filter(
            (_t) => _t.value != deliveryTime
          );
          // reset delivery time input
          setDeliveryTime("");
          // there should be a message if there's no avaiable delivery time for the selected date
          setAvailableDeliveryTimes(newAvailableDeliveryTimes);
          console.log(
            "availableDeliveryTimes on",
            newDateValue,
            newAvailableDeliveryTimes
          );
        } else if (
          !checkWeekend(deliveryTime) &&
          placedOrdersValue.get(newDateValue)?.get(deliveryTime)?.length == 4
        ) {
          let newAvailableDeliveryTimes = deliveryTimes.filter(
            (_t) => _t.value != deliveryTime
          );
          // reset delivery time input
          setDeliveryTime("");
          // there should be a message if there's no avaiable delivery time for the selected date
          setAvailableDeliveryTimes(newAvailableDeliveryTimes);

          console.log(
            "availableDeliveryTimes on",
            newDateValue,
            newAvailableDeliveryTimes
          );
        }
      } else if (!placedOrdersValue.has(newDateValue)) {
        console.log("else block");

        setAvailableDeliveryTimes(deliveryTimes);
      }
    }
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <div className="app">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Clarify UI
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      <Stack
        className="main"
        spacing={3}
        direction="column"
        alignItems="center"
      >
        <FormControlLabel
          control={
            <Switch
              {...label}
              checked={checked}
              onChange={handleSwitchChange}
            />
          }
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
