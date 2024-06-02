import axios from "axios";
import { GenQuestion, GenQuiz } from "../../types-new";
import { chunkAndUpload } from "./audio";
import { compressAndUploadImage } from "./images";
interface QuizSubmissionProps {
        questions: GenQuestion[],
        associatedFiles: string[],
        password: string,
        admin: string,
        title: string,
        description: string | undefined,
        timeLimit: number | null,
        expires: string,
        status: string
}
export async function submitToServer(newQuiz: QuizSubmissionProps): Promise<string | void> {
    const id = await axios.post("https://audio-quizlet.vercel.app/api/quizzes", JSON.stringify(newQuiz), {headers: {"Content-Type": "application/json"}})
    .then(res => res.data)
    .then((doc: {URL: string, quizId: string}) => {
        const {URL, quizId} = doc;
        console.log(URL, "quiz id: "+quizId)
        return quizId
    })
    .catch(err => {
        console.log(err)
    })
    if (id) {
        return id;
    } else {
        return "";
    }
}

export async function processQuestions(state: GenQuiz) {
    const questions = [...state.questions];
    const associatedFiles: string[] = [];
    const updatedQuestions: GenQuestion[] = await Promise.all(questions.map(async q=>{
        const {prompts, ...otherProps} = q;
        for (const prompt of prompts) {
            if (prompt.type == "audio" && prompt.file) {
                const {id, associated} = await chunkAndUpload(prompt.file);
                for (const f of associated) {
                    associatedFiles.push(f)
                }
                prompt.path = id;
            } else if (prompt.type == "image" && prompt.file) {
                const {path, link} = await compressAndUploadImage(prompt.file);
                associatedFiles.push(path);
                prompt.path = link;
            } else {
                if (typeof(prompt.text) == 'string') {
                    prompt.text = prompt.text?.split('\n')
                }
            }
        }
        
        return {prompts, ...otherProps}
    }))

    return {updatedQuestions, associatedFiles}
}