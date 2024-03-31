// DOM Utilities

import { elid, elall, newEl } from "../modules/domFuncs.js";
import {changeMode, setInitialStyle} from "../modules/darkmode.js";
import LimitedPlayer from '../modules/LimitedPlayer.js';
import Timer from '../modules/Timer.js';
import {apiURL} from '../urls.js';

setInitialStyle();

const root = elid("root");
const totalTime = elid("totalTime");
const beginBtn = elid("beginQuiz");
const nameInput = elid("nameInput");
const introDialog = elid("introDialog");
const numQuestions = elid("numQuestions");
const viewResponses = elid("viewResponses");
const lightDark = elid("lightDark");
const userDisplay = elid("currentUser");
const qList = [];
const players = [];
let quizTimer = null;
let thisQuizId = null;
let user = null;
let hasBeenWarned = false;

// Store current time remaining, checked responses, and listen limits in localStorage

function updateStorage() {
    const stateUpdate = {
        user: user,
        timeRemaining: quizTimer.remaining,
        listenLimits: players.map(p=>p.remaining),
        responses: qList.map(form=>form.answer.value)
    }
    localStorage.setItem("quizState"+thisQuizId, JSON.stringify(stateUpdate))
}

// If quizState exists in localStorage for this quiz id, restore checkmarks, listen limits, and time remaining

function restoreState(state) {
    // Restore user
    user = state.user
    userDisplay.textContent = state.user;
    // Restore timer settings
    quizTimer.remaining = state.timeRemaining;
    quizTimer.countdown();
    quizTimer.startTimer();
    // Restore listen limits & responses
    for (let i = 0; i<players.length; i++) {
        players[i].remaining = state.listenLimits[i]
        players[i].remDisplay.textContent = players[i].remaining + " remaining plays";
        if (state.listenLimits[i] <= 0) {
          players[i].button.setAttribute("disabled", true);
        }
        if (state.responses[i]) {
            qList[i].answer.value = state.responses[i]
        }
    }
}

// Retrieve all indexes of checked radio buttons and submit with username and timestamp to API

async function submitAll() {
  const qForms = elall(".questionForm");

  const formData = new FormData();
  for (const qForm of Array.from(qForms)) {
    if (qForm.answer.type == "file") {
        console.log(qForm.answer.files[0])
        formData.append("photos", qForm.answer.files[0])
      formData.append('responses', "#photoUpload#")
    } else {
      formData.append('responses', qForm.answer.value)
    }
  }
  formData.append("user", user);
  formData.append("timestamp", new Date().toTimeString())

  quizTimer && clearInterval(quizTimer?.interval);

  fetch(apiURL+`/quiz/${thisQuizId}/response`, {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      window.localStorage.removeItem("quizState" + thisQuizId);
      userDisplay.parentNode.innerHTML = ""
      root.innerHTML = `<h2 class='status'>Submitted Successfully</h2>`;
      user = null;
      quizTimer = null;
      exitFullScreen();
    })
    .catch((err) => {
      alert("Error reaching server:" + err);
    });
}

// Create instance of LimitedPlayer class and store it in players array

function createPlayer(file, limit) {
  const player = new LimitedPlayer(file, limit);
  players.push(player)
  player.audio.addEventListener("play", updateStorage)
  return player;
}

// Create player and quiz form for each question object passed in and return LimitedPlayer instance and quiz form element

function createQuestion(q) {
  const form = newEl("form", null, "questionForm");
  const player = createPlayer(q.file, q.limit);

  form.innerHTML += `<h2 class="qTitle">${q.title}</h2>`;
  form.innerHTML += `<p><small>${q.pointValue} points</small></p>`
  switch (q.type) {
    case "multipleChoice":
      form.classList.add("mc")
      for (const [value, opt] of q.options.entries()) {
        form.innerHTML += `<label>${opt}<input required type="radio" value="${value}" name="answer"
        }"></label>`;
      }
      break;
    case "shortAnswer":
      form.classList.add("sa")
      form.innerHTML += `<label><input required type="text" placeholder="Your answer..." name="answer"></label>`;
      break;
    default:
      form.classList.add("pic")
      form.innerHTML += `<label><input required type="file" accept="image/*, image/HEIC, image/heic" name="answer">Upload your photo:</label>`
  }
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  });
  
  qList.push(form);
  return [player, form]
}

// Iterate through questions and append their required elements to the provided box element

function populateQuestions(box, qList) {
  for (const q of qList) {
    const [player, form] = createQuestion(q);
    root.append(player.audio);
    box.appendChild(player.player);
    box.appendChild(form)
  }
}

