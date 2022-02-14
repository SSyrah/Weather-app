const tablebody = document.getElementById("tablebody");
const valueForm = document.getElementById("mainform");
const valueButton = document.getElementById("valuedata");
const theCanvas = document.getElementById("myChart");
let loadingSpinner = document.getElementById("spinner-border");
let paivamaara = 0;
let keskiarvo = 0;


let variable = setInterval (myFunction, 1000);
function myFunction(){
let today = new Date();
let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;
document.getElementById("CurrentDate").innerHTML = "Päivämäärä ja kellonaika juuri nyt:  " + dateTime;
console.log(dateTime);
};


const myAsyncFuntion = async (selectedValue, slicer) => {
  console.log("welcome to asyncfunction...");

  loadingSpinner.classList.remove("d-none");

  let response;
  if (selectedValue === "limit/50") {
    response = await fetch(
      `https://webapi19sa-1.course.tamk.cloud/v1/weather/limit/${slicer}`
    );
  } else {
    response = await fetch(
      `https://webapi19sa-1.course.tamk.cloud/v1/weather/${selectedValue}/${slicer}`
    );
  }

  console.log("response", response);
  // removing spinner
  loadingSpinner.classList.add("d-none");
  // showing chart(because of original white background)
  theCanvas.classList.remove("d-none");

  const data = await response.json();
  console.log("data", data);
  tablebody.textContent = "";

  data.reverse();

  data.forEach((rowData, index) => {
    console.log("inside foreach", index);
    const row = document.createElement("tr");

    if (selectedValue !== "limit/50") {
      rowData.value = eval(`rowData.${selectedValue}`);
      rowData.data = selectedValue;
      rowData.device_id = selectedValue;
    } else {
      rowData.value = eval(`rowData.data.${Object.keys(rowData.data)}`);
      rowData.data = Object.keys(rowData.data);
    }

    let cellDataArray = [
      index + 1,
      rowData.device_id,
      rowData.date_time.slice(0, 10),
      rowData.date_time.slice(11, 19),
      rowData.data,
      Number.parseFloat(rowData.value).toPrecision(4),
    ];

    console.log("Selected Value:", rowData.value);
    console.log("cellDataArray", cellDataArray);
    console.log(paivamaara, keskiarvo);

    paivamaara++;
    keskiarvo += Number(rowData.value);

    console.log(keskiarvo);

    for (const cellData of cellDataArray) {
      const cell = document.createElement("td");
      const celltext = document.createTextNode(cellData);

      cell.appendChild(celltext);
      row.appendChild(cell);
    }

    // prints number of dates and average from values

    tablebody.appendChild(row);
    document.getElementById("print").innerHTML =
      " Mittaustulosten keskiarvo: " +
      Number.parseFloat(keskiarvo / paivamaara).toPrecision(4);

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

    document.getElementById("measure").innerHTML = paivamaara;
    document.getElementById("location").innerHTML = measure;

    console.log(cellDataArray);

    const myChart = new Chart(theCanvas, {
      type: "bar",
      backgroundColor: "white",
      data: {
        labels: data.map((values) => values.date_time),
        datasets: [
          {
            label: rowData.data,
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
valueButton.addEventListener("click", () => {
  console.log("pressed button");
  const selectedValue = valueForm.values.value;
  const slicer = valueForm.time.value;
  console.log("SelectedValue= ", selectedValue);
  console.log("Slicer= ", slicer);
  myAsyncFuntion(selectedValue, slicer);
  paivamaara = 0;
  keskiarvo = 0;
});
