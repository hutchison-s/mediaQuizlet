import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

interface QuizzerLoginProps {
    setUser: (u: string) => void,
    limit: string | null,
    qNumber: number,
    quizId: string
}

export default function QuizzerLogin({setUser, limit, qNumber, quizId}: QuizzerLoginProps) {

    const [name, setName] = useState("");
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDialogElement>(null)

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
            You will have {limit ? `${limit} minute${parseInt(limit) > 1 ? "s" : ""}` : "unlimited time"} to complete the
            {qNumber} question{qNumber > 1 ? "s" : ""}.
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