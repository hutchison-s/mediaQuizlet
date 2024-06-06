import { ChangeEvent, useEffect, useRef, useState } from "react";
import PromptUploadButton from "./PromptUploadButton";
import { GenPrompt } from "../../types-new";

type AudioPromptProps = {
    p: GenPrompt,
    update: (newValue: File | undefined, isPausable: boolean | undefined, playLimit: number | undefined)=>void;
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
        if (p.file) {
            const objectURL = window.URL.createObjectURL(p.file);
            setUrl(objectURL);
        } else {
            setUrl("")
            chunksRef.current = [];
            setRecorder(undefined);
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
                    <div className="audioPreviewBox">
                        <audio src={url} controls preload="true"/>
                        <p style={{textAlign: "center"}}><small>{p.file.name}</small></p>
                    </div>
                    <div className="audioOptions">
                        <div className="checkLabel"><input id="allowPause" type="checkbox" checked={p.isPausable} onChange={handlePauseToggle}/><label htmlFor="allowPause">Allow Pause</label> </div>
                        <div className="checkLabel"><input id="playLimit" type="number" min={1} max={100} value={String(p.playLimit)} onChange={handleLimitChange}/><label htmlFor="playLimit">Plays Allowed</label> </div>
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