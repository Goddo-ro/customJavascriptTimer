import { resetTimerEvent } from "../customEvents/timerEvents.js";

class TimerView extends HTMLElement {
  constructor() {
    super();

    this.addEventListener("starttimer", this.startTimer);
    this.addEventListener("pausetimer", this.pauseTimer);
    this.addEventListener("resettimer", this.resetTimer);
    this.addEventListener("endtimer", this.endTimer);

    if (this.getAttribute("seconds")) this.handleSeconds(this.getAttribute("seconds"));
    else if (this.getAttribute("to-time")) this.handleToTime(this.getAttribute("to-time"));
  }

  handleSeconds(seconds) {
    try {
      const givenMilliseconds = Number(seconds) * 1000;
      this.seconds = (givenMilliseconds / 1000) % 86400;
      this.initialSeconds = this.seconds;
    } catch (e) {
      throw new Error("Given time is incorrect");
    }
  }

  handleToTime(givenTimeString) {
    try {
      const currentDate = new Date();
      const [currentHours, currentMinutes, currentSeconds] = [currentDate.getHours(),
        currentDate.getMinutes(), currentDate.getSeconds()];
      const currentTimeInSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      if (givenTimeString === "00:00:00") givenTimeString = "24:00:00";
      const [givenHours, givenMinutes, givenSeconds] = givenTimeString.split(":").map(Number);
      let givenTimeInSeconds = givenHours * 3600 + givenMinutes * 60 + givenSeconds;

      // If given time is less than current it means that we need to plus 24 hours to our given time
      if (givenTimeInSeconds < currentTimeInSeconds) givenTimeInSeconds += 86400;

      this.seconds = Math.abs(givenTimeInSeconds - currentTimeInSeconds);
      this.initialSeconds = this.seconds;
    } catch (e) {
      throw new Error("Given time is incorrect");
    }
  }

  getFormattedTime() {
    const hours = Math.floor(this.seconds / 3600);
    const minutes = Math.floor((this.seconds % 3600) / 60);
    const remainSeconds = this.seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainSeconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${remainSeconds.toString().padStart(2, "0")}`;
  }

  connectedCallback() {
    this._shadow = this.attachShadow({ mode: "open" });

    const styles = document.createElement("style");
    styles.innerHTML = `
      span {
        font-family: 'Roboto', sans-serif;
        font-size: 3em;
        font-weight: bold;
        color: #CCA8E9;
      }
    `;

    this._shadow.append(styles);

    this.timeSpan = document.createElement("span");
    this.timeSpan.innerHTML = this.getFormattedTime();

    this._shadow.append(this.timeSpan);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!oldValue || oldValue === newValue) return;
    if (name === "seconds") this.handleSeconds(newValue);
    if (name === "to-time") this.handleToTime(newValue);
    this.timeSpan.innerHTML = this.getFormattedTime();
  }

  static get observedAttributes() {
    return ['seconds', 'to-time'];
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.seconds--;
      this.timeSpan.innerHTML = this.getFormattedTime();
      if (this.seconds <= 0) {
        this.dispatchEvent(new CustomEvent("endtimer"));
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.seconds = this.initialSeconds;
    this.timeSpan.innerHTML = this.getFormattedTime();
  }

  endTimer() {
    clearInterval(this.timerInterval);
    console.log((`Timer "${this.parentElement.id}" finished its work!`));
  }
}

customElements.define("timer-view", TimerView,);
