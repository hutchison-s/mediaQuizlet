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
    constructor(limit, quizId, submitCallback) {
      this.remaining = `${limit - 1}:59`;
      this.display = newEl("div", "timer");
      this.timeBox = newEl("p", "timeBox");
      this.interval = null;
      this.quizId = quizId;
      this.callback = submitCallback;
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
      let [min, sec] = this.remaining
        .toString()
        .split(":")
        .map((x) => parseInt(x));
      sec--;
      
      if (min == 0 && sec == 0) {
        clearInterval(this.interval);
        this.callback();
      }
      if (sec == -1) {
        min--;
        sec = 59;
      }
      let minutes = min.toString();
      let seconds =
        sec.toString().length < 2 ? "0" + sec.toString() : sec.toString();
      this.remaining = `${minutes}:${seconds}`;
      this.timeBox.textContent = this.remaining;
    }
  }

  export default Timer;