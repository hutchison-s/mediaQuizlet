import { Response } from "../../types"

type TextResponseProps = {
    response: Response,
    update: (s: string)=>void
}

export default function TextResponse({response, update}: TextResponseProps) {

    return (
        <input
            className="shortAnswer" 
            type="text" 
            placeholder="Correct Answer..." 
            value={response.correct} 
            onChange={(e)=>{update(e.target.value)}}
        />
    )
}