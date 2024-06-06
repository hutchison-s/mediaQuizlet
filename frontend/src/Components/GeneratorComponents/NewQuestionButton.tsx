import { useEffect, useRef, useState } from "react";
import { GenResponseType } from "../../types-new";

type NewQuestionButtonProps = {
    onClick: (t: GenResponseType)=>void
}
export default function NewQuestionButton({onClick}: NewQuestionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const buttonRef = useRef<HTMLDivElement>(null)

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
        <div id="newQuestionType" ref={buttonRef} role="combobox" aria-expanded={isOpen}>
            <button  id="newQuestion" className="shadow" onClick={()=>{setIsOpen(prev=>!prev)}} role="button" aria-label="Show/Hide new question menuu">
                <i className="fa-solid fa-plus"></i>
            </button>
            {isOpen && <div className="questionTypes">
                <button className='questionTypeOption' onClick={()=>{onClick("MC"); setIsOpen(false)}} role="option">Multiple Choice</button>
                <button className='questionTypeOption' onClick={()=>{onClick("SA"); setIsOpen(false)}} role="option">Short Answer</button>
                <button className='questionTypeOption' onClick={()=>{onClick("IMG"); setIsOpen(false)}} role="option">Image Upload</button>
                <button className='questionTypeOption' onClick={()=>{onClick("AUD"); setIsOpen(false)}} role="option">Audio Upload</button>
                <button className='questionTypeOption' onClick={()=>{onClick("REC"); setIsOpen(false)}} role="option">Audio Recording</button>
            </div>}
            
        </div>
    )
}