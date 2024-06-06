import { Key, useEffect, useRef, useState } from "react"
import './SelectPopUp.css';

type SelectProps = {
    value: number,
    list: string[] | JSX.Element[],
    sendIndex: (i: number) => void
}
export default function SelectPopUp({value, list, sendIndex}: SelectProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        setCurrent(value)
    }, [value])

    useEffect(()=>{
        if (isOpen) {
            window.addEventListener("pointerdown", handleClickWhenOpen)
        }

        return ()=>{
            window.removeEventListener("pointerdown", handleClickWhenOpen)
        }
    }, [isOpen])

    const handleClickWhenOpen = (e:PointerEvent)=>{
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setIsOpen(false)
        }
    }

    const handleOptionClick = (index: number) => {
        sendIndex(index);
        setCurrent(index);
    }

    return (
        <>
            <div className={isOpen ? "open selectCurrent" : "selectCurrent" } aria-label="Prompt Type Selector" aria-expanded={isOpen}
                onClick={()=>{setIsOpen(prev=>!prev)}} role="button" tabIndex={0} onKeyDown={(e)=>{return e.key == 'Enter' ? setIsOpen(prev=>!prev) : null}}>
                {isOpen && 
                <div className={"selectOptions"} ref={menuRef} role="combobox">
                    {list.map((item, index)=>
                        index != current && <button key={index as Key}
                            onClick={()=>handleOptionClick(index)}
                            onKeyDown={(e)=>{return e.key == 'Enter' && handleOptionClick(index)}}
                            role="option"
                            >{item}</button>
                    )}
                    </div>}
                {list[current]}
            </div>
        </>
    )
}