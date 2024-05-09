import { DragEvent, useState } from "react";
import { useItems } from "../../Context/ItemsContext";

export default function ItemSummary() {

    const {items, active, setActive, swapPositions, clearItems} = useItems();
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [targetIndex, setTargetIndex] = useState<number | null>(null);

    const onDragStart = (e:DragEvent<HTMLDivElement>, i: number) => {
        setDragIndex(i);
        e.dataTransfer.dropEffect = "move"
    }
    const onDragOver = (e:DragEvent<HTMLDivElement>, i: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move"
        if (targetIndex == i) {
            return;
        }
        if (dragIndex != i) {
            setTargetIndex(i);
        } else {
            setTargetIndex(null)
        }
        
    }
    const onDragLeave = ()=>{
        setTargetIndex(null);
    }
    const onDrop = (e: DragEvent<HTMLDivElement>)=>{
        e.preventDefault();
        if (dragIndex != null && targetIndex != null) {
            console.log("swap")
            swapPositions(dragIndex, targetIndex);
        }
        
    }

    const onDragEnd = ()=>{
        setDragIndex(null);
        setTargetIndex(null);
    }

    return (
        <div className="itemSummary">
            {items && items.map((item, index)=>
                <div 
                    className={`sideItem ${active == index ? "active" : ""}`} 
                    key={index}
                    style={{opacity: dragIndex == index ? "0.25" : "1", outline: targetIndex == index ? "2px solid lime" : "none"}} 
                    onClick={()=>{setActive(index)}}
                    onDragStart={(e)=>{onDragStart(e, index)}}
                    onDragOver={(e)=>{onDragOver(e, index)}}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onDragEnd={onDragEnd}
                    draggable
                >
                    Question {index+1}
                </div>
            )}
            {items.length > 0 && <button onClick={clearItems}>Delete All</button>}
        </div>
    )
}