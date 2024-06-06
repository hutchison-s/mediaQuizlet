import { GenPrompt } from "../../types-new"
import LimitedPlayer from "../LimitedPlayer"
import LimitedImage from "./LimitedImage"

type QuizPromptProps = {
    p: GenPrompt,
    i: number,
    updateRemaining: (pIndex: number, remaining: number) => void
}
export default function QuizPrompt({p, i, updateRemaining}: QuizPromptProps) {

    const sendRemaining = (remaining: number) => {
        updateRemaining(i, remaining);
    }

    switch(p.type) {
        case "audio":
            return <LimitedPlayer 
            prompt={p}
            update={sendRemaining}/>
        case "image":
            if (p.timeLimit) {
                return <LimitedImage prompt={p} update={sendRemaining}/>
            }
            return <img src={p.path || ""} width="100%" />
        case 'text':
            if (typeof(p.text) == 'object') {
                return p.text.map((line: string) => <p style={{textAlign: 'left', width: '100%', lineHeight: '1.25'}} key={Math.random()}>{line}</p>)
            } else {
                return <p>{p.text}</p>
            }
        default:
            return <p>unidentified prompt type</p>
    }
}