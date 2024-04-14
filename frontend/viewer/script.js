// DOM Utilities

import { elid, newEl } from "../modules/domFuncs.js";
import {changeMode, setInitialStyle} from "../modules/darkmode.js";
import {apiURL} from '../urls.js';

setInitialStyle();

const root = elid("root");
const peek = elid("peek");
const viewRes = elid("viewResponses");
const passwordInput = elid("password");
const lightDark = elid("lightDark");
const introDialog = elid("introDialog");
const optBox = elid("optBox");

let auth = null;


function apiCall(quizId) {
  elid("spinner").classList.toggle("hidden")
  const encoding = btoa(`${encodeURIComponent(quizId)}:${encodeURIComponent(passwordInput.value)}`);
  fetch(apiURL+`quizzes/${quizId}/admin`, {
    headers: {
        Authorization: 'Basic ' + encoding
    }
  })
    .then(data => {
      if (data.ok) {
        return data.json()
      } else {
        throw new Error("Not authorized");
      }
      
    })
    .then((quizObject) => {
      const [change, reset, del] = adminOptions(quizObject, quizId)
      optBox.append(change);
      optBox.append(reset);
      optBox.append(del)
      auth = passwordInput.value;
      showResponses(quizObject)
      
      elid("spinner").classList.toggle("hidden")
    })
    .catch((err) => {
      elid("spinner").classList.add("hidden")
      console.log(err);
      if (err.message == "Not authorized") {
          passwordInput.style.outline = "4px solid var(--warning)"
          passwordInput.value = "incorrect password"
          passwordInput.type = "text"
          setTimeout(()=>{
              passwordInput.value = ""
              passwordInput.type = "password"
              passwordInput.style.outline = "none"
          }, 2000)
      } else {
        root.innerHTML = "<h2 class='status'>Server Error. Please refresh and try again.</h2>";
      }
      
    });
}

function changeStatus(quizId, newStatus) {
  const encoding = btoa(`${encodeURIComponent(quizId)}:${encodeURIComponent(auth)}`);
  fetch(apiURL+`quizzes/${quizId}/admin`, {
    method: "PATCH",
    headers: {
        "Authorization": 'Basic ' + encoding,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({status: newStatus})
  }).then(res => res.json())
    .then(quiz => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get("id")
      console.log(id+" status set to "+quiz.status);
      optBox.innerHTML = "";
      const [change, reset, del] = adminOptions(quiz, id)
      optBox.append(change);
      optBox.append(reset);
      optBox.append(del);
    })
    .catch(err => {
      console.log(err)
    })
}

function eraseResponses(quizId) {
  const goOn = confirm("Clicking ok will erase all responses and reset the quiz. Responses cannot be recovered. Do you wish to continue?")
  if (!goOn) {
    return;
  }
  const encoding = btoa(`${encodeURIComponent(quizId)}:${encodeURIComponent(auth)}`);
  fetch(apiURL+`quizzes/${quizId}/admin`, {
    method: "PATCH",
    headers: {
        "Authorization": 'Basic ' + encoding,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({reset: true})
  }).then(res => res.json())
    .then(quiz => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get("id")
      console.log(id+" responses reset");
      elid("resBox").remove()
      optBox.innerHTML = "";
      const [change, reset, del] = adminOptions(quiz, id)
      optBox.append(change);
      optBox.append(reset);
      optBox.append(del);
      showResponses(quiz)
    })
    .catch(err => {
      console.log(err)
    })
}

function adminOptions(quiz, id) {
  let isOpen = quiz.status == "open";
  const changeBtn = newEl("button", "changeStatus", "primaryBtn");
  changeBtn.classList.add("softCorner");
  let newStatus = isOpen ? "closed" : "open";
  changeBtn.addEventListener("click", ()=>{
    changeStatus(id, newStatus);
  })
  changeBtn.textContent = isOpen ? "Close Quiz" : "Re-Open Quiz";
  const resetBtn = newEl("button", "resetQuiz", "secondaryBtn");
  resetBtn.classList.add("softCorner")
  resetBtn.textContent = "Reset Quiz";
  resetBtn.addEventListener("click", ()=>{
    eraseResponses(id);
  })
  const deleteBtn = newEl("button", "deleteQuiz", "warningButton");
  deleteBtn.classList.add("softCorner");
  deleteBtn.textContent = "Delete Quiz";
  deleteBtn.addEventListener("click", ()=>{
    deleteQuiz(id);
  })
  return [changeBtn, resetBtn, deleteBtn];
}

function deleteQuiz(code) {
  const encoding = btoa(`${encodeURIComponent(code)}:${encodeURIComponent(auth)}`);
  fetch(apiURL+`quizzes/${code}/admin`, {
    method: "DELETE",
    headers: {
        "Authorization": 'Basic ' + encoding
    }
  }).then(res => {
    if (res.ok) {
      window.location.href = "https://audioquizlet.netlify.app"
    }
  }).catch(err => {
    console.log(err)
  })
}

function deleteResponse(e, quizId, responseId) {
  const encoding = btoa(`${encodeURIComponent(quizId)}:${encodeURIComponent(auth)}`);
  fetch(apiURL+`quizzes/${quizId}/responses/${responseId}`, {
    method: "DELETE",
    headers: {
      "Authorization": "Basic "+encoding
    }
  }).then(res => {
    if (res.ok) {
      let target = e.target.parentNode;
      while (!target.classList.contains("response")) {
        target = target.parentNode;
      }
      target.remove();
      if (elid("resBox").children.length == 0) {
        elid("resBox").innerHTML = "<h2 class='status'>No Responses Yet</h2>"
      }
    }
  })
}

