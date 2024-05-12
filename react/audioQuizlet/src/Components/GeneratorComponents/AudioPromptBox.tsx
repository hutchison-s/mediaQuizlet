import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AudioPrompt } from "../../types";
import PromptUploadButton from "./PromptUploadButton";

type AudioPromptProps = {
    p: AudioPrompt,
    update: (newValue: File | null, isPausable: boolean, playLimit: number | null)=>void;
}
export default function AudioPromptBox({p, update}: AudioPromptProps) {
    const [url, setUrl] = useState<string>("");

    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState<MediaRecorder>();
    const chunksRef = useRef<Blob[]>([]);


    const handleUpload = (f: File) => {
        if (f.size < (1064 * 1064 * 20) && f.type.includes("audio")) {
            update(f, false, 3);
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
        }
    }, [p])

    const startRecording = () => {
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({audio: true})
                .then((stream: MediaStream)=>{
                    const rec = new MediaRecorder(stream);
                    rec.ondataavailable = (e)=>{
                        console.log(e.data)
                        chunksRef.current.push(e.data)
                    }
                    rec.onstop = ()=>{
                        const blobber = new Blob(chunksRef.current, {type: "audio/mp3"});
                        const f = new File([blobber], 'newRecording.mp3', {type: 'audio/mp3'});
                        handleUpload(f);
                        setIsRecording(false);
                        setRecorder(undefined)
                    }
                    setRecorder(rec);
                    rec.start();
                    console.log("recorder started")
                    setIsRecording(true);
                })
                .catch((err)=>{
                    console.log(err)
                })
        }
    }

    const stopRecording = ()=>{
        if (isRecording && recorder) {
            recorder.stop()
            
        }
    }

    return (
        p.file
            ?   <div className="audioPrompt">
                    <div>
                        <audio src={url} controls preload="true"/>
                        <p style={{textAlign: "center"}}><small>{p.file.name}</small></p>
                    </div>
                    <div className="audioOptions">
                        <i onClick={()=>{
                            update(null, false, 0);
                            chunksRef.current = [];
                        }} className="fa-solid fa-rotate-left"></i>
                        <div className="checkLabel"><input type="checkbox" checked={p.isPausable} onChange={handlePauseToggle}/>Allow Pause </div>
                        <div className="checkLabel"><input type="number" min={1} max={100} value={String(p.playLimit)} onChange={handleLimitChange}/>Plays Allowed </div>
                    </div>
                </div>
            :   <div className="newAudio">
                    <PromptUploadButton onClick={handleUpload} acceptTypes="audio/*" divClass="audioUploadButton" inputID="audioUpload" />
                    <div className="recordAudioButton">
                        {isRecording
                            ? <button className="recBtn recordStop" onClick={stopRecording}>STOP</button>
                            : <button className="recBtn recordStart" onClick={startRecording}>REC</button>}
                    </div>
            </div>
    )
}