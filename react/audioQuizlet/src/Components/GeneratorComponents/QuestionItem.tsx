import { useItems } from "../../Context/ItemsContext";
import { Prompt, Response, generatorQuestion } from "../../types";
import TextPrompt from "./TextPrompt";

type itemProps = {
    index: number,
    item: generatorQuestion
}

export default function QuestionItem({index, item}: itemProps) {

    const {updateItems} = useItems();

    type PromptBoxProps = {
        idx: number,
        p: Prompt
    }

    const PromptBox = ({idx, p}: PromptBoxProps) => {
        if (p.file) {
            return null;
        } else {
            return (
                <TextPrompt 
                    value={p.instructions} 
                    update={(newString: string)=>{
                        const newItem = {...item};
                        newItem.prompts[idx] = {file: null, instructions: newString};
                        updateItems(index, newItem)
                    }}
                />
            )
        }
    }

    const addPrompt = ()=>{
        const newItem = {...item};
        newItem.prompts.push({file: null, instructions: ""})
        updateItems(index, newItem)
    }

    type ResponseBoxProps = {
        res: Response
    }
    const ResponseBox = ({res}: ResponseBoxProps) => {
        switch(res.type) {
            case "SA":
                return <label><input type="text" /></label>;
            default:
                return null;
        }
    }


    return (
        <div className="itemFrame">
            <div className="itemBox softCorner flex vertical pad2 shadow">
                {item.prompts.map((p, i)=><PromptBox key={i} idx={i} p={p} />)}
                <p>---<span onClick={addPrompt}><i className="fa-solid fa-circle-plus"></i></span>---</p>
                <ResponseBox res={item.response} />
            </div>
        </div>
    )
}