import { useGenerator } from "../../Context/genContext";
import { GenQuestion, GenResponse } from "../../types-new";
import ChoiceResponse from "./ChoiceResponse";
import TextResponse from "./TextResponse";

type ResponseBoxProps = {
    q: GenQuestion
}
export default function ResponseBox({q}: ResponseBoxProps) {

    const {dispatch} = useGenerator();

    const updateResponse = (newResponse: GenResponse)=>{
        const newItem = {...q, response: newResponse};
        dispatch({type: 'UPDATE_QUESTION', payload: newItem})
    }

    switch(q.response.type) {
        case "SA":
            return <TextResponse qResponse={q.response} update={updateResponse}/>;
        case "MC":
            return <ChoiceResponse id={q.id} qResponse={q.response} update={updateResponse}/>
        case "IMG":
            return <div>Image Upload <i className="fa-solid fa-camera"></i></div>;
        case "REC":
            return <div>Audio Recording <i className="fa-solid fa-microphone"></i></div>
        default:
            return <div>Audio Upload <i className="fa-solid fa-circle-play"></i></div>;
    }
}