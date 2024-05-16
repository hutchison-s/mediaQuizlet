import { useQuiz } from "../Context/QuizContext";
import { AnswerObject, IndexArray, quizzerQuestion } from "../types";
import Question from "./Question/QuestionFrame";

interface QuizProps {
    setAnswers: (x: (y: IndexArray<AnswerObject>)=>IndexArray<AnswerObject>) => void,
    handleSubmit: () => void;
}

export default function Quiz({setAnswers, handleSubmit}: QuizProps) {

    const quiz = useQuiz();

    return (
        <section id="quizBox" className="flex vertical">
            {quiz.questions.map((q: quizzerQuestion, index: number) => <Question key={q.response.type+index} index={index} question={q} updater={setAnswers}/>)}
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