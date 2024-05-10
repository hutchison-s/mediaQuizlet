import { ChangeEvent, useEffect } from "react"
import { Response } from "../../types"

type ChoiceResponseProps = {
    response: Response,
    index: number,
    update: (opts: string[], correct: string | undefined)=>void
}

export default function ChoiceResponse({response, index, update}: ChoiceResponseProps) {

    useEffect(()=>{
        update(["", "", "", ""], "0")
    }, [])

    const handleRadioChange = (e:ChangeEvent<HTMLInputElement>, i: number) => {
        if (e.target.checked) {
            console.log(i+" is checked")
            update(response.options!, String(i))
        } else {
            console.log(i+" is not checked")
        }
        
    }

    const handleOptionChange = (e:ChangeEvent<HTMLInputElement>, index: number) => {
        const opts = [...response.options!];
        opts[index] = e.target.value;
        update(opts, response.correct);
    }

    return (
        <>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+index+"-1"} 
                    id={"option"+index+"-1"} 
                    placeholder="Option 1..." 
                    onChange={(e)=>{handleOptionChange(e, 0)}}
                    />
                <label htmlFor={"radio"+index+"-1"}>
                <span>Correct</span>
                <input 
                    type="radio" 
                    name={"radio"+index} 
                    id={"radio"+index+"-1"} 
                    checked={response.correct == "0"}
                    onChange={(e)=>{handleRadioChange(e, 0)}}
                    hidden
                    />
                    </label>
                </div>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+index+"-2"} 
                    id={"option"+index+"-2"} 
                    placeholder="Option 2..." 
                    onChange={(e)=>{handleOptionChange(e, 1)}}
                    />
                <label htmlFor={"radio"+index+"-2"}>
                <span>Correct</span>
                    <input
                        type="radio"
                        name={"radio"+index}
                        id={"radio"+index+"-2"}
                        checked={response.correct == "1"}
                        onChange={(e)=>{handleRadioChange(e, 1)}}
                        hidden
                    />
                </label>
                </div>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+index+"-3"} 
                    id={"option"+index+"-3"} 
                    placeholder="Option 3..." 
                    onChange={(e)=>{handleOptionChange(e, 2)}}
                    />
                <label htmlFor={"radio"+index+"-3"}>
                    <span>Correct</span>
                    <input
                        type="radio"
                        name={"radio"+index}
                        id={"radio"+index+'-3'}
                        checked={response.correct == "2"}
                        onChange={(e)=>{handleRadioChange(e, 2)}}
                        hidden/>
                </label>
                </div>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+index+"-4"} 
                    id={"option"+index+"-4"} 
                    placeholder="Option 4..." 
                    onChange={(e)=>{handleOptionChange(e, 3)}}
                    />
                <label htmlFor={"radio"+index+"-4"}>
                    <span >Correct</span>
                    <input 
                        type="radio" 
                        name={"radio"+index} 
                        id={"radio"+index+"-4"}  
                        checked={response.correct == "3"}
                        onChange={(e)=>{handleRadioChange(e, 3)}}
                        hidden
                        />
                </label>
                </div>
                
        </>
    )
}