import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { AudioPrompt } from "../../types";

type AudioPromptProps = {
    p: AudioPrompt,
    update: (newValue: File | null, isPausable: boolean, playLimit: number | null)=>void;
}
export default function AudioPromptBox({p, update}: AudioPromptProps) {
    const [url, setUrl] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [hasError, setHasError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = (f: File) => {
        if (f.size < (1064 * 1064 * 20) && f.type.includes("audio")) {
            update(f, false, 3);
        } else {
            setIsDragging(false)
        }
    }
    const handlePauseToggle = ()=>{
        const newBool = !p.isPausable;
        update(p.file, newBool, p.playLimit)
    }

    const handleLimitChange = (e: ChangeEvent<HTMLInputElement>)=>{
        const newLimit = e.target.value;
        update(p.file, p.isPausable, parseInt(newLimit))
    }

    useEffect(()=>{

    })

    useEffect(()=>{
        if (p.file) {
            const objectURL = window.URL.createObjectURL(p.file);
            setUrl(objectURL);
        } else {
            setIsDragging(false)
        }
    }, [p])

    return (
        p.file
            ?   <div className="audioPrompt">
                    <audio src={url} controls />
                    <div className="audioOptions">
                        <i onClick={()=>{update(null, false, 0)}} className="fa-solid fa-rotate-left"></i>
                        <div className="checkLabel"><input type="checkbox" checked={p.isPausable} onChange={handlePauseToggle}/>Allow Pause </div>
                        <div className="checkLabel"><input type="number" min={1} max={100} value={String(p.playLimit)} onChange={handleLimitChange}/>Plays Allowed </div>
                    </div>
                </div>
            :   <div className="audioUploadButton" 
                    onClick={()=>{inputRef.current?.click()}}
                    onDragOver={(e:DragEvent)=>{
                        e.preventDefault();
                        if (e.dataTransfer.items.length == 1 && Array.from(e.dataTransfer.items).some(item => item.type.includes("audio"))) {
                            setIsDragging(true)
                        } else {
                            setIsDragging(true)
                            setHasError(true)
                        }
                    }}
                    onDragLeave={(e:DragEvent)=>{
                        e.preventDefault();
                        setIsDragging(false)
                        setHasError(false)
                    }}
                    onDrop={(e:DragEvent)=>{
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && inputRef.current) {
                            handleUpload(file)
                        }
                        setIsDragging(false)
                        setHasError(false)

                    }}
                >
                    {isDragging && hasError && <p className="notAllowed" style={{color: "var(--background)", fontSize: "1rem"}}>Only one AUDIO file may be uploaded</p>}
                    {!hasError && <i className={isDragging ? "dragging fa-solid fa-file-arrow-up" : "fa-solid fa-file-arrow-up"}></i>}
                    <input type="file" accept="audio/*" id="audioUploader" ref={inputRef} onChange={(e:ChangeEvent<HTMLInputElement>)=>{e.target.files && handleUpload(e.target.files[0])}} hidden/>
                </div>
    )
}