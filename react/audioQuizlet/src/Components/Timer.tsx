import { useEffect, useState } from "react";
import { useQuiz } from "../Context/QuizContext";

interface TimerProps {
    timeStarted: number
}
export default function Timer({timeStarted}: TimerProps) {

    const {timeLimit} = useQuiz();
    const [remaining, setRemaining] = useState<number>(60);

    useEffect(() => {
        const limit = parseInt(timeLimit)
        // Calculate deadline in milliseconds
        const deadline = (limit * 60 * 1000) + timeStarted;
        const timerInterval = setInterval(() => {
            const now = Date.now();
            const timeRemainingInSeconds = Math.max(0, Math.floor((deadline - now) / 1000));
            setRemaining(timeRemainingInSeconds);
            
            // Stop the timer when time runs out
            if (timeRemainingInSeconds <= 0) {
                clearInterval(timerInterval); 
            }
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(timerInterval);
        
    }, [timeLimit, timeStarted]); 

    // Format remaining time as minutes and seconds
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    return (
        <div id="timer">
            <p id="timeBox">{formattedTime}</p>
        </div>
    )
}