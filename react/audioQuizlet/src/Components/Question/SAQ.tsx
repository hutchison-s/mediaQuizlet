import { ChangeEvent, useEffect, useState } from "react";

interface SAQProps {
    setAnswer: (a: string) => void,
}

export default function SAQ({setAnswer}: SAQProps) {
    
    const [response, setResponse] = useState("");

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
                        onInput={handleChange}
                    />
                </label>
        )
}