import { useEffect, useState } from "react"

type TextResponseProps = {
    update: (s: string)=>void
}

export default function TextResponse({update}: TextResponseProps) {

    const [answer, setAnswer] = useState("");
    const [debounce, setDebounce] = useState<number | undefined>()

    useEffect(()=>{
        if (debounce) {
            clearTimeout(debounce)
        }
        const delay = setTimeout(()=>{
            update(answer);
            setDebounce(undefined)
        }, 2000)

        setDebounce(delay)

    }, [answer])

    return (
        <input
            className="shortAnswer" 
            type="text" 
            placeholder="Correct Answer..." 
            value={answer}
            required 
            onChange={(e)=>{setAnswer(e.target.value)}}
        />
    )
}