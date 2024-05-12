import { ChangeEvent, useEffect, useState } from "react";
import { ImagePrompt } from "../../types";
import PromptUploadButton from "./PromptUploadButton";

type ImagePromptProps = {
    p: ImagePrompt,
    update: (newValue: File | null, timeLimit: number | null)=>void;
}
export default function ImagePromptBox({p, update}: ImagePromptProps) {
    const [url, setUrl] = useState<string>("");
    const [isLimiting, setIsLimiting] = useState(false);

    const handleUpload = (f: File) => {
        if (f.size < (1064 * 1064 * 20) && f.type.includes("image")) {
            update(f, null);
        }
    }

    const handleTimeLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateTimeLimit(parseInt(e.target.value))
    }

    const updateTimeLimit = (newLimit: number | null) => {
        update(p.file, newLimit);
    }

    useEffect(()=>{
        if (p.file) {
            const objectURL = window.URL.createObjectURL(p.file);
            setUrl(objectURL);
        }
    }, [p.file])

    useEffect(()=>{
        if (isLimiting && !p.timeLimit) {
            updateTimeLimit(30)
        } else if (!isLimiting) {
            updateTimeLimit(null)
        }
    }, [isLimiting])

    return (
        p.file
            ?   <div className="imagePrompt">
                    <img src={url} className="imagePreview"/>
                    <div className="imageOptions">
                        <i onClick={()=>{update(null, null)}} className="fa-solid fa-rotate-left"></i>
                        <label className="checkLabel" htmlFor={p.file.name+"timeLimit"}><input type="checkbox" name={p.file.name+"timeLimit"} id={p.file.name+"timeLimit"} onChange={()=>{setIsLimiting(lim=>!lim)}} checked={isLimiting}/> Limit Time</label>
                        {isLimiting && <label className="checkLabel"><input type="number" min={1} max={600} value={String(p.timeLimit)} onChange={handleTimeLimitChange}/> Seconds</label> }
                    </div>
                </div>
            :   <PromptUploadButton onClick={handleUpload} acceptTypes="image/*" divClass="imageUploadButton" inputID="imageUploader"/>   
    )
}