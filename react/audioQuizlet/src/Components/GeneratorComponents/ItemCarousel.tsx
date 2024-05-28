import { useEffect, useRef, useState } from "react";
import QuestionItem from "./QuestionItem";
import NewQuestionButton from "./NewQuestionButton";
import { useGenerator } from "../../genContext";
import { GenQuestion, GenResponseType } from "../../types-new";

export default function ItemCarousel() {
    const {state, dispatch} = useGenerator();
    const [w, setW] = useState(window.innerWidth <= 900 ? 100 : 75);

    const prev = ()=>{
        dispatch({type: 'SET_ACTIVE', payload: state.active - 1})
    }
    const next = ()=>{
        dispatch({type: 'SET_ACTIVE', payload: state.active + 1})
    }
    const addNewQuestion = (t: GenResponseType) => {
        const newQuestion: GenQuestion = {
            id: Date.now(),
            pointValue: 1,
            prompts: [],
            response: {
                type: t,
                correct: ''
            }
        }
        dispatch({type: 'ADD_QUESTION', payload: newQuestion})
    }

    const carRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        const resizeEffect = () => {
            if (window.innerWidth <= 900) {
                setW(100);
            } else {
                setW(75)
            }
        }
        window.addEventListener("resize", resizeEffect)
        return ()=>{
            window.removeEventListener("resize", resizeEffect)
        }
    }, [])

    useEffect(()=>{
        if (carRef.current) {
            const divy = 100 / state.questions.length;
            carRef.current.style.transform = `translateX(-${state.active * divy}%)`
        }
    }, [state.questions, state.active])

    

    return (
        <>
        <NewQuestionButton onClick={addNewQuestion}/>
        {state.questions
            ?   <>
                    <button id="leftForm" disabled={state.active == 0 || state.questions.length == 0} onClick={prev}>
                        <i className="fa-solid fa-angles-left"></i>
                    </button>
                    <button id="rightForm" disabled={state.active == state.questions.length-1 || state.questions.length == 0} onClick={next}>
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                    <div id="formWheel">
                        <div id="formCar" ref={carRef} style={{width: `${state.questions.length * w}vw`}}>
                            {state.questions.map((question, idx) => <QuestionItem key={question.id} index={idx} question={question} />)}
                        </div>
                    </div>
                </>
            :   <div id="introText">
                    <p className="hiddenWhenMobile">Drag and drop files to the sidebar or get started by clicking the "+" button to add a new question!</p>
                    <p className="hiddenWhenDesktop">Get started by clicking the "+" button to add a new question!</p>
                </div>}
        </>
    )
}