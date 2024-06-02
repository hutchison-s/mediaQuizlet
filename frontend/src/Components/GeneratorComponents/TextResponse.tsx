import { ChangeEvent } from "react"
import { GenResponse } from "../../types-new"

type TextResponseProps = {
    qResponse: GenResponse,
    update: (r: GenResponse)=>void
}

export default function TextResponse({qResponse, update}: TextResponseProps) {

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newResponse = {
            ...qResponse,
            correct: e.target.value
        };
        update(newResponse)
    }

    return (
        <input
            className="shortAnswer" 
            type="text" 
            placeholder="Correct Answer..."
            value={qResponse.correct}
            required 
            onChange={handleChange}
        />
    )
}