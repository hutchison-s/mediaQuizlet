import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ImagePrompt } from "../../types";

type ImagePromptProps = {
    p: ImagePrompt,
    update: (newValue: File | null, timeLimit: number | null)=>void;
}
export default function ImagePromptBox({p, update}: ImagePromptProps) {
    const [url, setUrl] = useState<string>("");
    const [limiting, setLimiting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = (e:ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && e.target.files[0].size < (1064 * 1064 * 20)) {
            update(e.target.files[0], null);
        }
    }

    const handleTimeLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
        update(p.file, parseInt(e.target.value))
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
                        <i onClick={()=>{update(null, null)}} className="fa-solid fa-rotate-left"></i>
                        <label className="checkLabel" htmlFor={p.file.name+"timeLimit"}><input type="checkbox" name={p.file.name+"timeLimit"} id={p.file.name+"timeLimit"} onChange={()=>{setLimiting(lim=>!lim)}} checked={limiting}/> Limit Time</label>
                        {limiting && <label className="checkLabel"><input type="number" min={1} max={600} value={String(p.timeLimit)} onChange={handleTimeLimitChange}/> Seconds</label> }
                    </div>
                </div>
            :   <div className="imageUploadButton" onClick={()=>{inputRef.current?.click()}}>
                    <i className="fa-solid fa-file-arrow-up"></i>
                    <input type="file" accept="image/*" id="imageUploader" ref={inputRef} onChange={handleUpload} hidden/>
                </div>
    )
}