// DOM Utilities
import {changeMode, setInitialStyle} from "../modules/darkmode.js";
import { elall, elid, elsel, newEl } from "../modules/domFuncs.js";
import MCQuestion from "../modules/MCQuestion.js";
import ShortAnswerQuestion from "../modules/SAQuestion.js";
import PicQuestion from "../modules/PicQuestion.js";
import {apiURL} from '../urls.js';

setInitialStyle();

// DOM element selectors
const dropFrame = elid("dropFrame");
const sidebar = elid("sidebar");
const root = elid("root");
const upload = elid("upload");
const formCar = elid("formCar");
const rightForm = elid("rightForm");
const leftForm = elid("leftForm");
const qList = elid("qList");
const launchSubmission = elid("launchSubmission");
const submissionForm = elid("submissionForm");
const submissionTool = elid("submissionTool");
const cancelSubmission = elid("cancelSubmission");
const passwordInput = elid("password");
const restartBtn = elid("restart")
const darkToggle = elid("lightDark")
const peek = elid("peek");
const timeLimit = elid("timeLimit");
const timeToggle = elid("timeToggle");
const qPrompts = elid("qPrompts");
const optHistory = elid("optHistory");
const spinner = elid("spinner")

// State Variables

// Variable to track active question
let activeQ = 0;
// Array to store question objects
const questions = [];

// HTML Injection Functions

// Function to generate question list item
const generateQListItem = (title) => {
  const item = newEl("div", "", "softCorner");
  item.innerHTML = `
      <div class="checkComplete"></div>
      <div class="qTitle">${title}</div>`;
  item.classList.add("qListItem");
  let idx = qList.children.length;
  item.addEventListener("click", () => {
    activeQ = idx;
    setActive(activeQ);
  });
  qList.appendChild(item);
};

const changeQType = (e) => {
  const box = elall(".qFormBox")[activeQ];
  const oldQ = questions[activeQ];
  const file = oldQ.file;
  let newQuestion;
  let newForm;
  switch (e.target.value) {
    case "mc":
      newQuestion = new MCQuestion(file, qPrompts, optHistory);
      newForm = generateMCForm(newQuestion);
      break;
    case "sa":
      newQuestion = new ShortAnswerQuestion(file, qPrompts);
      newForm = generateSAForm(newQuestion);
      break;
    default:
      newQuestion = new PicQuestion(file, qPrompts);
      newForm = generatePicForm(newQuestion);
  }
  box.innerHTML = "";
  questions[activeQ] = newQuestion;
  box.append(newForm)
}

// Change Question Type
const qTypeSelect = (file)=>{
  const sel = newEl("select", null, "softCorner");
  sel.classList.add("qTypeSelect")
  sel.innerHTML = "<option value='mc'>Multiple Choice</option><option value='sa'>Short Answer</option><option value='pic'>Photo Upload</option>"
  sel.onchange = changeQType;
  return sel;
}

const generatePicForm = (quest) => {
  const form = newEl("form", null, "qForm");
  form.classList.add("shadow");
  form.classList.add("softCorner");
  form.innerHTML = `
      <audio controls src="${URL.createObjectURL(quest.file)}"></audio>
      <p class="fileName">${quest.file.name}</p>
      <input type="text" list="qPrompts" placeholder="Instructions..." name="title" class="title" required>
      <label for="limit">Listen Limit: <input required type="number" min="1" max="100" value="3" name="limit"></label>
      <button type="submit" class="softCorner">Submit</button>`;
  const select = qTypeSelect(quest.file);
  select.value = 'pic'
  form.querySelector("p").insertAdjacentElement("afterend", select);
  form.onsubmit = (e) => qSubmit(e, quest, form);
  return form;
}

