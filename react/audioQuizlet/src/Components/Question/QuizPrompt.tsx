import { GenPrompt } from "../../types-new"
import LimitedPlayer from "../LimitedPlayer"

type QuizPromptProps = {
    p: GenPrompt
}
export default function QuizPrompt({p}: QuizPromptProps) {
    switch(p.type) {
        case "audio":
            return <LimitedPlayer 
            limit={p.playLimit} 
            file={p.path || ""}
            allowPause={false}/>
        case "image":
            return <img src={p.path || ""} width="100%" />
        default:
            return <p>{p.text}</p>
    }
}