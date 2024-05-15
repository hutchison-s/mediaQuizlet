import { useItems } from "../../Context/ItemsContext";
import ChoiceResponse from "./ChoiceResponse";
import TextResponse from "./TextResponse";

type ResponseBoxProps = {
    t: string,
    i: number
}
export default function ResponseBox({t, i}: ResponseBoxProps) {

    const {items, updateItems} = useItems();

    switch(t) {
        case "SA":
                return <TextResponse update={(newString: string)=>{

                    const newItem = {...items[i]};
                    newItem.response.correct = newString;
                    updateItems(i, newItem);
                }}/>;
            case "MC":
                return <ChoiceResponse index={i} update={(newOptions: string[], correct: string | undefined)=>{
                            const newItem = {...items[i]};
                            newItem.response.options = newOptions;
                            newItem.response.correct = correct;
                            updateItems(i, newItem)
                        }}/>
            case "IMG":
                return <div>Image Upload <i className="fa-solid fa-camera"></i></div>;
            default:
                return <div>Audio Upload <i className="fa-solid fa-circle-play"></i></div>;
    }
}