import SideBar from '../Components/GeneratorComponents/Sidebar';
import './Generator.css';
import ItemCarousel from '../Components/GeneratorComponents/ItemCarousel';
import LightModeControl from '../Components/lightDark';
import { useGenerator } from '../Context/genContext';
import { processQuestions, submitToServer } from '../Functions/apiCalls/quizzes';
import SubmissionDialog from '../Components/GeneratorComponents/SubmissionDialog';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loader from '../Components/Loader';

export default function Generator() {

    const {state, dispatch} = useGenerator();
    const [isFinished, setIsFinished] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
   
    const generate = async ()=>{
        if (checkRequiredInputs()) {
            setIsFinished(true)
        }
    }

    const generateButton = <button id="generateLink" className="primaryBtn softCorner shadow" onClick={generate}>Generate Quizlet Link</button>

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
                dispatch({type: 'SET_ACTIVE', payload: i})
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

    const submitQuiz = async () => {
        setIsFinished(false)
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear()+1);
        setIsSubmitting(true)
        console.log(state.questions[0].prompts[0]);
        
        const {updatedQuestions, associatedFiles} = await processQuestions(state);
        console.log(updatedQuestions[0].prompts[0]);
        
        const newQuiz = {
            questions: updatedQuestions,
            associatedFiles: associatedFiles,
            password: state.password,
            admin: state.admin,
            title: state.title,
            description: state.description || '',
            timeLimit: state.timeLimit ? state.timeLimit : null,
            expires: nextYear.toISOString(),
            status: "open"
        }
        const quizId = await submitToServer(newQuiz)
        console.log("navigating to "+`/success/${quizId}`);
        setIsSubmitting(false)
        navigate(`/success/${quizId}`)
    }

    return (
        <>
            <main id="generatorBody">
                <LightModeControl />
                    <SideBar generateButton={generateButton}/>
                    <section id="genWindow">
                        <ItemCarousel />
                    </section>
                    {isFinished && <SubmissionDialog setRender={setIsFinished} closeForm={()=>{setIsFinished(false)}} submitQuiz={submitQuiz}/>}
                    {isSubmitting && <Loader />}
            </main>
            
        </>
        
    )
}