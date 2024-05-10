import { DragEvent, useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import { generatorQuestion } from "../../types";

export default function ItemSummary() {

    const {items, active, setActive, shiftItems, clearItems} = useItems();
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
            shiftItems(dragIndex, targetIndex);
        }
        
    }

    const onDragEnd = ()=>{
        setDragIndex(null);
        setTargetIndex(null);
    }

    const deleteAll = ()=>{
        if (confirm("Are you sure you want to delete all questions and start over?")) {
            clearItems()
        }
    }

    type TextPreviewProps = {
        item: generatorQuestion
    }
    const TextPreview = ({item}: TextPreviewProps) =>{
        for (let i = 0; i < item.prompts.length; i++) {
            if (item.prompts[i].type == "Image" && item.prompts[i].file) {
                return <span><img src={window.URL.createObjectURL(item.prompts[i].file!)} /></span>
            }
            if (item.prompts[i].type == "Text") {
                return <span>{item.prompts[i].instructions.substring(0, 8)}...</span>
            }
            if (item.prompts[i].type == "Audio" && item.prompts[i].file) {
                return <span>{item.prompts[i].file?.name.substring(0, 8)}...</span>
            }
        }
    }

    return (
        <div className="itemSummary">
            {items && items.map((item, index)=>
                <div 
                    className={`sideItem ${active == index ? "active" : ""} ${targetIndex == index ? "dragOver" : ""}`} 
                    key={index}
                    style={{
                        opacity: dragIndex == index ? "0.25" : "1", 
                        outline: targetIndex == index ? "2px solid lime" : "none"
                    }} 
                    onClick={()=>{setActive(index)}}
                    onDragStart={(e)=>{onDragStart(e, index)}}
                    onDragOver={(e)=>{onDragOver(e, index)}}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onDragEnd={onDragEnd}
                    draggable
                >
                    Question {index+1}
                    <TextPreview item={item} />
                </div>
            )}
            {items.length > 0 && <button onClick={deleteAll} className="deleteAllItems">Delete All</button>}
        </div>
    )
}