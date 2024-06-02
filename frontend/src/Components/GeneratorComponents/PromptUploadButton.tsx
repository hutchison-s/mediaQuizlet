import { ChangeEvent, DragEvent, useRef, useState } from "react";

type PromptUploadProps = {
    onClick: (f: File)=>void,
    acceptTypes: string,
    divClass: string,
    inputID: string
}
export default function PromptUploadButton({onClick, acceptTypes, divClass, inputID}: PromptUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [hasError, setHasError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className={divClass}
            onClick={()=>{inputRef.current?.click()}}
            onDragOver={(e:DragEvent)=>{
                e.preventDefault();
                if (e.dataTransfer.items.length == 1 && Array.from(e.dataTransfer.items).some(item => item.type.includes(acceptTypes.split("/")[0]))) {
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
                    onClick(file)
                }
                setIsDragging(false)
                setHasError(false)
            }}
        >
            {isDragging && hasError && <p className="notAllowed" style={{color: "var(--background)", fontSize: "1rem"}}>Only one {acceptTypes.split("/")[0].toUpperCase()} file may be uploaded</p>}
            {!hasError && <><span>Upload</span><i className={isDragging ? "dragging fa-solid fa-file-arrow-up" : "fa-solid fa-file-arrow-up"}></i><span>{acceptTypes.split("/")[0]}</span></>}
            <input 
                type="file" 
                accept={acceptTypes} 
                id={inputID} 
                ref={inputRef} 
                onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                    e.target.files && onClick(e.target.files[0]);
                    setIsDragging(false);
                }} 
                hidden
                required/>
        </div>
    )
}