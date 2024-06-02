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

    return (
        <>
            <div className={isOpen ? "open selectCurrent" : "selectCurrent" }
                onClick={()=>{setIsOpen(prev=>!prev)}}>
                {isOpen && 
                <div className={"selectOptions"} ref={menuRef}>
                    {list.map((item, index)=>
                        index != current && <span key={index as Key}
                            onClick={()=>{sendIndex(index); setCurrent(index);}}
                            >{item}</span>
                    )}
                    </div>}
                {list[current]}
            </div>
        </>
    )
}