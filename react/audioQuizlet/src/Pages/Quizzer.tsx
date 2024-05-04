import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { AnswerObject, IndexArray, quizObject } from "../types";
import "./Quizzer.css";
import { resizeAndCompress } from "../Functions/utility/utilFunctions";
import Timer from "../Components/Timer";
import Quiz from "../Components/Quiz";
import QuizzerLogin from "../Components/QuizzerLogin";



export default function Quizzer() {

    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<quizObject | null>(null);
    const [user, setUser] = useState<string>("");
    const [responseId, setResponseId] = useState<string>("");
    const [timeStarted, setTimeStarted] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [answers, setAnswers] = useState<IndexArray<AnswerObject>>({})

    
    useEffect(()=>{
        axios.get("http://localhost:8000/api/quizzes/"+quizId)
            .then(res => {
                if (res.status === 200) {
                    setQuiz(res.data)
                    setIsLoading(false);
                }
            })
    }, [quizId])

    useEffect(()=>{
        if (user) {
            axios.post(`http://localhost:8000/api/quizzes/${quizId}/responses`,
            {user: user, timeStarted: Date.now()}
        )
            .then(res => {
                if (res.status === 200) {
                    setTimeStarted(res.data.timeStarted)
                    setResponseId(res.data.responseId);
                }
            })
        }
        
    }, [user])

    async function uploadImages() {
        const associatedFiles: string[] = [];
        const answers: string[] = [];
        if (quiz && quiz.questions) {
            for (const [idx, q] of quiz.questions.entries()) {
                if (q.type == "photoUpload") {
                    const photo = answers[idx]
                    if (photo) {
                        console.log(photo)
                        const compPhoto: Blob = await resizeAndCompress(photo);
                        const photoForm = new FormData();
                        photoForm.append("photos", compPhoto, "photoUpload")
                        const uploadResponse: {link: string, path: string} = await axios.post(`http://localhost:8000/api/uploads/image`, photoForm)
                            .then(res => {
                                if (res.status === 200) {
                                    return res.data
                                }
                            });
                        const {link, path} = uploadResponse;
                        console.log(uploadResponse)
                        associatedFiles.push(path);
                        setAnswers((prev: IndexArray<AnswerObject>) => {
                            const temp = {...prev};
                            temp[idx].answer = link;
                            return temp;
                        })
                    } else {
                        setAnswers((prev: IndexArray<AnswerObject>) => {
                            const temp = {...prev};
                            temp[idx].answer = "";
                            return temp;
                        })
                    }
                    }
                }
                return associatedFiles;
        }
    }

    async function submitResponse() {
        const associatedFiles: string[] | undefined = await uploadImages();
        console.log(answers)
        if (associatedFiles && answers) {
            const newResponse = {
                answers: answers,
                associatedFiles: associatedFiles,
                timeSubmitted: Date.now()
            }
            axios.patch(`http://localhost:8000/api/quizzes/${quizId}/responses/${responseId}`, newResponse)
                .then(res => {
                    if (res.status === 200) {
                        setIsSubmitted(true)
                        setQuiz(null)
                    }
                })
        }
    }

    return (
        <div className="flex vertical even">
            {isLoading && <h2>Loading Quiz...</h2>}
            {!isLoading && !user && quiz && <QuizzerLogin setUser={setUser} limit={quiz.timeLimit} qNumber={quiz.questions.length} quizId={quizId!}/>}
            {user && quiz
                ?   <>
                        {quiz.timeLimit && timeStarted && <Timer limit={parseInt(quiz.timeLimit)} timeStarted={timeStarted}/>}
                        <Quiz quiz={quiz} setAnswers={setAnswers} handleSubmit={submitResponse} />
                    </>
                :   isSubmitted
                        ?   <h2>Submitted</h2>
                        :   <h2>Quiz Loading Error</h2>}
        </div>
    )
}