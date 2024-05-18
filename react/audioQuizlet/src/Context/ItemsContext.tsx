import { createContext, useContext } from "react";
import { generatorQuestion, qType } from "../types";

interface ItemsContextType {
    items: generatorQuestion[],
    addItem: (t: qType)=>void,
    duplicateItem: (index: number)=>void,
    bulkAdd: (questions: generatorQuestion[]) => void,
    shiftItems: (xIndex: number, yIndex: number) => void,
    swapPositions: (xIndex: number, yIndex: number) => void,
    deleteItem: (index: number)=>void,
    clearItems: ()=>void,
    updateItems: (index: number, item: generatorQuestion)=>void,
    active: number,
    setActive: (x: number)=>void
}

export const ItemsContext = createContext<ItemsContextType>({
    items: [],
    addItem: ()=>{},
    duplicateItem: (index: number)=>{console.log(index)}, 
    bulkAdd: (questions)=>{console.log(questions)},
    shiftItems: (x, y)=>{console.log(x, y)}, 
    swapPositions: (x, y)=>{console.log(x, y)}, 
    deleteItem: (x)=>{console.log(x)}, 
    clearItems: ()=>{console.log("cleared")},
    updateItems:(x,y)=>{console.log(x,y)}, 
    active: 0, 
    setActive:(x)=>{console.log(x)}});
    
export const useItems = ()=>useContext(ItemsContext);