//table controller to handle rendering of table data
//export 
class TableController {
  _element;

  _placeholderContent = `
        <p>Please select a location</p>
    `;

  _selectedDay = "";

  constructor() {
    this._element = document.getElementById("table-container");
  }

  renderPlaceholder() {
    this._element.innerHTML = this._placeholderContent;
  }

  renderData(data) {
    // transform api data into ready to display format
    // make processed data available in the class
    this.processedData = data.hourly.time.reduce((acc, cur, index) => {
      const dateTime = new Date(cur);
      const day = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dateTime);
      const time = new Intl.DateTimeFormat("en-DB", {
        hour: "numeric",
        minute: "numeric",
      }).format(dateTime);
      if (acc.hasOwnProperty(day)) {
        acc[day].push({
          time,
          temperature_2m: data.hourly.temperature_2m[index],
          precipitation_probability: data.hourly.precipitation_probability[index],
          relative_humidity_2m: data.hourly.relative_humidity_2m[index],
          rain: data.hourly.rain[index],
          wind_speed_10m: data.hourly.wind_speed_10m[index],
          visibility: data.hourly.visibility[index],
        });
      } else {
        acc[day] = [
          {
            time,
            temperature_2m: data.hourly.temperature_2m[index],
            precipitation_probability: data.hourly.precipitation_probability[index],
            relative_humidity_2m: data.hourly.relative_humidity_2m[index],
            rain: data.hourly.rain[index],
            wind_speed_10m: data.hourly.wind_speed_10m[index],
            visibility: data.hourly.visibility[index],
          },
        ];
      }
      return acc;
    }, {});

    this._selectedDay = Object.keys(this.processedData)[0];

    const markup = this.generateMarkup(this.processedData);
    this._element.innerHTML = markup;

    // handle metric update
    this.handleMetricChange();
  }

  selectDay(key) {
    this._selectedDay = key;
  }

  // handle day click
  handleDayClick(selectedDay) {
    // update selected day and re-render table
    this._selectedDay = selectedDay;
    //console.log(this._selectedDay);
    this._element.innerHTML = this.generateMarkup(this.processedData);
  }

  // get selected metrics
  getSelectedMetrics() {
    const _s = document.querySelectorAll(".metric-check:checked");
    console.log([..._s]);
    return [..._s].map(b => b.value);
  }

  // return selected metrics
  generateTableMarkup(processedData, selectedMetrics) {
    if (selectedMetrics.length == 0) {
      return ` <tr> <td colspan="100%">Please select a metric</td> </tr> `
    }
    
    const labels = {
      temperature_2m: "Temperature (&deg;C)",
      precipitation_probability: "Precipitation (mm)",
      relative_humidity_2m: "Humidity (%)",
      rain: "Rain (mm)",
      visibility: "Visibility (meters)",
      wind_speed_10m: "Wind Speed: 10m (km/h)",
    }

    return selectedMetrics.map(metric => `
      <tr>
        <th scope="col">
          ${labels[metric]}
        </th>
        ${processedData[this._selectedDay]
          .map(item =>
            `<td>
                ${item[metric].toString()}
            </td>
            `).join("")}
      </tr>`).join("");
  }

  // handle metric change
  handleMetricChange() {
    const _boxes = document.querySelectorAll(".metric-check");
    _boxes.forEach(_box => {
      _box.addEventListener("change", () => {
        document.getElementById("table-data").innerHTML = this.generateTableMarkup(this.processedData, this.getSelectedMetrics());
      });
    });
  }

  generateMarkup(processedData) {
    // turn
    // add an onclick function to nav-link
    // use this._selectedDay to determine the active tab
    const selectedMetrics = this.getSelectedMetrics();
    console.log(selectedMetrics);
    return `
            <ul class="nav nav-tabs">
                ${Object.keys(processedData)
                  .map((key) => {
                    return `
                        <li class="nav-link ${key === this._selectedDay ? "active" : ""}" onclick="tableController.handleDayClick('${key}');" >
                            <p>${key}</p>
                        </li>
                    `;
                  })
                  .join("")}
            </ul>
            <table class="table">
                <tr>
                    <th scope="col">
                        Time
                    </th>
                    ${processedData[this._selectedDay]
                      .map((item) => {
                        return `
                            <th>
                                ${item.time}
                            </th>
                        `;
                      })
                      .join("")}
                </tr>
                <tbody id="table-data">
                  ${this.generateTableMarkup(processedData, selectedMetrics)}
                </tbody>
            </table>
        `;
  }
}
