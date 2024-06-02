import { DragEvent, useEffect, useState } from "react";
import { GenQuestion } from "../../types-new";
import { useGenerator } from "../../Context/genContext";
import ItemPreview from "./ItemPreview";

type SideItemProps = {
    question: GenQuestion
    index: number,
    dragIndex: number | null,
    targetIndex: number | null,
    setDragIndex: (n: number | null)=>void,
    setTargetIndex: (n: number | null)=>void
}
export default function SideItem({index, question, dragIndex, targetIndex, setDragIndex, setTargetIndex}: SideItemProps) {

    const {state, dispatch} = useGenerator();
    const [preview, setPreview] = useState<string | File | undefined>("")

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
            dispatch({type: 'INSERT_QUESTION_BEFORE', payload: {questionId: state.questions[dragIndex].id, targetIndex: targetIndex}});
            setDragIndex(null);
            setTargetIndex(null);
        }
        
    }
    const onDragEnd = ()=>{
        console.log("reseting indeces");
        
        setDragIndex(null);
        setTargetIndex(null);
    }

    const updateActive = (index: number) => {
        dispatch({type: 'SET_ACTIVE', payload: index})
    }

    useEffect(()=>{
        let tempPrev: string | File | undefined = undefined
        
        if (question.prompts.length > 0) {
            for (const p of question.prompts) {
                if (p.type == "image" && p.file != null) {
                    tempPrev = p.file
                    break;
                } else if (p.type == "text" && p.text) {
                    tempPrev = p.text?.substring(0, 8);
                    continue;
                } else if (p.type == "audio" && p.file != null) {
                    tempPrev = p.file?.name?.substring(0, 8);
                }
            }
            setPreview(tempPrev);
        }
        
    }, [question, index])

    

    return (
        <div 
                    className={`sideItem ${state.active == index ? "active" : ""} ${targetIndex == index ? "dragOver" : ""}`} 
                    key={index}
                    style={{
                        opacity: dragIndex == index ? "0.25" : "1", 
                        outline: targetIndex == index ? "2px solid lime" : "none"
                    }} 
                    onClick={()=>{updateActive(index)}}
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
                <ItemPreview content={preview} />
                </div>
    )
}