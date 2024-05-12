import { ChangeEvent, useEffect, useRef, useState } from "react"

type SubmissionDialogProps = {
    getForm: (formData: FormData) => void,
    closeForm: ()=>void
    setRender: (x: boolean)=>void
}

export default function SubmissionDialog({getForm, closeForm}: SubmissionDialogProps) {

    const modal = useRef<HTMLDialogElement>(null)
    const [validPass, setValidPass] = useState(false)
    const [hiddenPass, setHiddenPass] = useState(true)
    const [hasLimit, setHasLimit] = useState(false)
    const formRef = useRef<HTMLFormElement>(null)
    const passRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const timeRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        modal.current?.showModal();
    }, [])

    const onSubmit = () =>{
      console.log(emailRef.current?.value)
      console.log(passRef.current?.value)
      console.log(timeRef.current?.value || "not present")
      const fData = new FormData();
      fData.append("email", emailRef.current!.value)
      fData.append("password", passRef.current!.value)
      fData.append("timeLimit", timeRef.current!.value)

        getForm(fData);
        modal.current?.close();
        formRef.current?.reset();
    }

    const validatePass = (e:ChangeEvent<HTMLInputElement>) => {
        setValidPass(e.target.checkValidity())
        console.log(e.target.checkValidity())
    }

    const toggleVisibility = ()=>{
      setHiddenPass(prev => !prev)
    }

    const toggleLimit = ()=>{
      setHasLimit(prev => !prev)
    }

    return (
        <dialog id="submissionTool" className="softCorner" ref={modal}>
      <h2>Ready to Generate a Quiz Link?</h2>
      <form className="softCorner" id="submissionForm" ref={formRef}>
        <label htmlFor="email">
          <span>Enter your email address:</span>
          <input
            ref={emailRef} 
            required 
            type="email" 
            id="email"
            name="password" 
            className="softCorner" 
            placeholder="Email Address..."
          />
        </label>
        <label htmlFor="password">
          <span>Enter a secure password to view responses:</span>
          <div id="passBox">
            <input
              ref={passRef}
              required
              type={hiddenPass ? "password" : "text"}
              className="softCorner"
              id="password"
              name="password"
              pattern="^[a-zA-Z0-9!@#%^&*]{4,16}$"
              placeholder="Password..."
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
            hidden={!hasLimit}
          />
        </label>
        <button type="button" id="submitButton" className="softCorner primaryBtn" disabled={!validPass} onClick={onSubmit}>Generate Quiz Link</button>
      </form>
      <button id="cancelSubmission" className="softCorner warningButton" onClick={()=>{modal.current?.close(); closeForm()}}>Cancel</button>
    </dialog>
    )
}