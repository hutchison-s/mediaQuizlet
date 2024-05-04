import { AnswerObject, IndexArray, questionObject, quizObject } from "../types";
import Question from "./Question/QuestionFrame";

interface QuizProps {
    quiz: quizObject,
    setAnswers: (x: (y: IndexArray<AnswerObject>)=>IndexArray<AnswerObject>) => void,
    handleSubmit: () => void;
}

export default function Quiz({quiz, setAnswers, handleSubmit}: QuizProps) {
    return (
        <section id="quizBox" className="flex vertical">
            {quiz.questions.map((q: questionObject, index: number) => <Question key={q.title+q.file} index={index} question={q} updater={setAnswers}/>)}
            <button 
                id="submitAll"
                className="primaryBtn marginCenter softCorner"
                type="button"
                onClick={handleSubmit}
            >
                Submit Quiz
            </button>
        </section>
    )
}