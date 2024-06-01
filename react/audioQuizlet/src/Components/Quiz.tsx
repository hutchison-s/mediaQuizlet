import { useQuiz } from "../Context/QuizContext";
import { GenQuestion } from "../types-new";
import Question from "./Question/QuestionFrame";

interface QuizProps {
    handleSubmit: () => void;
}

export default function Quiz({handleSubmit}: QuizProps) {

    const quiz = useQuiz();

    return (
        <section id="quizBox" className="flex vertical">
            {quiz.questions.map((q: GenQuestion, idx: number) => <Question key={q.id} index={idx} question={q} />)}
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