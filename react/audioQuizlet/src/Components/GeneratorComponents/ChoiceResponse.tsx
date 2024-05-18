import { ChangeEvent, useEffect, useState } from "react"
import { useItems } from "../../Context/ItemsContext";

type ChoiceResponseProps = {
    index: number,
    update: (opts: string[], correct: string | undefined)=>void
}

export default function ChoiceResponse({index, update}: ChoiceResponseProps) {

    const {items} = useItems();
    const [correct, setCorrect] = useState<number>(0);
    const [options, setOptions] = useState<string[]>(["", "", "", ""])
    const [debounce, setDebounce] = useState<number | undefined>()

    useEffect(()=>{
        if (debounce) {
            clearTimeout(debounce)
        }
        const delay = setTimeout(()=>{
            update(options, String(correct));
            setDebounce(undefined)
        }, 2000)

        setDebounce(delay)

    }, [correct, options])

    useEffect(()=>{
        const initialOptions = items[index].response.options;
        const initialCorrect = items[index].response.correct;
        if (initialOptions) {
            setOptions(prev => {
                prev.length = 0;
                const newOpts = [...initialOptions];
                return newOpts
            });
        }
        if (initialCorrect) {
            setCorrect(parseInt(initialCorrect));
        }
    }, [index])

    const handleRadioChange = (e:ChangeEvent<HTMLInputElement>, i: number) => {
        if (e.target.checked) {
            console.log(i+" is checked")
            setCorrect(i)
        } else {
            console.log(i+" is not checked")
        }
        
    }

    const handleOptionChange = (e:ChangeEvent<HTMLInputElement>, index: number) => {
        setOptions(prevOpts => {
            const newOpts = [...prevOpts];
            newOpts[index] = e.target.value;
            return newOpts;
        })
    }

    return (
        <>
            <div className="optionBox">
                <input 
                    type="text" 
                    name={"option"+index+"-1"} 
                    id={"option"+index+"-1"} 
                    placeholder="Option 1..."
                    required 
                    value={options[0]}
                    onChange={(e)=>{handleOptionChange(e, 0)}}
                    />
                <label htmlFor={"radio"+index+"-1"}>
                <span>Correct</span>
                <input 
                    type="radio" 
                    name={"radio"+index} 
                    id={"radio"+index+"-1"} 
                    checked={correct == 0}
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
                    required 
                    value={options[1]}
                    onChange={(e)=>{handleOptionChange(e, 1)}}
                    />
                <label htmlFor={"radio"+index+"-2"}>
                <span>Correct</span>
                    <input
                        type="radio"
                        name={"radio"+index}
                        id={"radio"+index+"-2"}
                        checked={correct == 1}
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
                    required 
                    value={options[2]}
                    onChange={(e)=>{handleOptionChange(e, 2)}}
                    />
                <label htmlFor={"radio"+index+"-3"}>
                    <span>Correct</span>
                    <input
                        type="radio"
                        name={"radio"+index}
                        id={"radio"+index+'-3'}
                        checked={correct == 2}
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
                    required 
                    value={options[3]}
                    onChange={(e)=>{handleOptionChange(e, 3)}}
                    />
                <label htmlFor={"radio"+index+"-4"}>
                    <span >Correct</span>
                    <input 
                        type="radio" 
                        name={"radio"+index} 
                        id={"radio"+index+"-4"}  
                        checked={correct == 3}
                        onChange={(e)=>{handleRadioChange(e, 3)}}
                        hidden
                        />
                </label>
                </div>
                
        </>
    )
}