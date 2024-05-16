import { quizzerPrompt } from "../../types"
import LimitedPlayer from "../LimitedPlayer"

type QuizPromptProps = {
    p: quizzerPrompt
}
export default function QuizPrompt({p}: QuizPromptProps) {
    switch(p.type) {
        case "Audio":
            return <LimitedPlayer 
            limit={p.playLimit} 
            file={p.filePath}
            allowPause={false}/>
        case "Image":
            return <img src={p.filePath} width="100%" />
        default:
            return <p>{p.instructions}</p>
    }
}