import { ChangeEvent, useEffect, useState } from "react";

interface FileQProps {
    accept: string,
    setAnswer: (a: string) => void,
}

export default function FileQ({accept, setAnswer}: FileQProps) {
    
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
        <label style={{textAlign: "center"}}>
            <span className="flexFull">Upload your {accept.split("/")[0]}: </span>
            <input
                required 
                type="file"
                accept={accept} 
                onInput={handleChange}
            />
            
            {response
                ?   accept == "image/*"
                        ?   <img src={uploadedURL} width="200px" style={{margin: "0.5rem auto"}}></img>
                        :   <audio src={uploadedURL} controls />
                :   null
            }
        </label>
    )
}