import { useEffect, useState } from "react";
import { Prompt } from "../../types";

type TextPromptProps = {
    p: Prompt
    update: (newValue: string)=>void;
}
export default function TextPromptBox({p, update}: TextPromptProps) {
    const [content, setContent] = useState("");
    const [debounce, setDebounce] = useState<number | undefined>()

    useEffect(()=>{
        if (debounce) {
            clearTimeout(debounce)
        }
        const delay = setTimeout(()=>{
            update(content);
            setDebounce(undefined)
        }, 2000)

        setDebounce(delay)

    }, [content])

    useEffect(()=>{
        if (p.instructions != "") {
            setContent(p.instructions)
        }
    }, [])

    useEffect(()=>{
        setContent(p.instructions)
    }, [p])

    return (
        <div className="textPrompt">
            <textarea
                placeholder="Instructions or Text Prompt..." 
                rows={6}
                value={content}
                required 
                onChange={(event)=>{setContent(event.target.value)}}/>
        </div>
    )
}