import { useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import SideItem from "./SideItem";

export default function ItemSummary() {

    const {items, clearItems} = useItems();
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [targetIndex, setTargetIndex] = useState<number | null>(null);

    const deleteAll = ()=>{
        if (confirm("Are you sure you want to delete all questions and start over?")) {
            clearItems()
        }
    }
  
    return (
        <div className="itemSummary">
            {items && items.map((item, index)=>
                <SideItem 
                    index={index} 
                    item={item} 
                    dragIndex={dragIndex}
                    targetIndex={targetIndex}
                    setDragIndex={setDragIndex}
                    setTargetIndex={setTargetIndex}
                    key={item.response.type+index} />
            )}
            {items.length > 0 && <button onClick={deleteAll} className="deleteAllItems">Delete All</button>}
        </div>
    )
}