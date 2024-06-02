import { ChangeEvent } from "react"
import { GenResponse } from "../../types-new";

type ChoiceResponseProps = {
    qResponse: GenResponse,
    id: number,
    update: (r: GenResponse)=>void
}

export default function ChoiceResponse({qResponse, id, update}: ChoiceResponseProps) {


    const handleRadioChange = (e:ChangeEvent<HTMLInputElement>, i: number) => {
        if (e.target.checked) {
            console.log(i+" is checked")
            const newResponse = {
                ...qResponse,
                correct: String(i)
            }
            update(newResponse)
        } else {
            console.log(i+" is not checked")
        }
    }

    const handleOptionChange = (e:ChangeEvent<HTMLInputElement>, index: number) => {
        const newResponse = {...qResponse};
        newResponse.options![index] = e.target.value;
        update(newResponse)
    }

    return (
        <>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+id+"-1"} 
                    id={"option"+id+"-1"} 
                    placeholder="Option 1..."
                    required 
                    value={qResponse.options![0]}
                    onChange={(e)=>{handleOptionChange(e, 0)}}
                    />
                <label htmlFor={"radio"+id+"-1"}>
                <span>Correct</span>
                <input 
                    type="radio" 
                    name={"radio"+id} 
                    id={"radio"+id+"-1"} 
                    checked={qResponse.correct === '0'}
                    onChange={(e)=>{handleRadioChange(e, 0)}}
                    hidden
                    />
                    </label>
                </div>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+id+"-2"} 
                    id={"option"+id+"-2"} 
                    placeholder="Option 2..."
                    required 
                    value={qResponse.options![1]}
                    onChange={(e)=>{handleOptionChange(e, 1)}}
                    />
                <label htmlFor={"radio"+id+"-2"}>
                <span>Correct</span>
                    <input
                        type="radio"
                        name={"radio"+id}
                        id={"radio"+id+"-2"}
                        checked={qResponse.correct === '1'}
                        onChange={(e)=>{handleRadioChange(e, 1)}}
                        hidden
                    />
                </label>
                </div>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+id+"-3"} 
                    id={"option"+id+"-3"} 
                    placeholder="Option 3..."
                    required 
                    value={qResponse.options![2]}
                    onChange={(e)=>{handleOptionChange(e, 2)}}
                    />
                <label htmlFor={"radio"+id+"-3"}>
                    <span>Correct</span>
                    <input
                        type="radio"
                        name={"radio"+id}
                        id={"radio"+id+'-3'}
                        checked={qResponse.correct === '2'}
                        onChange={(e)=>{handleRadioChange(e, 2)}}
                        hidden/>
                </label>
                </div>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+id+"-4"} 
                    id={"option"+id+"-4"} 
                    placeholder="Option 4..."
                    required 
                    value={qResponse.options![3]}
                    onChange={(e)=>{handleOptionChange(e, 3)}}
                    />
                <label htmlFor={"radio"+id+"-4"}>
                    <span >Correct</span>
                    <input 
                        type="radio" 
                        name={"radio"+id} 
                        id={"radio"+id+"-4"}  
                        checked={qResponse.correct === '3'}
                        onChange={(e)=>{handleRadioChange(e, 3)}}
                        hidden
                        />
                </label>
                </div>
                
        </>
    )
}