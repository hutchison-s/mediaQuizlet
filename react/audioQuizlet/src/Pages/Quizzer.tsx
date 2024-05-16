import axios from "axios";
import { useEffect, useState } from "react";
import { AnswerObject, IndexArray } from "../types";
import "./Quizzer.css";
import { resizeAndCompress } from "../Functions/utility/utilFunctions";
import Timer from "../Components/Timer";
import Quiz from "../Components/Quiz";
import QuizzerLogin from "../Components/QuizzerLogin";
import { useQuiz } from "../Context/QuizContext";
import { useNavigate } from "react-router-dom";
import QuizProvider from "../Context/QuizProvider";



export default function Quizzer() {

    const quiz = useQuiz();
    const [user, setUser] = useState<string>("");
    const [responseId, setResponseId] = useState<string>("");
    const [timeStarted, setTimeStarted] = useState<number | null>(null)
    const [answers, setAnswers] = useState<IndexArray<AnswerObject>>({})

    const navigate = useNavigate()

    useEffect(()=>{
        if (user) {
            axios.post(`http://localhost:8000/api/quizzes/${quiz.quizId}/responses`,
            {user: user, timeStarted: Date.now()}
        )
            .then(res => {
                if (res.status === 200) {
                    setTimeStarted(res.data.timeStarted)
                    setResponseId(res.data.responseId);
                }
            })
        }
        
    }, [user, quiz])

    async function uploadImages() {
        const associatedFiles: string[] = [];
        const answers: string[] = [];
        if (quiz && quiz.questions) {
            for (const [idx, q] of quiz.questions.entries()) {
                if (q.response.type == "IMG") {
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
            axios.patch(`http://localhost:8000/api/quizzes/${quiz.quizId}/responses/${responseId}`, newResponse)
                .then(res => {
                    if (res.status === 200) {
                        navigate("/success")
                    }
                })
        }
    }

    return (
        <QuizProvider>
            <div className="flex vertical even">
                {user
                    ?   <>
                            {timeStarted && <Timer timeStarted={timeStarted}/>}
                            <Quiz setAnswers={setAnswers} handleSubmit={submitResponse} />
                        </>
                    :   <QuizzerLogin setUser={setUser} />
                }

            </div>
        </QuizProvider>
    )
}