// Function to generate short answer form
const generateSAForm = (quest) => {
  const form = newEl("form", null, "qForm");
  form.classList.add("shadow");
  form.classList.add("softCorner");
  form.innerHTML = `
      <audio controls src="${URL.createObjectURL(quest.file)}"></audio>
      <p class="fileName">${quest.file.name}</p>
      <input type="text" list="qPrompts" placeholder="Title or Question..." name="title" class="title" required>
      <input required type="text" placeholder="Correct Answer..." name="correct" class="title">
      <label for="limit">Listen Limit: <input required type="number" min="1" max="100" value="3" name="limit"></label>
      <button type="submit" class="softCorner">Submit</button>`;
  const select = qTypeSelect(quest.file);
  select.value = 'sa'
  form.querySelector("p").insertAdjacentElement("afterend", select);
  form.onsubmit = (e) => qSubmit(e, quest, form);
  return form;
};


// Function to generate multiple choice form
const generateMCForm = (quest) => {
  const {file} = quest
  const form = newEl("form", null, "qForm");
  form.classList.add("shadow");
  form.classList.add("softCorner");
  form.innerHTML = `
      <audio controls src="${URL.createObjectURL(file)}"></audio>
      <p class="fileName">${file.name}</p>
      <input type="text" list="qPrompts" placeholder="Title or Question..." name="title" class="title" required>
      <input required type="text" list="optHistory" placeholder="Option A..." name="optA" class="option"><input value=0 type="radio" name="correct" checked>
      <input required type="text" list="optHistory" placeholder="Option B..." name="optB" class="option"><input value=1 type="radio" name="correct">
      <input required type="text" list="optHistory" placeholder="Option C..." name="optC" class="option"><input value=2 type="radio" name="correct">
      <input required type="text" list="optHistory" placeholder="Option D..." name="optD" class="option"><input value=3 type="radio" name="correct">
      <label for="limit">Listen Limit: <input required type="number" min="1" max="100" value="3" name="limit"></label>
      <button type="submit" class="softCorner">Submit</button>`;
  const select = qTypeSelect(quest.file);
  select.value = 'mc'
  form.querySelector("p").insertAdjacentElement("afterend", select);
  form.onsubmit = (e) => qSubmit(e, quest, form);
  return form;
};

// Function to generate submitted message
const generateSubmitted = () => {
  let response = `<div class="qForm shadow softCorner">
  <h3>Successfully Submitted!</h3>
  <i class="edit fa-solid fa-pencil"></i>
  <i class="success fa-solid fa-circle-check"></i>
  </div>`;
  return response;
};

// Function to check if all questions are complete and show launch submission button
const checkAllQuestions = () => {
  if (questions.every((x) => x.isComplete)) {
    launchSubmission.style.display = "grid";
  } else {
    launchSubmission.style.display = "none";
  }
};

// Functions

// Function to edit active question
const editActive = () => {
  const quest = questions[activeQ];
  quest.isComplete = false;
  markIncomplete(activeQ);
  const box = formCar.children[activeQ];
  let form;
  switch (quest.type) {
    case "mc":
      form = generateMCForm(quest);
      form.title.value = quest.title;
      form.limit.value = quest.limit;
      form.optA.value = quest.options[0];
      form.optB.value = quest.options[1];
      form.optC.value = quest.options[2];
      form.optD.value = quest.options[3];
      form.querySelectorAll("input[type='radio']")[quest.correct].checked = true;
      break;
    case "sa":
      form = generateSAForm(quest);
      form.title.value = quest.title;
      form.limit.value = quest.limit;
      form.correct.value = quest.correct;
      break;
    default:
      form = generatePicForm(quest);
      form.title.value = quest.title;
      form.limit.value = quest.limit;
  }
  box.innerHTML = "";
  box.appendChild(form);
};

// Function to handle question submission
const qSubmit = (e, quest, form) => {
  e.preventDefault();
  const data = new FormData(form);
  quest.formResponse(data);
  markComplete(activeQ);
  const box = elall(".qFormBox")[activeQ];
  box.innerHTML = generateSubmitted(quest.getData());
  box.querySelector(".edit").addEventListener("click", () => {
    editActive();
    checkAllQuestions();
  });
  checkAllQuestions();
  if (activeQ < questions.length - 1) {
    setActive(++activeQ);
  }
};

