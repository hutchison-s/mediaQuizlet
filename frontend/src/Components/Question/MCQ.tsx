import { ChangeEvent, useEffect, useState } from "react";
import { GenQuestion } from "../../types-new";

interface MCQProps {
    question: GenQuestion,
    setAnswer: (a: string) => void,
    initial: string
}

interface OptionType {
    opt: string,
    idx: number
}
export default function MCQ({question, setAnswer, initial}: MCQProps) {

    const options = question.response.options!;
    const [selected, setSelected] = useState(initial || "0");

    useEffect(()=>{
        setAnswer(selected)
    }, [selected, setAnswer])

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = event.target;
        setSelected(target.value);
    }

    function Option({opt, idx}: OptionType) {
        return (
            <label htmlFor={opt+idx}>
                    {opt}
                    <input 
                        required 
                        type="radio" 
                        value={idx} 
                        onChange={handleChange}
                        name={question.id+"options"}
                        checked={selected === String(idx)}
                    />
                </label>
        )
    }

    return (
        <>
            {options.map((opt, idx) => <Option key={question.id+"option"+idx} opt={opt} idx={idx}/>)}
        </>
    )
}