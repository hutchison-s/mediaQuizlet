import { PropsWithChildren, useState } from "react";
import { generatorQuestion, qType } from "../types";
import { ItemsContext } from "./ItemsContext";



export function ItemsProvider({children}: PropsWithChildren) {
    const [items, setItems] = useState<generatorQuestion[]>([])
    const [active, setActive] = useState(0)

    const addItem = (t: qType) => {
        setItems(prevItems => {
            const newItem: generatorQuestion = {
            prompts: [],
            response: {type: t}
        }
        const updatedItems = [...prevItems, newItem];
        setActive(updatedItems.length-1)
        return updatedItems;
        })
        
    }

    const deleteItem = (index: number) => {
        if (index < 0 || index >= items.length) {
            return;
        }
        setItems(prevItems=>{
            const oldItems = [...prevItems];
            oldItems.splice(index, 1);
            const updatedItems = oldItems.length > 0 ? oldItems : [];
            setActive(Math.min(index, updatedItems.length - 1));
            return updatedItems;
        })
    }

    const updateItems = (index: number, item: generatorQuestion) => {
        if (index < 0 || index >= items.length) {
            console.error("Invalid index for updateItems");
            return;
        }
        setItems(prevItems => {
            const oldItems = [...prevItems];
            oldItems.splice(index, 1, item);
            return oldItems;
        });
    }

    return (
        <ItemsContext.Provider value={{items, addItem, deleteItem, updateItems, active, setActive}}>
            {children}
        </ItemsContext.Provider>
    )
}
