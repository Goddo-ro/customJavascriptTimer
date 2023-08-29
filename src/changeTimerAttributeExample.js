import Timer from "./components/Timer.js";

const timer = new Timer(document.getElementById("timer3"));
timer.start();

const timerView = document.getElementById("change-attribute");
setTimeout(() => {
  timerView.setAttribute("seconds", "8");
  console.log("Attribute has been changed!");
}, 3000);
