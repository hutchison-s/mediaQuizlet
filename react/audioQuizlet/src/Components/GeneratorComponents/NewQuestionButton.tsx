import { useEffect, useRef, useState } from "react";
import { qType } from "../../types";

type NewQuestionButtonProps = {
    onClick: (t: qType)=>void
}
export default function NewQuestionButton({onClick}: NewQuestionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(()=>{
        const handleClickWhenOpen = (e:PointerEvent)=>{
            if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            window.addEventListener("pointerdown", handleClickWhenOpen)
        }

        return ()=>{
            window.removeEventListener("pointerdown", handleClickWhenOpen)
        }
    }, [isOpen])

    return (
        <button ref={buttonRef} id="newQuestion" className="shadow" onClick={()=>{setIsOpen(prev=>!prev)}}>
            <i className="fa-solid fa-plus"></i>
            {isOpen && <div>
                <button onClick={()=>{onClick("MC")}}>Multiple Choice</button>
                <button onClick={()=>{onClick("SA")}}>Short Answer</button>
                <button onClick={()=>{onClick("IMG")}}>Image Response</button>
                <button onClick={()=>{onClick("AUD")}}>Audio Response</button>
            </div>}
        </button>
    )
}