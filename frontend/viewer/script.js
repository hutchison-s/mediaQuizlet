// DOM Utilities

import { elid, newEl } from "../modules/domFuncs.js";
import {changeMode, setInitialStyle} from "../modules/darkmode.js";

setInitialStyle();

const root = elid("root");
const peek = elid("peek");
const viewRes = elid("viewResponses");
const passwordInput = elid("password");
const lightDark = elid("lightDark");
const introDialog = elid("introDialog")


function apiCall(quizId) {
  fetch("https://audio-quizlet.vercel.app/quiz/" + quizId)
    .then((data) => {
      return data.json();
    })
    .then((quizObject) => {
      console.log("object: \n" + quizObject);
      const handleCorrect = ()=>{
        if (passwordInput.value == quizObject.password) {
            showResponses(quizObject);
        } else {
            passwordInput.style.outline = "4px solid var(--warning)"
            passwordInput.value = "incorrect password"
            passwordInput.type = "text"
            setTimeout(()=>{
                passwordInput.value = ""
                passwordInput.type = "password"
                passwordInput.style.outline = "none"
            }, 2000)
        }
      }
      passwordInput.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
          handleCorrect();
        }
      })
      viewRes.addEventListener("click", handleCorrect);
    })
    .catch((err) => {
      console.log(err);
      root.innerHTML = "<h2 class='status'>Error reaching server</h2>";
    });
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

introDialog.showModal();