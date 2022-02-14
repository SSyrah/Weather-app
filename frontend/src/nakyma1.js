const tablebody = document.getElementById("tablebody");
const valueForm = document.getElementById("mainform");
const valueButton = document.getElementById("valuedata");
// import canvasElement from HTML
const chart = document.getElementById("myChart");
// loading spinner HTML
let loadingSpinner = document.getElementById("spinner-border");
let paivamaara = 0;
let keskiarvo = 0;

// function for showing date and time
let variable = setInterval (myFunction, 1000);
function myFunction(){
let today = new Date();
let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;
document.getElementById("CurrentDate").innerHTML = "Päivämäärä ja kellonaika juuri nyt:  " + dateTime;
console.log(dateTime);
};
// function for fetching data and creating table element for that data
const myAsyncFuntion = async (selectedValue) => {
  console.log("welcome to asyncfunction...");

  // showing loading spinner
  loadingSpinner.classList.remove("d-none");

  const response = await fetch(
    `https://webapi19sa-1.course.tamk.cloud/v1/weather/${selectedValue}`
  );
  console.log("response", response);

  // hiding loading-spinner
  loadingSpinner.classList.add("d-none");
  // showing chart(because of original white background)
  chart.classList.remove("d-none");

  const data = await response.json();
  console.log("data", data);
  tablebody.textContent = "";

  data.reverse();
  
  data.forEach((rowData, index) => {
    console.log("inside foreach", index);
    const row = document.createElement("tr");

    //evaluating string to value attribute, which can be included to .value
    if (selectedValue !== "limit/50")
      rowData.value = eval(`rowData.${selectedValue}`);
    else {
      rowData.value = eval(`rowData.data.${Object.keys(rowData.data)}`);
    }
    // choosing sensor value
    if (selectedValue !== "limit/50") {
      rowData.data = selectedValue;
    } else {
      rowData.data = Object.keys(rowData.data);
    }
    // creating table
    let cellDataArray = [
      index + 1,
      rowData.device_id,
      rowData.date_time.slice(0, 10), //showing only date
      rowData.date_time.slice(11, 19), //showing time
      rowData.data,
      // rowData.value,
      Number.parseFloat(rowData.value).toPrecision(4), //rounding data
    ];

    console.log("Selected Value:", rowData.value);
    console.log("cellDataArray", cellDataArray);
    console.log(paivamaara, keskiarvo);

    paivamaara++; // used for showing sum amount of days
    keskiarvo += Number(rowData.value); // sum of results

    console.log(keskiarvo);
    // creating loop for filling cells with values/strings
    for (const cellData of cellDataArray) {
      // creating element fo one cell
      const cell = document.createElement("td");
      // creating textnode for one cell
      const celltext = document.createTextNode(cellData);
      //adding textnode to one cell
      cell.appendChild(celltext);
      // adding cell to row
      row.appendChild(cell);
    }
    tablebody.appendChild(row);
    // prints number of dates and average from sum of values
    document.getElementById("print").innerHTML =
      " Mittaustulosten keskiarvo: " +
      Number.parseFloat(keskiarvo / paivamaara).toPrecision(4);

    // choosing right sensor value for printing to webpage
    let measure;
    if (selectedValue === "wind_direction") measure = "Tuulen suunta";
    else if (selectedValue === "wind_speed") measure = "Tuulen nopeus";
    else if (selectedValue === "temperature") measure = "Lämpötila";
    else if (selectedValue === "humidity_out") measure = "Ilmankosteus ulkona";
    else if (selectedValue === "humidity_in") measure = "Ilmankosteus sisällä";
    else if (selectedValue === "light") measure = "Valoisuus";
    else if (selectedValue === "rain") measure = "Sademäärä";
    else if (selectedValue === "limit/50") measure = "Kaikki mittausarvot";
    else if (selectedValue === "Air_pres_1") measure = "Ilmanpaine";
    else if (selectedValue === "Wind_dir_MIRC") measure = "Tuulen suunta ryhmä 27";

    // exporting measure and location to HTML
    document.getElementById("measure").innerHTML = paivamaara;
    document.getElementById("location").innerHTML = measure;

    // creating chart.js
    const myChart = new Chart(chart, {
      type: "line",
      data: {
        labels: data.map((values) => values.date_time),
        datasets: [
          {
            label: selectedValue,
            data: data.map((values) => values.value),
            backgroundColor: "blue",
            borderColor: "white",
            borderWidth: 2,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                tooltipFormat: "d.L.Y HH:mm:SS",
              },
            },
          ],
        },
      },
    });
  });
};

// creating button for importing data from API
valueButton.addEventListener("click", () => {
  console.log("pressed button");
  const selectedValue = valueForm.values.value;
  console.log(selectedValue);
  // function for creating table and importing data
  myAsyncFuntion(selectedValue);
  // resetting number of days and average values
  paivamaara = 0;
  keskiarvo = 0;
});
