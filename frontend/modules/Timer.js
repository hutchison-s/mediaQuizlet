const newEl = (type, id = null, cl = null) => {
    const el = document.createElement(type);
    if (id) {
      el.id = id;
    }
    if (cl) {
      el.classList.add(cl);
    }
    return el;
  };

class Timer {
    constructor(startTime, limit, quizId, submitCallback) {
      this.remaining = limit*60; // in seconds
      this.display = newEl("div", "timer");
      this.timeBox = newEl("p", "timeBox");
      this.interval = null;
      this.quizId = quizId;
      this.callback = submitCallback;
      this.end = startTime + (limit*60000);
      this.init();
    }
    init() {
      console.log(this.remaining);
      this.timeBox.textContent = this.remaining;
      this.display.appendChild(this.timeBox);
    }
    startTimer() {
      this.interval = setInterval(() => {
        this.countdown();
      }, 1000);
    }
    countdown() {
      this.remaining = Math.floor((this.end - Date.now())/1000) // in seconds;
      let sec = this.remaining % 60;
      let min = Math.floor(this.remaining / 60);
      
      if (min <= 0 && sec <= 0) {
        clearInterval(this.interval);
        this.callback();
      }
      let minutes = min.toString();
      let seconds =
        sec.toString().length < 2 ? "0" + sec.toString() : sec.toString();
      this.timeBox.textContent = `${minutes}:${seconds}`;
    }
  }

  export default Timer;