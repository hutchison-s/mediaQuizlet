import { GenPrompt } from "../../types-new";

type TextPromptProps = {
    p: GenPrompt
    update: (newValue: string)=>void;
}
export default function TextPromptBox({p, update}: TextPromptProps) {

    return (
        <div className="textPrompt">
            <textarea
                placeholder="Instructions or Text Prompt..." 
                rows={6}
                value={p.text}
                required 
                onChange={(event)=>{update(event.target.value)}}/>
        </div>
    )
}