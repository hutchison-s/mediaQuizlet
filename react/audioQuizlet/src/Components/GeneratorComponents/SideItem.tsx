import { DragEvent, useEffect, useState } from "react";
import { useItems } from "../../Context/ItemsContext";

type SideItemProps = {
    index: number
}
export default function SideItem({index}: SideItemProps) {

    const {items, active, setActive, shiftItems } = useItems();
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [targetIndex, setTargetIndex] = useState<number | null>(null);
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
        }
        
    }

    const onDragEnd = ()=>{
        setDragIndex(null);
        setTargetIndex(null);
    }

    useEffect(()=>{
        const item = items[index]
        if (item.prompts.length > 0) {
            if (item.prompts[0].type == "Text") {
                if (!preview || (typeof preview == 'string' && preview.substring(0, 8) != item.prompts[index].instructions.substring(0, 8))) {
                    setPreview(item.prompts[0].instructions.substring(0, 8))
                }
            } else {
                if (!preview || preview != item.prompts[0].file) {
                    setPreview(item.prompts[0].file)
                }
            }
        }
    }, [items, preview, index])

    const ItemPreview = () =>{
        const p = items[index].prompts[0];

        if (!preview) {
            return <></>;
        }
        if (typeof preview == 'string') {
            return <span>{preview}{preview.length > 7 && "..."}</span>
        } 
        if (!p.file) {
            return <></>
        }
        if (p.type == "Image") {
            return <span><img src={window.URL.createObjectURL(p.file)} /></span>
        }

        return <span>{p.file?.name.substring(0, 8)}...</span>
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
                    Question {index+1}
                <ItemPreview />
                </div>
    )
}