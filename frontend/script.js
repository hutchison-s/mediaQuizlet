import {changeMode, setInitialStyle} from "./modules/darkmode.js";
import { elid } from "./modules/domFuncs.js";

setInitialStyle();

const darkToggle = elid("lightDark")

darkToggle.addEventListener("click", changeMode);