import { useState, useRef, useEffect } from 'react';
import { getAudioFile } from '../Functions/apiCalls/audio';

interface unlimitedProps {
    file: string,
}

export default function UnLimitedPlayer({file}: unlimitedProps) {
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
            onClick={togglePlay}>
            {!isPlaying 
                ? <i className="fa-solid fa-play"></i> 
                : <i className='fa-solid fa-pause'></i>

            }
        </button>
        </div>
        <audio 
            ref={audioRef}
            onPlay={() => {
                setIsPlaying(true);
            }}
            onPause={() => {
                setIsPlaying(false)
            }}
            onEnded={()=>{
                setIsPlaying(false);
            }}
            onTimeUpdate={()=>{
                setProgress((audioRef.current.currentTime / audioRef.current.duration * 100))
            }}
        ></audio>
    </div>
  );
}
