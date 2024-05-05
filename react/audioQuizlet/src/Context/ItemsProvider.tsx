import { PropsWithChildren, useState } from "react";
import { generatorQuestion, qType } from "../types";
import { ItemsContext } from "./ItemsContext";



export function ItemsProvider({children}: PropsWithChildren) {
    const [items, setItems] = useState<generatorQuestion[]>([])
    const [active, setActive] = useState(0)

    const addItem = (t: qType) => {
        const newItem: generatorQuestion = {
            prompts: [{file: null, instructions: ""}],
            response: {type: t}
        }
        setItems([...items, newItem]);
    }

    const updateItems = (index: number, item: generatorQuestion) => {
        const oldItems = [...items];
        oldItems[index] = item;
        setItems(oldItems);
    }


    return (
        <ItemsContext.Provider value={{items, addItem, updateItems, active, setActive}}>
            {children}
        </ItemsContext.Provider>
    )
}
