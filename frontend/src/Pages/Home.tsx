import { useNavigate } from "react-router-dom";
import Welcome from "../Components/Welcome";

export default function Home() {

    const navigate = useNavigate();
    const exampleQuizLink = '/quizzer/gKt1qhUMDCzwRUykUTge'

    return (
        <>
            <section id="homePage">
                <Welcome />
                <p className="heroText"><strong>Media Quizlet</strong> redefines quiz creation for those who seek expanded media control. Offering unparalleled customization, our platform lets you tailor quizzes with audio, image, and text prompts effortlessly. Plus, enjoy the convenience of diving straight into quizzing without any login hassles.</p>
                <h2 style={{textAlign: 'center', fontSize: '2.5rem'}}>How to Get Started</h2>
                <div className="tutorialFrame">
                    <h3>Create custom questions with audio, image, or text.</h3>
                    <p>One or multiple prompts, with control over how people can interact with the media provided</p>
                    <p>Multiple response options such as multiple choice, short answer, file upload, or built-in audio recording</p>
                    <img src="/custom-question.png" alt="custom quizlet question" />
                </div>
                <div className="tutorialFrame">
                    <h3>Create your quiz and customize layout and quiz information</h3>
                    <p>Create multiple questions by drag and drop batch file uploads</p>
                    <p>Rearrange questions with drag and drop interface, duplicate questions quickly and easily</p>
                    <p>Create a secure password and optionally set a time limit for the quiz</p>
                    <img src="/custom-quiz.png" alt="custom quizlet" />
                </div>
                <div className="tutorialFrame">
                    <h3>Unique quiz code and link provided to access</h3>
                    <p>Receive email confirmation with link and your password for safe keeping</p>
                    <p>Use the same link to view quiz responses, but remember your password</p>
                    <img src="/link-code.png" alt="unique quiz link and code" />
                </div>
                <div className="tutorialFrame">
                    <h3>Quiz taking presented in minimalist mobile-friendly format</h3>
                    <p>Quizzers enter their name and get started; no login required</p>
                    <p>Limited control, but clear communication about media prompts</p>
                    <p>Saves progress for text questions and time limits on refresh</p>
                    <p>Quizzes automatically submit when time expires</p>
                    <img src="/controlled-quiz.png" alt="quiz in progress" />
                </div>
                <div className="tutorialFrame">
                    <h3>Review responses and adjust grades as needed</h3>
                    <p>Limited auto-grading capability for text</p>
                    <p>Easily adjust grades and manage responses</p>
                    <p>Access to quiz administration options such as closing the quiz (no access), reseting the quiz (emptying responses), and deleting the quiz</p>
                    <img src="/grade-results.png" alt="quiz admin screen" />
                </div>
                <button
                    onClick={()=>{navigate('/generator')}} 
                    className="primaryBtn softCorner" 
                    style={{margin: '2rem auto', display: 'block'}}>
                        Create your own!
                </button>
                <button
                    onClick={()=>{navigate(exampleQuizLink)}} 
                    className="secondaryBtn softCorner" 
                    style={{margin: '2rem auto', display: 'block'}}>
                        Take the example quiz
                </button>
            </section>
        </>

    )
}