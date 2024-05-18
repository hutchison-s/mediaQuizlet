import { useEffect, useState } from "react"

type TextResponseProps = {
    initial: string | undefined,
    update: (s: string)=>void
}

export default function TextResponse({initial, update}: TextResponseProps) {

    const [answer, setAnswer] = useState("Loading...");
    const [debounce, setDebounce] = useState<number | undefined>()

    useEffect(()=>{
        if (debounce) {
            clearTimeout(debounce)
        }
        const delay = setTimeout(()=>{
            if (answer) update(answer);
            setDebounce(undefined)
        }, 2000)

        setDebounce(delay)

    }, [answer])

    useEffect(()=>{
        if (initial) {
            setAnswer(initial)
        } else {
            setAnswer("")
        }
    }, [])

    useEffect(()=>{
        setAnswer(initial || "")
    }, [initial])

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