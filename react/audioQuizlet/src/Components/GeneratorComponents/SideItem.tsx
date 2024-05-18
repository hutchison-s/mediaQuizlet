import { DragEvent, useEffect, useState } from "react";
import { useItems } from "../../Context/ItemsContext";
import { generatorQuestion } from "../../types";

type SideItemProps = {
    item: generatorQuestion
    index: number,
    dragIndex: number | null,
    targetIndex: number | null,
    setDragIndex: (n: number | null)=>void,
    setTargetIndex: (n: number | null)=>void
}
export default function SideItem({index, item, dragIndex, targetIndex, setDragIndex, setTargetIndex}: SideItemProps) {

    const {active, setActive, shiftItems } = useItems();
    const [preview, setPreview] = useState<string | File | null>("")

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
            setDragIndex(null);
            setTargetIndex(null);
        }
        
    }

    const onDragEnd = ()=>{
        console.log("reseting indeces");
        
        setDragIndex(null);
        setTargetIndex(null);
    }

    useEffect(()=>{
        let tempPrev: string | File | null = ""
        
        if (item.prompts.length > 0) {
            for (const p of item.prompts) {
                if (p.type == "Image" && p.file != null) {
                    tempPrev = p.file
                    break;
                } else if (p.type == "Text" && p.instructions) {
                    tempPrev = p.instructions?.substring(0, 8);
                    continue;
                } else if (p.type == "Audio" && p.file != null) {
                    tempPrev = p.file?.name?.substring(0, 8);
                }
            }
            setPreview(tempPrev);
        }
        
    }, [item, index])

    const ItemPreview = () =>{
        if (!preview) {
            return <></>;
        }
        if (typeof preview == 'string') {
            return <span>{preview}{preview.length > 7 && "..."}</span>
        } else {
            return <span><img src={window.URL.createObjectURL(preview)} /></span>
        }
    }

    return (
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
                    <div className="flex gapSmall">
                        <i style={{opacity: "0.2", cursor: "move"}} className="fa-solid fa-grip-vertical"></i>
                        Question {index+1}
                    </div>
                <ItemPreview />
                </div>
    )
}