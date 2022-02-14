const myButton = document.getElementById("valuebutton");
let loadingSpinner = document.getElementById("spinner-border");
const tablebody = document.getElementById("tablebody");

// Get the canvas element from HTML DOM
const canvasElement = document.getElementById("myChart");


let variable = setInterval (myFunction, 1000);
function myFunction(){
let today = new Date();
let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;
document.getElementById("CurrentDate").innerHTML = "Päivämäärä ja kellonaika juuri nyt:  " + dateTime;
console.log(dateTime);
};


const data = async (measure) => {
  console.log("entering to function...");

  loadingSpinner.classList.remove("d-none");

  const response = await fetch(
    // fetching data from own API 
    `http://iotweb048.course.tamk.cloud/api/V1/weather/`      
    // `https://webapi19sa-1.course.tamk.cloud/v1/weather/wind_direction/${measure}`
  );
  console.log("response is: ", response);

  loadingSpinner.classList.add("d-none");
  canvasElement.classList.remove("d-none");

  const dataValues = await response.json();
  console.log("data", dataValues);

  tablebody.textContent = "";

  dataValues.slice(0, measure).forEach((valueData, index) => {
    const row = document.createElement("tr");

    const WindDirArray = [
      index,
      valueData.date_time.slice(0, 10),
      valueData.date_time.slice(11, 19),
      (valueData.value = eval(`valueData.data.${Object.keys(valueData.data)}`)),
    ];

    console.log("valueDada.data: ", valueData.data);

    for (const value of WindDirArray) {
      const cell = document.createElement("td");
      const celltext = document.createTextNode(value);

      cell.appendChild(celltext);
      row.appendChild(cell);

      tablebody.appendChild(row);
    }

    // Initialize the Chartjs library

    const myChart = new Chart(canvasElement, {
      type: "line",
      backgroundColor: "blue",
      data: {
        labels: dataValues.map((values) => values.date_time),
        datasets: [
          {
            label: "Wind Direction (Degrees)",
            data: dataValues.map((values) => values.value),
            backgroundColor: "blue",
            borderColor: "black",
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

myButton.addEventListener("click", () => {
  console.log("pressed button");
  const valueButton = form.time.value;
  console.log("value is: ", valueButton);
  data(valueButton);
});
