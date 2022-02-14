// updates date and time every second
let variable = setInterval (myFunction, 1000);

// function for getting date and time
function myFunction(){
let today = new Date();
let date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date+' '+time;
document.getElementById("CurrentDate").innerHTML = "Päivämäärä ja kellonaika juuri nyt:  " + dateTime;
console.log(dateTime);
};