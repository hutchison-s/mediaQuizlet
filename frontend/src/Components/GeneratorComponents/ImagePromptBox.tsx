import { useEffect, useState } from "react";
import PromptUploadButton from "./PromptUploadButton";
import { GenPrompt } from "../../types-new";

type ImagePromptProps = {
    p: GenPrompt,
    update: (newValue: File | undefined, timeLimit: number | undefined)=>void;
}
export default function ImagePromptBox({p, update}: ImagePromptProps) {
    const [url, setUrl] = useState<string>(p.file ? window.URL.createObjectURL(p.file) : "");

    const handleUpload = (f: File) => {
        if (f.size < (1064 * 1064 * 20) && f.type.includes("image")) {
            update(f, undefined);
        }
    }

    const updateTimeLimit = (newLimit: number | undefined) => {
        update(p.file, newLimit);
    }

    useEffect(()=>{
        if (p.file) {
            const objectURL = window.URL.createObjectURL(p.file);
            setUrl(objectURL);
        }
    }, [p.file])

    return (
        p.file
            ?   <div className="imagePrompt">
                    <img src={url} className="imagePreview"/>
                    <div className="imageOptions">
                        <label className="checkLabel" htmlFor={p.file.name+"timeLimit"}><input type="checkbox" name={p.file.name+"timeLimit"} id={p.file.name+"timeLimit"} onChange={()=>{updateTimeLimit(30)}} checked={p.timeLimit !== undefined}/> Limit Time</label>
                        {p.timeLimit && <label className="checkLabel"><input type="number" min={1} max={600} value={p.timeLimit} onChange={(e)=>{updateTimeLimit(parseInt(e.target.value))}}/> Seconds</label> }
                    </div>
                </div>
            :   <PromptUploadButton onClick={handleUpload} acceptTypes="image/*" divClass="imageUploadButton" inputID="imageUploader"/>   
    )
}