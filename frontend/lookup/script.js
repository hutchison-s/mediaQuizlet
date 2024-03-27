import {changeMode, setInitialStyle} from "../modules/darkmode.js";
import { elid } from "../modules/domFuncs.js";
import {apiURL} from '../urls.js';

setInitialStyle();

const darkToggle = elid("lightDark")
const codeForm = elid("codeForm");
const codeInput = elid("codeInput")
codeForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    let code = codeInput.value;
    navigateToQuiz(code);
})

function navigateToQuiz(code) {
    fetch(apiURL+"/quiz/" + code)
        .then((response) => {
            try {
                if (!response.ok) {
                    throw new Error("No such code")
                }
                console.log("redrecting to quiz.")
                window.location.href = "https://audioquizlet.netlify.app/quizzer?id="+code
            } catch (err) {
                codeInput.style.outline = "4px solid var(--warning)"
                codeInput.value = "invalid code"
                setTimeout(()=>{
                    codeInput.value = ""
                    codeInput.style.outline = "none"
                }, 2000)
            }
            
        })
        .catch((err) => {
            console.log(err);
        });
}

darkToggle.addEventListener("click", changeMode);