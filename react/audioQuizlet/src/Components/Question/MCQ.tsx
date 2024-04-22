import { ChangeEvent, useEffect, useState } from "react";
import { questionObject } from "../../types";

interface MCQProps {
    question: questionObject,
    setAnswer: (a: string) => void,
}

interface OptionType {
    opt: string,
    idx: number
}
export default function MCQ({question, setAnswer}: MCQProps) {

    const options = question.options!;
    const [selected, setSelected] = useState(0);

    useEffect(()=>{
        setAnswer(String(selected))
    }, [selected, setAnswer])

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = event.target;
        setSelected(parseInt(target.value));
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
                        name={question.title}
                        checked={selected === idx}
                    />
                </label>
        )
    }

    return (
        <>
            {options.map((opt, idx) => <Option key={idx} opt={opt} idx={idx}/>)}
        </>
    )
}