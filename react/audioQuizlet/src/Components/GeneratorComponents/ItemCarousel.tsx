import { useEffect, useRef } from "react";
import { useItems } from "../../Context/ItemsContext"
import QuestionItem from "./QuestionItem";
import NewQuestionButton from "./NewQuestionButton";
import { qType } from "../../types";

export default function ItemCarousel() {
    const {items, addItem, active, setActive} = useItems();

    const prev = ()=>{
        const prev = active; 
        setActive(prev-1)
    }
    const next = ()=>{
        const prev = active;
        setActive(prev+1)
    }
    const addNewQuestion = (t: qType) => {
        addItem(t)
    }

    const carRef = useRef<HTMLDivElement>(null);


    useEffect(()=>{
        if (carRef.current) {
            const divy = 100 / items.length;
            carRef.current.style.transform = `translateX(-${active * divy}%)`
        }
    }, [items, active])

    return (
        <>
        <NewQuestionButton onClick={addNewQuestion}/>
        {items
            ?   <>
                    <button id="leftForm" disabled={active == 0} onClick={prev}>
                        <i className="fa-solid fa-angles-left"></i>
                    </button>
                    <button id="rightForm" disabled={active == items.length-1} onClick={next}>
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                    <div id="formWheel">
                        <div id="formCar" ref={carRef} style={{width: `${items.length * 80}vw`}}>
                            {items.map((item, idx) => <QuestionItem key={idx} index={idx} item={item}/>)}
                        </div>
                    </div>
                </>
            :   <div id="introText">
                    <p>Drag and drop files to the toolbar on the left or click 'Upload&nbsp;Files' to start creating an Audio&nbsp;Quizlet</p>
                </div>}
        </>
    )
}