// Create timer and quiz container elements and add to DOM.

function createQuiz(quiz) {
  if (quiz.status == "closed") {
    displayClosed();
    introDialog.showModal();
    return;
  }
  const container = newEl("article", "quizBox", "softCorner");
  if (quiz.timeLimit != "null") {
    quizTimer = new Timer(quiz.timeLimit, thisQuizId, submitAll);
    root.appendChild(quizTimer.display);
  }
  root.appendChild(container);
  populateQuestions(container, quiz.questions);
  const subBtn = newEl("button", "submitAll", "softCorner");
  subBtn.textContent = "Submit Quiz";
  subBtn.addEventListener("click", submitAll);
  container.appendChild(subBtn);
  const oldState = window.localStorage.getItem("quizState"+thisQuizId);
  if (oldState) {
    if (!window.sessionStorage.getItem("quizUser")) {
      root.innerHTML = "<h2 class='status'>Quiz already in session elsewhere.</h2>";
      return;
    }
      restoreState(JSON.parse(oldState));
  } else {
    gatherInfo(quiz.timeLimit, quiz.questions.length);
  }
}

function apiCall(quizId) {
  fetch(apiURL+"/quiz/" + quizId)
    .then((data) => {
      return data.json();
    })
    .then((quizObject) => {
      thisQuizId = quizId;
      if (window.localStorage.getItem("quizState"+quizId)) {
        console.log("exists")
      }
      console.log("status: "+quizObject.status)
      createQuiz(quizObject, quizId);
      elid("viewResponses").addEventListener("click", ()=>{
        window.location.href = "https://audioquizlet.netlify.app/viewer?id="+quizId
      });
    })
    .catch((err) => {
      console.log(err);
      root.innerHTML = "<h2 class='status'>Error reaching server</h2>";
    });
}

function displayClosed() {
  introDialog.innerHTML = `
  <div class="dialogContent">
        <div class="dialogLogo">
          <h2><a href="../"><i class="fa-solid fa-circle-play"></i>Audio&nbsp;Quizlet</a></h2>
        </div>
        <div class="dialogInstructions">
        
          <p>Quiz is currently closed</p>
          <p>...</p>
        <div class="buttonWrap">
          <button id="viewResponses" class="softCorner secondaryBtn">View Responses</button>
        </div>
      </div>`
}

function gatherInfo(time, questions) {
  if (time == "null") {
    totalTime.textContent = "unlimited time";
  } else {
    totalTime.textContent = time == 1 ? "1 minute" : time + " minutes";
  }
  numQuestions.textContent =
    questions == 1 ? "1 question" : questions + " questions";
  introDialog.showModal();
  nameInput.addEventListener("input", () => {
    if (nameInput.value.length < 3) {
      beginBtn.setAttribute("disabled", true);
    } else {
      beginBtn.removeAttribute("disabled");
    }
  });
  nameInput.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      beginQuiz();
    }
  });
  beginBtn.addEventListener("click", beginQuiz);
}

function beginQuiz() {
  let name = nameInput.value;
  if (name.length < 3) {
    alert("Name must be at least 3 characters long");
    return;
  }
  user = name;
  userDisplay.textContent = user;
  introDialog.close();
  requestFullScreen();
  window.sessionStorage.setItem("quizUser", user)
  quizTimer && quizTimer.startTimer();
}

window.addEventListener("load", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("id")) {
    console.log("retrieving quiz " + urlParams.get("id"));
    apiCall(urlParams.get("id"));
  } else {
    root.innerHTML = "<h2 class='status'>Invalid Quiz ID</h2>";
  }
});

window.addEventListener("beforeunload", (e)=>{
  if (user) {
    updateStorage();
  }
});
// window.addEventListener("blur", (e)=>{
//   if (user) {
//     if (!hasBeenWarned) {
//       alert("This is your only warning. Navigating away from this page will result in your quiz being submitted as-is.")
//       hasBeenWarned = true;
//     } else {
//       submitAll();
//     }
//   }
// })
lightDark.addEventListener("click", changeMode);
 
function requestFullScreen() {
  const element = document.documentElement; // Get the root element of the document (typically <html>)
if (element.requestFullscreen) {
  element.requestFullscreen(); // Request fullscreen
} else if (element.mozRequestFullScreen) { /* Firefox */
  element.mozRequestFullScreen();
} else if (element.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
  element.webkitRequestFullscreen();
} else if (element.msRequestFullscreen) { /* IE/Edge */
  element.msRequestFullscreen();
}
}

function exitFullScreen(){
  if (document.exitFullscreen) {
    document.exitFullscreen(); // Exit fullscreen mode
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}