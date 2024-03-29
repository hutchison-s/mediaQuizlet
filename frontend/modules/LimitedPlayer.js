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

class LimitedPlayer {
    constructor(file, limit) {
      this.file = file;
      this.audio = newEl("audio");
      this.player = newEl("div", null, "playerBox");
      this.progressBar = newEl("div", null, "progressBar");
      this.button = newEl("button", null, "playBtn");
      this.remaining = limit;
      this.remDisplay = newEl("p", null, "remaining");
      this.init();
    }
    init() {
      // display
      this.remDisplay.textContent = this.remaining + " remaining plays";
  
      // audio element
      this.audio.src = this.file;
      this.audio.ontimeupdate = () => {
        console.log("progress: " + this.progress);
        this.progressBar.style.backgroundImage = `conic-gradient(var(--light-secondary) ${this.progress}%, var(--primary) ${this.progress}% 100%)`;
      };
      this.audio.onplay = () => {
        this.remDisplay.textContent = `${--this.remaining} remaining plays`;
        if (this.remaining === 0) {
          this.button.setAttribute("disabled", true);
        }
      };
      this.audio.onended = () => {
        this.progressBar.style.backgroundImage = `conic-gradient(var(--light-secondary) 0%, var(--primary) 0% 100%)`;
        
      };
  
      // play button
  
      this.button.innerHTML = '<i class="fa-solid fa-play"></i>';
      this.button.type = "button";
      this.button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log("clicked");
        document.querySelectorAll("audio").forEach(a => {
          if (a.currentTime != 0) {
            a.pause();
            a.currentTime = 0;
          }
        })
        this.audio.play();
      });
      this.progressBar.appendChild(this.button);
      this.player.appendChild(this.progressBar);
      this.player.appendChild(this.remDisplay);
    }
    get progress() {
      return (this.audio.currentTime / this.audio.duration) * 100;
    }
  }

  export default LimitedPlayer;