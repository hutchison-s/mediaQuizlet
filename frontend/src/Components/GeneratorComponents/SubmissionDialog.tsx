import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useGenerator } from "../../Context/genContext"

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
    const [isLimiting, setIsLimiting] = useState(false);
    const formRef = useRef<HTMLFormElement>(null)

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
      const newBool = !isLimiting
      setIsLimiting(newBool);
      if (newBool) {
        dispatch({type: 'SET_TIME_LIMIT', payload: 10})
      } else {
        dispatch({type: 'SET_TIME_LIMIT', payload: undefined})
      }
    }

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({type: 'SET_TIME_LIMIT', payload: parseInt(e.target.value)})
    }

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
      dispatch({type: 'SET_TITLE', payload: e.target.value})
    }

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      dispatch({type: 'SET_DESCRIPTION', payload: e.target.value})
    }

    return (
        <dialog id="submissionTool" className="softCorner" ref={modal}>
      <h2>Ready to Generate a Quiz Link?</h2>
      <form className="softCorner" id="submissionForm" ref={formRef}>
        <label htmlFor="title">
          <span>Give your quiz a title</span>
          <input 
            type="text" 
            required 
            id="title" 
            name="title" 
            className="softCorner" 
            placeholder="Quiz title..." 
            value={state.title || ""} 
            onChange={handleTitleChange}/>
        </label>
        <label htmlFor="description">
          <span>Provide a description or custom instructions for the quiz</span>
          <textarea 
            id="description" 
            name="description" 
            className="softCorner" 
            placeholder="Quiz description..."
            rows={3} 
            value={state.description || ""} 
            onChange={handleDescriptionChange}/>
        </label>
        <label htmlFor="email">
          <span>Provide your email address</span>
          <input
            required 
            type="email" 
            id="email"
            name="password" 
            className="softCorner" 
            placeholder="Your Email Address..."
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
          <label id="timeToggle" ><input type="checkbox" checked={isLimiting} onChange={toggleLimit} hidden/><span ><i className="fa-regular fa-hourglass-half"></i> Time limit</span></label>
          <input
            type="number"
            name="timeLimit"
            id="timeLimit"
            min="1"
            max="60"
            step="1"
            value={state.timeLimit || 0}
            onChange={handleLimitChange}
            hidden={!isLimiting}
          />
        </label>
        <button type="button" id="submitButton" className="softCorner primaryBtn" disabled={!validPass} onClick={onSubmit}>Generate Quiz Link</button>
      </form>
      <button id="cancelSubmission" className="softCorner warningButton" onClick={()=>{modal.current?.close(); closeForm()}}>Cancel</button>
    </dialog>
    )
}