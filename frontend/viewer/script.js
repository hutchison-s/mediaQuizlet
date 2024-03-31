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
  const encoding = btoa(`${encodeURIComponent(quizId)}:${encodeURIComponent(passwordInput.value)}`);
  fetch(apiURL+`/quiz/${quizId}/admin`, {
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
      const [change, reset] = adminOptions(quizObject, quizId)
      optBox.append(change);
      optBox.append(reset);
      showResponses(quizObject)
      auth = passwordInput.value;
    })
    .catch((err) => {
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
  fetch(apiURL+`/quiz/${quizId}/admin`, {
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
      const [change, reset] = adminOptions(quiz, id)
      optBox.append(change);
      optBox.append(reset);
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
  fetch(apiURL+`/quiz/${quizId}/admin/reset`, {
    method: "PATCH",
    headers: {
        "Authorization": 'Basic ' + encoding,
        "Content-Type": "application/json"
    }
  }).then(res => res.json())
    .then(quiz => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get("id")
      console.log(id+" responses reset");
      elid("resBox").remove()
      optBox.innerHTML = "";
      const [change, reset] = adminOptions(quiz, id)
      optBox.append(change);
      optBox.append(reset);
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
  return [changeBtn, resetBtn];
}

function showResponses(quiz) {
  const box = newEl("div", "resBox", "softCorner")
  box.classList.add("shadow")
  if (quiz.responses.length == 0) {
    box.innerHTML = "<h2 class='status'>No Responses Yet</h2>";
    root.appendChild(box);
    introDialog.close()
    return;
  }
  let totalPoints = quiz.questions.reduce((acc, q)=>acc+parseInt(q.pointValue), 0)
  for (const [idx, res] of quiz.responses.entries()) {
    const resBox = newEl("div", null, "response")
    resBox.innerHTML += `
      <div>
        <h2>${res.user} <span class="score">(<span class="numCorrect"></span>/${totalPoints})</span><button class="updateGrade">Update</button></h2>
        <p><small>${res.timestamp}</small></p>
      </div>
    `
    for (let i=0; i<res.responses.length; i++) {
      const answer = res.responses[i].answer;
      const score = res.responses[i].score;
      const quest = quiz.questions[i];
      resBox.innerHTML += `<p>Question ${i+1}: ${quest.title}</p>`
      switch (quest.type) {
        case "multipleChoice":
          resBox.innerHTML += `
          <label><input type="number" min="0" max="${quest.pointValue}" value=${score}> out of ${quest.pointValue} points earned</label>
            <p>\tAnswered: ${answer}
              <i class="fa-solid ${score == quest.pointValue ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            </p>`;
          break;
        case "shortAnswer":
          resBox.innerHTML += `
          <label><input type="number" min="0" max="${quest.pointValue}" value=${score}> out of ${quest.pointValue} points earned</label>
            <p>\tAnswered: ${answer}
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
    resBox.querySelector(".updateGrade").addEventListener("click", ()=>{
      const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let code = urlParams.get("id");
        const encoding = btoa(`${encodeURIComponent(code)}:${encodeURIComponent(auth)}`);
        fetch(apiURL+`/quiz/${code}/admin`, {
          method: "PATCH",
          headers: {
              "Authorization": 'Basic ' + encoding,
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
            resIndex: idx,
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

