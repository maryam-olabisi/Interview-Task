//index.js

//import { TableController } from "./controllers/tableController.js";

const tableController = new TableController();

const LOCS = {
  London: { lat: 51.5085, long: -0.1257 },
  Cardiff: { lat: 51.48, long: -3.18 },
  Birmingham: { lat: 52.4814, long: -1.8998 },
  Nottingham: { lat: 52.9536, long: -1.1505 },
  Manchester: { lat: 53.4809, long: -2.2374 },
  Wakefield: { lat: 53.6833, long: -1.4977 },
  Leeds: { lat: 53.7965, long: -1.5478 },
};

const METRICS = {
  Temperature: "temperature_2m",
  Precipitation: "precipitation_probability",
  Humidity: "relative_humidity_2m",
  Rain: "rain",
  Visibility: "visibility",
  Wind: "wind_speed_10m",
}

function getLocationSelect() {
  return document.getElementById("locations");
}

function setLocations() {
  const locationSelect = getLocationSelect();

  for (const [key, value] of Object.entries(LOCS)) {
    const newOption = new Option(key, key);
    locationSelect.add(newOption, undefined);
  }
  // set value blank initially
  locationSelect.value = "";
}

function setMetrics() {
  const _metrics = document.getElementById("metrics");

  for (const [key, value] of Object.entries(METRICS)) {
    _check = document.createElement("input");
    _check.type = "checkbox";
    _check.id = key;
    _check.value = value;
    _check.classList = "metric-check"
    if (key == "Precipitation" || key == "Temperature" ) {
      _check.checked = true;
    }
    _label = document.createElement("label");
    _label.innerHTML = `&nbsp;${key}`;

    // _check.addEventListener("click", updateMetrics());

    _metrics.appendChild(_check);
    _metrics.appendChild(_label);
    _metrics.appendChild(document.createElement("br"));
  }
}

function onSelectChange(e) {
  // show the spinner
  document.getElementById("spinner").style.display = "inline-block";
  // select coordinates based on select value
  const coords = LOCS[e.target.value];

  // api call to https://open-meteo.com/en/docs
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.long}&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,rain,visibility,wind_speed_10m`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // hide spiiner
      document.getElementById("spinner").style.display = "none";
      tableController.renderData(data);
    });
}

function init() {
  setLocations();
  setMetrics();

  const locationSelect = getLocationSelect();
  locationSelect.addEventListener("change", onSelectChange);

  tableController.renderPlaceholder();
}

// uncomment this to load 
init();
