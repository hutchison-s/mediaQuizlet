import { useState } from "react";
import SideItem from "./SideItem";
import { useGenerator } from "../../Context/genContext";

export default function ItemSummary() {

    const {state, dispatch} = useGenerator();
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [targetIndex, setTargetIndex] = useState<number | null>(null);

    const deleteAll = ()=>{
        if (confirm("Are you sure you want to delete all questions and start over?")) {
            dispatch({type: 'DELETE_ALL_QUESTIONS', payload: true})
        }
    }
  
    return (
        <div className="itemSummary">
            {state.questions.map((item, index)=>
                <SideItem 
                    index={index} 
                    question={item} 
                    dragIndex={dragIndex}
                    targetIndex={targetIndex}
                    setDragIndex={setDragIndex}
                    setTargetIndex={setTargetIndex}
                    key={item.id} />
            )}
            {state.questions.length > 0 && <button onClick={deleteAll} className="deleteAllItems">Delete All</button>}
        </div>
    )
}