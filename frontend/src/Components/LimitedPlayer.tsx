import { useState, useRef, useEffect } from 'react';
import { getAudioFile } from '../Functions/apiCalls/audio';

// Define the interface for the props expected by the LimitedPlayer component
interface playerProps {
    file: string,
    limit: number | null | undefined,
    allowPause: boolean | undefined
}

export default function LimitedPlayer({ file, limit, allowPause }: playerProps) {
    // State to track the remaining play limit
    const [remaining, setRemaining] = useState(limit);
    // State to track if the audio is currently playing
    const [isPlaying, setIsPlaying] = useState(false);
    // State to track the progress of the audio playback
    const [progress, setProgress] = useState(0);
    // Ref to hold the audio element
    const audioRef = useRef<HTMLAudioElement>(new Audio());
    // Ref to hold the progress bar element
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Effect to handle fetching and setting the audio file source when the `file` prop changes
    useEffect(() => {
        const audio = audioRef.current;

        // Function to fetch the audio file and set it as the source of the audio element
        const collectChunks = async (fileId: string) => {
            try {
                const blob = await getAudioFile(fileId);
                const url = URL.createObjectURL(blob);
                audio.src = url;
            } catch (error) {
                console.error("Error fetching audio file:", error);
            }
        };
    

        collectChunks(file);

        // Cleanup function to remove event listeners when the component unmounts or the `file` prop changes
        return () => {
            audio.ontimeupdate = null;
            audio.onplay = null;
            audio.onpause = null;
            audio.onended = null;
        };
    }, [file]);

    // Effect to update the progress bar background style based on the `progress` state
    useEffect(() => {
        if (progressBarRef.current) {
            progressBarRef.current.style.backgroundImage = `conic-gradient(var(--light-secondary) ${progress}%, var(--primary) ${progress}% 100%)`;
        }
    }, [progress]);

    // Function to handle play/pause toggle of the audio
    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
            if (!allowPause) {
                audio.currentTime = 0; // Reset the audio to the beginning if pausing is not allowed
            }
        } else {
            // Pause all other audio elements on the page
            document.querySelectorAll('audio').forEach((a) => {
                if (a.currentTime !== 0 && a !== audio) {
                    a.pause();
                }
            });
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Function to handle when the audio starts playing
    const handlePlay = () => {
        setIsPlaying(true);
    };

    // Function to handle when the audio is paused
    const handlePause = () => {
        setIsPlaying(false);
        if (remaining && !allowPause) {
            setRemaining((prevRemaining) => prevRemaining! - 1); // Decrement remaining plays if pausing is not allowed
        }
    };

    // Function to handle when the audio ends
    const handleEnded = () => {
        setIsPlaying(false);
        if (remaining) {
            setRemaining((prevRemaining) => prevRemaining! - 1); // Decrement remaining plays
        }
    };

    // Function to handle time updates of the audio to update the progress
    const handleTimeUpdate = () => {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    };

    // Set button icon depending on isPlaying and allowPause states
    const setIcon = ()=>{
        const icon = isPlaying ? (allowPause ? 'pause' : 'stop') : 'play';
        return <i className={`fa-solid fa-${icon}`}></i>
    }

    return (
        <div className="playerBox">
            <div ref={progressBarRef} className="progressBar">
                <button
                    className="playBtn"
                    disabled={remaining === 0}
                    onClick={handlePlayPause}
                >
                    {setIcon()}
                </button>
            </div>
            {remaining 
                ? <p className="remaining">{remaining} remaining plays</p> 
                : <p className="remaining">Unlimited Plays</p>}
            <p style={{ textAlign: "center", marginBottom: "1rem" }}>
                <small>{`Pausing ${allowPause ? "en" : "dis"}abled`}</small>
            </p>
            <audio
                ref={audioRef}
                onPlay={handlePlay}
                onPause={handlePause}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
            ></audio>
        </div>
    );
}
