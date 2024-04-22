import { ChangeEvent, useEffect, useState } from "react";

interface IMGQProps {
    setAnswer: (a: string) => void,
}

export default function IMGQ({setAnswer}: IMGQProps) {
    
    const [response, setResponse] = useState<File | null>(null);
    const [uploadedURL, setUploadedURL] = useState<string>("");

    useEffect(()=>{
        if (response) {
            const url = URL.createObjectURL(response);
            setUploadedURL(url);
            setAnswer(url);
        }
    }, [response, setAnswer])

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = event.target;
        if (target.files) {
            setResponse(target.files[0]);
        }
        
    }

    return (
        <label>
            <span className="flexFull">Upload your photo: </span>
            <input 
                required 
                type="file"
                accept="image/*" 
                onInput={handleChange}
            />
            
            {response && <img src={uploadedURL} width="200px" style={{margin: "0.5rem auto"}}></img>}
        </label>
    )
}