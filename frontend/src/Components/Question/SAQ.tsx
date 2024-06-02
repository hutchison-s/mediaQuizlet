import { ChangeEvent, useEffect, useState } from "react";

interface SAQProps {
    setAnswer: (a: string) => void,
    initial: string
}

export default function SAQ({setAnswer, initial}: SAQProps) {
    
    const [response, setResponse] = useState(initial || "");

    useEffect(()=>{
        setAnswer(response)
    }, [response, setAnswer])

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = event.target;
        setResponse(target.value);
    }

    return (
            <label>
                    <input 
                        required 
                        type="text" 
                        placeholder="Your Answer..."
                        onInput={handleChange}
                        value={response}
                    />
                </label>
        )
}