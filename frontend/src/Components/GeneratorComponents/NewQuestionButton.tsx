import { useEffect, useRef, useState } from "react";
import { GenResponseType } from "../../types-new";

type NewQuestionButtonProps = {
    onClick: (t: GenResponseType)=>void
}
export default function NewQuestionButton({onClick}: NewQuestionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null)

    const handleClickWhenOpen = (e:PointerEvent)=>{
        if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
            setIsOpen(false)
        }
    }

    useEffect(()=>{
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
            {isOpen && <div id="newQuestionType">
                <span onClick={()=>{onClick("MC")}}>Multiple Choice</span>
                <span onClick={()=>{onClick("SA")}}>Short Answer</span>
                <span onClick={()=>{onClick("IMG")}}>Image Upload</span>
                <span onClick={()=>{onClick("AUD")}}>Audio Upload</span>
                <span onClick={()=>{onClick("REC")}}>Audio Recording</span>
            </div>}
        </button>
    )
}