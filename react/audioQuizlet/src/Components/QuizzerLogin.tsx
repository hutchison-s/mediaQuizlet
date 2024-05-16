import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../Context/QuizContext";

interface QuizzerLoginProps {
    setUser: (u: string) => void,
}

export default function QuizzerLogin({setUser}: QuizzerLoginProps) {

    const [name, setName] = useState("");
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDialogElement>(null)
    const {timeLimit, questions, quizId} = useQuiz();

    useEffect(()=>{
        let modal = null;
        if (modalRef.current) {
            modal = modalRef.current;
            modalRef.current.showModal();
        }
        return ()=>{
            if (modal) {
                modal.close();
            }
        }
    }, [modalRef])

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value)
    }

    function handleBegin() {
        setUser(name);
    }

    function handleViewClick() {
        navigate(`/viewer/${quizId}`)
    }


    return (
        <dialog id="introDialog" className="softCorner dialog" ref={modalRef}>
      <div className="dialogContent">
        <div className="dialogLogo">
          <h2><a href="../"><i className="fa-solid fa-circle-play"></i>Audio&nbsp;Quizlet</a></h2>
        </div>
        <div className="dialogInstructions">
        
          <p>Please enter your name to begin the quiz.</p>
          <p>
            {`You will have ${timeLimit ? `${timeLimit} minute${parseInt(timeLimit) > 1 ? "s" : ""}` : "untimeLimited time"} to complete the ${questions.length+" "} question${questions.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <input type="text" id="nameInput" className="softCorner" placeholder="Your name..." onInput={handleInput}/>
        <div className="buttonWrap">
            <button 
                id="beginQuiz" 
                className="softCorner primaryBtn"
                onClick={handleBegin} 
                disabled={!/[\w\d]{4,}/.test(name)}>
            Begin
            </button>
          <p>or</p>
            <button 
                id="viewResponses" 
                className="softCorner secondaryBtn"
                onClick={handleViewClick}>
            View Responses
            </button>
        </div>
      </div>
    </dialog>
    )
}