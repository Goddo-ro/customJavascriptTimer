import { pauseTimerEvent, resetTimerEvent, startTimerEvent } from "../customEvents/timerEvents.js";

export default function Timer(timerContainer) {
  const timerView = timerContainer.querySelector("timer-view");
  if (!timerView) throw new Error("Cannot find timer view element");

  const startButton = timerContainer.querySelector(".timer-container__start-button");
  const pauseButton = timerContainer.querySelector(".timer-container__pause-button");
  const resetButton = timerContainer.querySelector(".timer-container__reset-button");

  pauseButton.classList.add("disable");

  const enableStart = () => {
    startButton.classList.remove("disable");
    startButton.addEventListener("click", handleStart);

    pauseButton.classList.add("disable");
    pauseButton.removeEventListener("click", handlePause);
  }

  const enablePause = () => {
    pauseButton.classList.remove("disable");
    pauseButton.addEventListener("click", handlePause);

    startButton.classList.add("disable");
    startButton.removeEventListener("click", handleStart);
  }

  function handleStart() {
    enablePause();
    timerView.dispatchEvent(startTimerEvent);
  }

  function handlePause() {
    enableStart();
    timerView.dispatchEvent(pauseTimerEvent);
  }

  function handleReset() {
    enableStart();
    timerView.dispatchEvent(resetTimerEvent);
  }

  enableStart();
  resetButton.addEventListener("click", handleReset);

  return {
    start: handleStart,
    pause: handlePause,
    reset: handleReset,
  }
}
