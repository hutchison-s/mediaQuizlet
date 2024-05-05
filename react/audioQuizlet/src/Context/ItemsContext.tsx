import { createContext, useContext } from "react";
import { generatorQuestion, qType } from "../types";

interface ItemsContextType {
    items: generatorQuestion[],
    addItem: (t: qType)=>void,
    updateItems: (index: number, item: generatorQuestion)=>void,
    active: number,
    setActive: (x: number)=>void
}

export const ItemsContext = createContext<ItemsContextType>({items: [], addItem: ()=>{}, updateItems:(x,y)=>{console.log(x,y)}, active: 0, setActive:(x)=>{console.log(x)}});
export const useItems = ()=>useContext(ItemsContext);