async function showResponses(quiz) {
  const encoding = btoa(`${encodeURIComponent(quiz.quizId)}:${encodeURIComponent(auth)}`);
  const box = newEl("div", "resBox", "softCorner")
  box.classList.add("shadow")
  if (quiz.responses.length == 0) {
    box.innerHTML = "<h2 class='status'>No Responses Yet</h2>";
    root.appendChild(box);
    introDialog.close()
    return;
  }
  let totalPoints = quiz.questions.reduce((acc, q)=>acc+parseInt(q.pointValue), 0)
  const responses = await fetch(apiURL+`quizzes/${quiz.quizId}/responses`, {method: "GET", headers: {"Authorization": "Basic "+encoding}}).then(data => data.json());
  for (const res of responses) {
    const resBox = newEl("div", null, "response")
    let timestamp = new Date(res.timeSubmitted);
    let duration = (res.timeSubmitted - res.timeStarted) / 1000;
    resBox.innerHTML += `
      <div>
        <h2>
          ${res.user} 
          <span class="score">(<span class="numCorrect"></span>/${totalPoints})</span>
          <button class="updateGrade">Update</button>
          <button class="deleteResponse"><i class="fa-solid fa-trash"></i></button>
        </h2>
        <p><small>${timestamp.toLocaleTimeString()}</small></p>
        <p><small>Completed in ${Math.floor(duration / 60)} minutes and ${duration % 60} seconds</small></p>
      </div>
    `
    for (let i=0; i<res.answers.length; i++) {
      const answer = res.answers[i].answer;
      const score = res.answers[i].score;
      const quest = quiz.questions[i];
      resBox.innerHTML += `<p>Question ${i+1}: ${quest.title}</p>`
      switch (quest.type) {
        case "multipleChoice":
          resBox.innerHTML += `
          <label><input type="number" min="0" max="${quest.pointValue}" value=${score}> out of ${quest.pointValue} points earned</label>
            <p>\tAnswered: ${answer} ${score != quest.pointValue ? "<span class='correctAnswer'>Correct answer is "+quest.options[quest.correct]+"</span>" : ""}
              <i class="fa-solid ${score == quest.pointValue ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            </p>`;
          break;
        case "shortAnswer":
          resBox.innerHTML += `
          <label><input type="number" min="0" max="${quest.pointValue}" value=${score}> out of ${quest.pointValue} points earned</label>
            <p>\tAnswered: ${answer} ${score != quest.pointValue ? "<span class='correctAnswer'>Correct answer is "+quest.correct+"</span>" : ""}
              <i class="fa-solid ${score == quest.pointValue ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            </p>
            `;
          break;
        default:
          resBox.innerHTML += `
          <label><input type="number" min="0" max="${quest.pointValue}" value=${score}> out of ${quest.pointValue} points earned</label>
          <img src=${answer} alt="${res.user} uploaded photo" width="100%">`
      }
        
    }
    
    resBox.querySelector(".deleteResponse").addEventListener("click", (e)=>{
        deleteResponse(e, res.quizId, res.responseId)
    })
    resBox.querySelector(".updateGrade").addEventListener("click", ()=>{
        
        fetch(apiURL+`quizzes/${quiz.quizId}/responses/${res.responseId}`, {
          method: "PATCH",
          headers: {
              "Authorization": 'Basic ' + encoding,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            scores: Array.from(resBox.querySelectorAll("input[type='number']")).map(n => n.value)
          })
        }).then(res => {
          console.log(res)
          calculateGrade(resBox)
          resBox.querySelector(".updateGrade").style.display = "none"
        }).catch(err => {
          console.log(err)
        })
    })
    for (const input of resBox.querySelectorAll("input[type='number']")) {
      input.addEventListener("input", ()=>{
        calculateGrade(resBox);
        resBox.querySelector(".updateGrade").style.display = "inline-block"
      })
      box.appendChild(resBox)
      calculateGrade(resBox);
    }
    root.appendChild(box);
    introDialog.close()
  }
}

function calculateGrade(resBox) {
  const pointsEarned = Array.from(resBox.querySelectorAll("input[type='number']")).reduce((acc, num) => acc + parseInt(num.value), 0)
  resBox.querySelector(".numCorrect").textContent = pointsEarned;
}

function handleSendPassword() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("id")) {
    console.log("retrieving quiz " + urlParams.get("id"));
    apiCall(urlParams.get("id"));
  } else {
    root.innerHTML = "<h2 class='status'>Invalid Quiz ID</h2>";
  }
}

window.addEventListener("load", () => {
  introDialog.showModal();
});

lightDark.addEventListener("click", changeMode);

peek.addEventListener("pointerdown", () => {
    passwordInput.type = "text";
});
peek.addEventListener("pointerup", () => {
    passwordInput.type = "password";
});

passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length < 3) {
    viewRes.setAttribute("disabled", true);
  } else {
    viewRes.removeAttribute("disabled");
  }
});
passwordInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    handleSendPassword();
  }
})
viewRes.addEventListener("click", handleSendPassword);

