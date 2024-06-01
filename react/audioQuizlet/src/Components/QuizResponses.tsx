import { GenQuestion, userResponse } from "../types-new"
import UserResponse from "./UserResponse"

interface QuizResponsesProps {
    questions: GenQuestion[],
    responses: userResponse[],
    updateScore: (newScore: number, responseId: string, answerIndex: number)=>void
}
export default function QuizResponses({questions, responses, updateScore}: QuizResponsesProps) {

    console.log(questions)
    return responses.map((r) => <UserResponse questions={questions} response={r} key={r.responseId} updateScore={updateScore}/>)
        
}