// Function to handle uploaded files
const handleFiles = (files) => {
  if (files.length > 12) {
    upload.value = "";
      alert("Limit of 12 files per quiz.")
      resetPage();
      return;
  }
  for (const f of files) {
    if (f.size / 1048576 > 4) {
      upload.value = "";
      alert("One or more files are too large. Max size allowed is 4 MB")
      resetPage();
      return;
    }
  }
  
  for (const f of files) {
    generateQListItem(f.name);
    const quest = new MCQuestion(f, qPrompts, optHistory);
    questions.push(quest);
    const box = newEl("article", null, "qFormBox");
    const form = generateMCForm(quest);
    box.append(form);
    formCar.append(box);
  }
  introText.classList.add("hidden");
  upload.parentNode.style.display = "none";
  setActive(0);
  formCar.style.width =
    formCar.children.length * formCar.parentNode.clientWidth + "px";
  if (files.length > 1) {
    rightForm.removeAttribute("disabled");
  }
};

// Function to mark question as complete
const markComplete = (idx) => {
  const item = qList.children[idx];
  item.querySelector(
    ".checkComplete"
  ).innerHTML = `<i class="fa-solid fa-check"></i>`;
  item.querySelector(".checkComplete").style.background = "var(--success)";
};

// Function to mark question as incomplete
const markIncomplete = (idx) => {
  const item = qList.children[idx];
  item.querySelector(".checkComplete").innerHTML = "";
  item.querySelector(".checkComplete").style.background = "var(--primary)";
};

