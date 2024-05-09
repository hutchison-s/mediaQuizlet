import { Key, useEffect, useState } from "react"
import './SelectPopUp.css';

type SelectProps = {
    value: number,
    list: string[] | JSX.Element[],
    sendIndex: (i: number) => void
}
export default function SelectPopUp({value, list, sendIndex}: SelectProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(0);

    useEffect(()=>{
        setCurrent(value)
    }, [value])

    return (
        <>
            <div className={isOpen ? "open selectCurrent" : "selectCurrent" }
                onClick={()=>{setIsOpen(prev=>!prev)}}>
                {isOpen && 
                <div className={"selectOptions"}>
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