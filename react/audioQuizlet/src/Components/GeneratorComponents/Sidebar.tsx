import { useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import { AudioPrompt, ImagePrompt, generatorQuestion } from "../../types";
import LogoLink from "../Logo";
// import NavMenu from "../Nav";
import ItemSummary from "./ItemSummary";
import FileUploader from "./Uploader";
import SubmissionDialog from "./SubmissionDialog";
import { chunkAndUpload } from "../../Functions/apiCalls/audio";
import { compressAndUploadImage } from "../../Functions/apiCalls/images";
import axios from "axios";

export default function SideBar() {

    const {bulkAdd, items, clearItems, setActive} = useItems();
    const [isFinished, setIsFinished] = useState(false)

    const handleFiles = (files: File[]) => {
        const newQuestions: generatorQuestion[] = [];
        files.forEach(f => {
            const q: generatorQuestion = {prompts: [], response: {type: "MC"}, pointValue: 1}
            let p;
            if (f.type.includes("audio")) {
                p = {file: f, instructions: "", type: "Audio", playLimit: 3} as AudioPrompt
            } else {
                p = {file: f, instructions: "", type: "Image"} as ImagePrompt
            }
            q.prompts.push(p)
            newQuestions.push(q);
        })
        bulkAdd(newQuestions);
        console.log("files:", files)
    }

    const generate = async ()=>{
        if (checkRequiredInputs()) {
            console.log(items)
            
            setIsFinished(true)
        }
    }

    const checkRequiredInputs = (): boolean => {

        // reset formatting
        const inputs: HTMLInputElement[] = Array.from(document.querySelectorAll("input:required"));
        inputs.forEach(i=>{
            if (i.type == 'file') {
                const parent = i.parentNode as HTMLDivElement
                parent.style.outline = "2px dotted red";
            } else {
                i.style.outline = "none";
                i.placeholder = ""
            }
        })

        // Check each item for missing required fields and focus on them if empty
        
        const frames: HTMLDivElement[] = Array.from(document.querySelectorAll(".itemFrame"));
        
        for (let i = 0; i < frames.length; i++) {
            const reqs: HTMLInputElement[] = Array.from(frames[i].querySelectorAll("input:required"))
            const empty = reqs.filter((x: HTMLInputElement) => x.value == "");
            if (empty.length != 0) {
                setActive(i)
                empty[0].focus()
                if (empty[0].type == 'file') {
                    const parent = empty[0].parentNode as HTMLDivElement
                    parent.style.outline = "2px dotted red";
                } else {
                    empty[0].style.outline = "2px dotted red";
                    empty[0].placeholder = "Required";
                }
                return false;
            }
        }
        return true;
    }

    async function processQuestions() {
        const questions = [...items];
        const associatedFiles: string[] = [];
        const updatedQuestions = await Promise.all(questions.map(async q=>{
            const {prompts, ...otherProps} = q;
            for (const prompt of prompts) {
                if (prompt.type == "Audio" && prompt.file) {
                    const {id, associated} = await chunkAndUpload(prompt.file);
                    for (const f of associated) {
                        associatedFiles.push(f)
                    }
                    prompt.filePath = id;
                } else if (prompt.type == "Image" && prompt.file) {
                    const {path, link} = await compressAndUploadImage(prompt.file);
                    associatedFiles.push(path);
                    prompt.filePath = link;
                }
            }
            
            return {prompts, ...otherProps}
        }))
    
        return [updatedQuestions, associatedFiles]
    }

    const submitQuiz = async (subData: FormData) => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear()+1);
        const pass = subData.get("password");
        const email = subData.get("email");
        const limit = subData.get("timeLimit");
        const tLimit = limit == "" ? null : limit;
        const [processedQuestions, associatedFiles] = await processQuestions();
        const newQuiz = {
            questions: processedQuestions,
            associatedFiles: associatedFiles,
            password: pass,
            admin: email,
            timeLimit: tLimit,
            expires: nextYear.toISOString(),
            status: "open"
        }
        await axios.post("http://localhost:8000/api/quizzes", JSON.stringify(newQuiz), {headers: {"Content-Type": "application/json"}})
            .then(res => res.data)
            .then((doc: {URL: string, quizId: string}) => {
                const {URL, quizId} = doc;
                console.log(URL, "quiz id: "+quizId)
            })
            .catch(err => {
                console.log(err)
            })

        setIsFinished(false)
        clearItems()
    }
    return (
        <aside id="sideBar">
            <LogoLink tag={false}/>
            {/* <NavMenu /> */}
            <ItemSummary />
            {items.length > 0 && <button id="generateLink" className="primaryBtn softCorner shadow" onClick={generate}>Generate Quizlet Link</button>}
            <FileUploader handleFiles={handleFiles} />
            {isFinished && <SubmissionDialog setRender={setIsFinished} closeForm={()=>{setIsFinished(false)}} submitQuiz={submitQuiz}/>}
        </aside>
    )
}
