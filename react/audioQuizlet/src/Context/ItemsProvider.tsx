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

    const bulkAdd = (questions: generatorQuestion[]) => {
        setItems(prevItems => {
            const newItems = [...prevItems, ...questions];
            setActive(newItems.length - 1)
            return newItems
        })
    }

    const shiftItems = (xIndex: number, yIndex: number) => {
        if (xIndex < 0 || yIndex < 0 || xIndex >= items.length || yIndex >= items.length) {
            console.log("Error: Invalid indeces passed: ", xIndex, yIndex);
            return;
        }
        setItems(prevItems => {
        const newItems = [...prevItems];
        const x = newItems.splice(xIndex, 1)[0];
        newItems.splice(yIndex, 0, x);
        setActive(yIndex);
        return newItems;
        })
    }

    const swapPositions = (xIndex: number, yIndex: number) => {
        if (xIndex < 0 || yIndex < 0 || xIndex >= items.length || yIndex >= items.length) {
            console.log("Error: Invalid indeces passed: ", xIndex, yIndex);
            return;
        }
        setItems(prevItems => {
            const newItems = [...prevItems];
            const x = newItems[xIndex];
            newItems[xIndex] = newItems[yIndex];
            newItems[yIndex] = x;
            return newItems;
        })
        setActive(yIndex);
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

    const clearItems = ()=>{
        setItems([]);
        setActive(0);
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
        <ItemsContext.Provider value={{items, addItem, bulkAdd, shiftItems, swapPositions, deleteItem, clearItems, updateItems, active, setActive}}>
            {children}
        </ItemsContext.Provider>
    )
}
