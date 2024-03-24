// DOM Utilities

import { elid, newEl } from "../modules/domFuncs.js";
import {changeMode, setInitialStyle} from "../modules/darkmode.js";

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
  fetch(`https://audio-quizlet.vercel.app/quiz/${quizId}/admin`, {
    headers: {
        Authorization: 'Basic ' + encoding
    }
  })
    .then(data => data.json())
    .then((quizObject) => {
      optBox.append(statusOptions(quizObject))
      showResponses(quizObject)
      auth = passwordInput.value;
    })
    .catch((err) => {
      console.log(err);
      if (err.status == 401) {
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
  fetch(`http://localhost:8000/quiz/${quizId}/admin`, {
    method: "PATCH",
    headers: {
        Authorization: 'Basic ' + encoding
    },
    body: JSON.stringify({status: newStatus})
  }).then(res => res.json())
    .then(quiz => {
      console.log(quiz.id+" status set to "+quiz.status);
      optBox.innerHTML = "";
      optBox.append(statusOptions(quiz))
    })
    .catch(err => {
      console.log(err)
    })
}

function statusOptions(quiz) {
  let isOpen = quiz.status == "open";
  const changeBtn = newEl("button", "changeStatus", "buttonPrimary");
  changeBtn.addEventListener("click", ()=>{
    changeStatus(quiz.id, isOpen ? "closed" : "open");
  })
  changeBtn.textContent = isOpen ? "Close Quiz" : "Re-Open Quiz";
  return changeBtn;
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
  for (const res of quiz.responses) {
    const resBox = newEl("div", null, "response")
    resBox.innerHTML += `
      <div>
        <h2>${res.user} <span class="score">(<span class="numCorrect"></span>/${quiz.questions.length})</span></h2>
        <p><small>${res.timestamp}</small></p>
      </div>
    `
    for (let i=0; i<res.responses.length; i++) {
      resBox.innerHTML += `
        <p>Question ${i+1}: ${quiz.questions[i].title}</p>
        <p>\tAnswered: ${quiz.questions[i].options[res.responses[i]]}
          <i class="fa-solid ${res.responses[i] == quiz.questions[i].correct ? "fa-circle-check" : "fa-circle-xmark"}"></i>
        </p>
        `
    }
    resBox.querySelector(".numCorrect").textContent = resBox.querySelectorAll(".fa-circle-check").length
    box.appendChild(resBox)
  }
  root.appendChild(box);
  introDialog.close()
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

