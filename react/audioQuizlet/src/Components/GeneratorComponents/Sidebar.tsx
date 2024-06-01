import LogoLink from "../Logo";
import ItemSummary from "./ItemSummary";
import FileUploader from "./Uploader";
import { useGenerator } from "../../genContext";
import { GenQuestion } from "../../types-new";

interface SideBarProps {
    generateButton: JSX.Element
}

export default function SideBar({generateButton}: SideBarProps) {

    const {state, dispatch } = useGenerator();

    const onUpload = (newQuestions: GenQuestion[]) => {
        dispatch({type: 'ADD_MULTIPLE_QUESTIONS', payload: newQuestions})
    }

    return (
        <aside id="sideBar">
            <LogoLink tag={false}/>
            <ItemSummary />
            {state.questions.length > 0 && generateButton}
            <FileUploader callback={onUpload} />
            
        </aside>
    )
}
