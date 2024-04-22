import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { IndexArray, questionObject, quizObject } from "../types";
import Question from "../Components/Question/QuestionFrame";
import "./Quizzer.css";



export default function Quizzer() {

    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<quizObject | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<IndexArray<string>>({})

    
    useEffect(()=>{
        axios.get("http://localhost:8000/api/quizzes/"+quizId)
            .then(res => {
                if (res.status === 200) {
                    setQuiz(res.data)
                    setIsLoading(false);
                }
            })
    }, [quizId])

    function handleClick() {
        for (const answer in answers) {
            console.log("question "+(parseInt(answer) + 1)+" is "+(answers[answer] || "empty"))
        }
    }

    return (
        <div className="flex vertical even">
            {isLoading
                ? <h2>Loading Quiz...</h2>
                : quiz
                    ?   <section id="quizBox" className="flex vertical">
                            {quiz.questions.map((q: questionObject, index: number) => <Question key={q.title+q.file} index={index} question={q} updater={setAnswers}/>)}
                            <button 
                                id="submitAll"
                                className="primaryBtn marginCenter softCorner"
                                type="button"
                                onClick={handleClick}
                            >
                                Submit Quiz
                            </button>
                        </section>
                    :   <h2>Quiz Loading Error</h2>}
        </div>
    )
}