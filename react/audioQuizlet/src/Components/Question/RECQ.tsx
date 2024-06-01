import { MouseEvent, useEffect, useRef, useState } from "react";

interface RECQProps {
    setAnswer: (a: string) => void,
}

export default function RECQ({setAnswer}: RECQProps) {
    
    const [response, setResponse] = useState<File | null>(null);
    const [uploadedURL, setUploadedURL] = useState<string>("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(()=>{
        console.log("effect");
        
        if (response) {
            console.log(response);
            
            const url = URL.createObjectURL(response);
            setUploadedURL(url);
            setAnswer(url);
        } else {
            setAnswer('')
            setUploadedURL('')
            chunksRef.current = [];
        }

        
    }, [response, setAnswer])

    const startRecording = () => {  
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({audio: true})
                .then((stream: MediaStream)=>{
                    const rec = new MediaRecorder(stream);
                    chunksRef.current = [];
                    rec.ondataavailable = (e)=>{
                        console.log(e.data)
                        chunksRef.current.push(e.data)
                    }
                    rec.onstop = ()=>{
                        const blobber = new Blob(chunksRef.current, {type: "audio/mp3"});
                        const f = new File([blobber], 'newRecording.mp3', {type: 'audio/mp3'});
                        setResponse(f);
                        setIsRecording(false);
                        setRecorder(null);
                    }
                    setRecorder(rec);
                    rec.start();
                    console.log("recorder started")
                    setIsRecording(true);
                })
                .catch((err)=>{
                    console.log("Error accessing mediaDevices", err)
                })
        }
    }

    const stopRecording = async ()=>{
        if (isRecording && recorder) {
            recorder.stop()         
        }
    }

    const undoRecording = (e: MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation();
        e.preventDefault();
        setResponse(null);
        console.log("undo");
        
    }

    return (
        <label style={{textAlign: "center"}}>

            
            
            {response
                ?   <>
                        <button className="resetPrompt" onClick={undoRecording}><i className="fa-solid fa-rotate-left"></i></button>
                        <audio src={uploadedURL} controls />
                    </>
                :   <div className="recordAudioButton">
                        {isRecording
                            ? <button className="recBtn recordStop" onClick={stopRecording}>STOP</button>
                            : <button className="recBtn recordStart" onClick={startRecording}>REC</button>}
                    </div>
            }
        </label>
    )
}