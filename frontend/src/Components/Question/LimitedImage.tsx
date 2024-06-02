import { useState } from "react"
import { GenPrompt } from "../../types-new"

interface LimitedImageProps {
    prompt: GenPrompt,
    update: (remaining: number) => void
}

export default function LimitedImage({prompt, update}: LimitedImageProps) {

    const [remaining, setRemaining] = useState<number | undefined>((prompt.remaining != undefined ) ? prompt.remaining : prompt.timeLimit)
    const [showing, setShowing] = useState<boolean>(false)
    const [started, setStarted] = useState<boolean>(false)
    const [counter, setCounter] = useState<number | undefined>()

    const handleStart = ()=>{
        setStarted(true);
        if (typeof(prompt.remaining) == 'number' && prompt.remaining == 0) {
            console.log("out of time, not showing");
            return;
        }
        if (prompt.remaining == undefined) {
            update(prompt.timeLimit!)
        }
        setShowing(true);
        const inter = setInterval(countDown, 1000)
        setCounter(inter)
    }

    const countDown = () => {
        if (typeof(prompt.remaining) == 'number' && prompt.remaining != 0) {
            update(prompt.remaining - 1)
        }
        
        setRemaining((prevRemaining) => {
            if (prevRemaining !== undefined && prevRemaining > 0) {
                return prevRemaining - 1;
            } else {
                clearInterval(counter);
                setShowing(false);
                return prevRemaining;
            }
        });
    }

    return (
        started || prompt.remaining === 0
            ?   <div className="promptImageWrapper">
                    {showing
                        ?   <>
                                <img src={prompt.path} alt="prompt image"/>
                                <span className="promptImageClock">{remaining}</span>
                            </>
                        :   <p >Time Expired</p>
                    }
                </div>
            :   <div className="promptImageWrapper"><button onClick={handleStart}>Reveal Image for {prompt.remaining != undefined ? prompt.remaining : prompt.timeLimit} seconds</button></div>
    )
}