const onSubmitQuiz = (e) => {
  e.preventDefault();
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear()+1);
  spinner.classList.remove("hidden")
  submissionTool.close();
  const data = new FormData();
  for (const q of questions) {
    data.append("files", q.file);
  }
  data.append("questions", JSON.stringify(questions));
  data.append("password", passwordInput.value);
  let tlimit = timeLimit.value == "" ? null : timeLimit.value;
  data.append("timeLimit", tlimit);
  data.append("expires", nextYear.toISOString())
  data.append("status", "open");

  fetch(apiURL+"/upload", {
    method: "POST",
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      spinner.classList.add("hidden")
      launchSubmission.style.display = "none";
      questions.length = 0;
      formCar.innerHTML = "";
      qList.innerHTML = "";
      activeQ = 0;
      root.innerHTML = ""
      restartBtn.style.display = "none";
      root.append(success(data.url));
      elid("copyLink").addEventListener("click", (e)=>{
        navigator.clipboard.writeText(data.url)
      })
      elid("copyCode").addEventListener("click", (e)=>{
        navigator.clipboard.writeText(data.url.substring(data.url.length-20))
      })
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function success(url) {
  const box = newEl("div", "successBox", "softCorner");
  box.classList.add("shadow")
  box.innerHTML = `
      <div class="successWrap">
        <h2>Quizlet Successfully Created</h2>
        <p>Link to Quizlet:</p>
        <div><a id="successLink" href="${url}">${url}</a><button id="copyLink"><i class="fa-solid fa-copy"></i></button></div>
        <p>Quizlet Code:</p>
        <div><p id="successCode">${url.substring(url.length-20)}</p><button id="copyCode"><i class="fa-solid fa-copy"></i></button></div>
        <button id="createAnother" onclick="window.location.reload()" class="softCorner primaryBtn">Create another Quizlet</button></div>`
  return box
}

// Carousel

// Function to set active question and update carousel position
const setActive = (idx) => {
  for (let i = 0; i < qList.children.length; i++) {
    const q = qList.children[i];
    if (i == idx) {
      q.classList.add("active");
    } else {
      q.classList.remove("active");
    }
  }
  formCar.style.transform = `translateX(${
    -idx * formCar.parentNode.clientWidth
  }px)`;
  updateArrows();
};

function handleRightClick() {
  setActive(++activeQ);
}

function handleLeftClick() {
  setActive(--activeQ);
}

// Function to update navigation arrows based on active question
const updateArrows = () => {
  if (activeQ <= 0) {
    leftForm.setAttribute("disabled", true);
  } else {
    leftForm.removeAttribute("disabled");
  }
  if (activeQ >= qList.children.length - 1) {
    rightForm.setAttribute("disabled", true);
  } else {
    rightForm.removeAttribute("disabled");
  }
};

const resetPage = () => {
  questions.length = 0;
  formCar.innerHTML = "";
  qList.innerHTML = "";
  activeQ = 0;
  upload.parentNode.style.display = "block";
  upload.value = null;
  introText.classList.remove("hidden");
  launchSubmission.style.display = "none";
  leftForm.setAttribute("disabled", true);
  rightForm.setAttribute("disabled", true);
}

// Event Listeners

// Event listener for dragover on sidebar
sidebar.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropFrame.classList.remove("hidden");
});
// Event listener for dragleave on dropFrame
dropFrame.addEventListener("dragleave", (e) => {
  e.preventDefault();
  dropFrame.classList.add("hidden");
});
// Event listener for drop on dropFrame
dropFrame.addEventListener("drop", (e) => {
  e.preventDefault();
  dropFrame.classList.add("hidden");
  handleFiles(e.dataTransfer.files);
});
// Event listener for change on upload input
upload.addEventListener("change", (e) => {
  handleFiles(upload.files);
});
// Event listener for click on launchSubmission button
launchSubmission.addEventListener("click", () => {
  submissionTool.showModal();
});
// Event listener for click on cancelSubmission button
cancelSubmission.addEventListener("click", () => {
  submissionTool.close();
  submissionForm.reset();
});
// Event listener for pointerdown on peek button
peek.addEventListener("pointerdown", () => {
  passwordInput.type = "text";
});
// Event listener for pointerup on peek button
peek.addEventListener("pointerup", () => {
  passwordInput.type = "password";
});
// Event listener for click on restart button
restartBtn.addEventListener("click", resetPage);
// Event listener for click on rightForm button
rightForm.addEventListener("click", handleRightClick);
// Event listener for click on leftForm button
leftForm.addEventListener("click", handleLeftClick);
// Event listener for window resize
window.addEventListener("resize", () => {
  formCar.style.width =
    formCar.children.length * formCar.parentNode.clientWidth + "px";
  formCar.style.transform = `translateX(${
    -activeQ * formCar.parentNode.clientWidth
  }px)`;
});
// Event listener for click on darkToggle button
darkToggle.addEventListener("click", changeMode);
// Event listener for click on timeToggle button
timeToggle.addEventListener("click", () => {
  if (timeLimit.hasAttribute("hidden")) {
    timeLimit.removeAttribute("hidden");
    timeToggle.classList.add("toggled");
  } else {
    timeLimit.value = null;
    timeLimit.setAttribute("hidden", true);
    timeToggle.classList.remove("toggled");
  }
});
// Event listener for invalid input on passwordInput
passwordInput.addEventListener("invalid", function (event) {
  event.target.setCustomValidity(
    "Password must be 4-16 characters. May only use letters, numbers, and special characters !@#%^&*"
  );
});

// Event listener for change on passwordInput
passwordInput.addEventListener("change", function (event) {
  event.target.setCustomValidity("");
});

passwordInput.addEventListener("input", ()=>{
  if (passwordInput.value.length < 4) {
    elsel("#submissionTool button[type='submit']").setAttribute("disabled", true)
  } else {
    elsel("#submissionTool button[type='submit']").removeAttribute("disabled");

  }
})

// Event listener for form submission on submissionForm
submissionForm.addEventListener("submit", onSubmitQuiz);
