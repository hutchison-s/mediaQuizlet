import { ChangeEvent } from "react";

type TextPromptProps = {
    value: string,
    update: (newValue: string)=>void;
}
export default function TextPrompt({value, update}: TextPromptProps) {
    return <input type="text" value={value} onChange={(event:ChangeEvent<HTMLInputElement>) =>{update(event.target.value)}}/>
}