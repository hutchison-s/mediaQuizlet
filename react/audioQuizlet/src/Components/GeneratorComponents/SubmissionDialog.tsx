import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useGenerator } from "../../genContext"

type SubmissionDialogProps = {
    submitQuiz: () => void,
    closeForm: ()=>void
    setRender: (x: boolean)=>void
}

export default function SubmissionDialog({submitQuiz, closeForm}: SubmissionDialogProps) {

  const {state, dispatch} = useGenerator();

    const modal = useRef<HTMLDialogElement>(null)
    const [validPass, setValidPass] = useState(false)
    const [hiddenPass, setHiddenPass] = useState(true)
    const formRef = useRef<HTMLFormElement>(null)
    const timeRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        modal.current?.showModal();
    }, [])

    const onSubmit = () =>{
        submitQuiz();
        modal.current?.close();
        formRef.current?.reset();
    }

    const validatePass = (e:ChangeEvent<HTMLInputElement>) => {
        setValidPass(e.target.checkValidity())
        dispatch({type: 'SET_PASSWORD', payload: e.target.value})
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({type: 'SET_ADMIN', payload: e.target.value})
    }

    const toggleVisibility = ()=>{
      setHiddenPass(prev => !prev)
    }

    const toggleLimit = ()=>{
      if (state.timeLimit) {
        dispatch({type: 'SET_TIME_LIMIT', payload: undefined})
      } else {
        dispatch({type: 'SET_TIME_LIMIT', payload: 10})
      }
    }

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({type: 'SET_TIME_LIMIT', payload: parseInt(e.target.value)})
    }

    return (
        <dialog id="submissionTool" className="softCorner" ref={modal}>
      <h2>Ready to Generate a Quiz Link?</h2>
      <form className="softCorner" id="submissionForm" ref={formRef}>
        <label htmlFor="email">
          <span>Enter your email address:</span>
          <input
            required 
            type="email" 
            id="email"
            name="password" 
            className="softCorner" 
            placeholder="Email Address..."
            value={state.admin}
            onChange={handleEmailChange}
          />
        </label>
        <label htmlFor="password">
          <span>Enter a secure password to view responses:</span>
          <div id="passBox">
            <input
              required
              type={hiddenPass ? "password" : "text"}
              className="softCorner"
              id="password"
              name="password"
              pattern="^[a-zA-Z0-9!@#%^&*]{4,16}$"
              placeholder="Password..."
              value={state.password}
              onChange={validatePass}
            />
            <i id="peek" className="fa-solid fa-eye" onPointerDown={toggleVisibility} onPointerUp={toggleVisibility}></i>
          </div>
        </label>
        <label htmlFor="timeLimit">
          <span id="timeToggle" onClick={toggleLimit}><i className="fa-regular fa-hourglass-half"></i> Time limit</span>
          <input
            ref={timeRef}
            type="number"
            name="timeLimit"
            id="timeLimit"
            min="1"
            max="60"
            step="1"
            value={state.timeLimit}
            onChange={handleLimitChange}
            hidden={state.timeLimit == undefined}
          />
        </label>
        <button type="button" id="submitButton" className="softCorner primaryBtn" disabled={!validPass} onClick={onSubmit}>Generate Quiz Link</button>
      </form>
      <button id="cancelSubmission" className="softCorner warningButton" onClick={()=>{modal.current?.close(); closeForm()}}>Cancel</button>
    </dialog>
    )
}