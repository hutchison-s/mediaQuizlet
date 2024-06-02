import { MouseEvent, useEffect, useRef, useState } from "react";
import PromptUploadButton from "../GeneratorComponents/PromptUploadButton";

interface FileQProps {
    accept: string,
    setAnswer: (a: string) => void,
}

export default function FileQ({accept, setAnswer}: FileQProps) {
    
    const [response, setResponse] = useState<File | null>(null);
    const [uploadedURL, setUploadedURL] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(()=>{
        if (response) {
            const url = URL.createObjectURL(response);
            setUploadedURL(url);
            setAnswer(url);
        }
    }, [response, setAnswer])

    function handleUpload(f: File) {
        setResponse(f);
    }

    function undoFile(e: MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        e.stopPropagation();
        setResponse(null);
        setUploadedURL('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        
    }

    return (
        <div className="fileUploadWrapper" style={{textAlign: "center"}}>        
            {response
                ?   <>
                        <button className="resetPrompt" onClick={undoFile}><i className="fa-solid fa-rotate-left"></i></button>
                        {accept == "image/*"
                            ?   <img src={uploadedURL} width="200px" style={{margin: "0.5rem auto"}}></img>
                            :   <audio src={uploadedURL} controls />}
                    </>
                :   <PromptUploadButton onClick={handleUpload} acceptTypes={accept} divClass="fileUploadLabel" inputID="" />
            }
        </div>
    )
}