import { useState, useRef, useEffect } from 'react';
import { getAudioFile } from '../Functions/apiCalls/audio';

interface playerProps {
    file: string,
    limit: number | null | undefined,
    allowPause: boolean
}

export default function LimitedPlayer({file, limit, allowPause}: playerProps) {
  const [remaining, setRemaining] = useState(limit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    async function collectChunks(fileId: string) {
        try {
            const blob = await getAudioFile(fileId);
            const url = URL.createObjectURL(blob);
            audio.src = url;
        } catch (error) {
            console.log(error);
        }
    }

    collectChunks(file);

    return () => {
      audio.ontimeupdate = null;
      audio.onplay = null;
      audio.onpause = null;
      audio.onended = null;
    };
  }, [file]);

  useEffect(()=>{
    if (progressBarRef.current) {
        console.log(progress)
        progressBarRef.current.style.backgroundImage = `conic-gradient(var(--light-secondary) ${progress}%, var(--primary) ${progress}% 100%)`
    }
    
  }, [progress])

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
        if (isPlaying) {
            audio.pause();
            if (!allowPause) {
                audio.currentTime = 0;
            }
        } else {
            document.querySelectorAll('audio').forEach((a) => {
                if (a.currentTime !== 0 && a !== audio) {
                    a.pause();
                }
            });
            audio.play();
        }
        setIsPlaying((prevIsPlaying) => !prevIsPlaying);
    }
    
  };

  return (
    <div className="playerBox">
        <div ref={progressBarRef} className="progressBar">
            <button 
            className="playBtn" 
            disabled={remaining === 0}
            onClick={togglePlay}>
            {!isPlaying 
                ? <i className="fa-solid fa-play"></i> 
                : allowPause 
                    ? <i className='fa-solid fa-pause'></i>
                    : <i className="fa-solid fa-stop"></i>
            }
        </button>
        </div>
        {remaining ? <p className="remaining">{remaining} remaining plays</p> : <p className='remaining'>Unlimited Plays</p>}
        <p style={{textAlign: "center", marginBottom: "1rem"}}><small>{`Pausing ${allowPause ? "en" : "dis"}abled`}</small></p>
        <audio 
            ref={audioRef}
            onPlay={() => {
                setIsPlaying(true);
            }}
            onPause={() => {
                setIsPlaying(false)
                if (remaining && !allowPause) {
                    setRemaining((prevRemaining) => prevRemaining! - 1);
                }
            }}
            onEnded={()=>{
                setIsPlaying(false);
                if (remaining) {
                    setRemaining((prevRemaining) => prevRemaining! - 1);
                }
                
            }}
            onTimeUpdate={()=>{
                setProgress((audioRef.current.currentTime / audioRef.current.duration * 100))
            }}
        ></audio>
    </div>
  );
}
