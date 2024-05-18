import { PropsWithChildren, useState } from "react";
import { generatorQuestion, qType } from "../types";
import { ItemsContext } from "./ItemsContext";



export function ItemsProvider({children}: PropsWithChildren) {
    const [items, setItems] = useState<generatorQuestion[]>([])
    const [active, setActive] = useState(0)

    const addItem = (t: qType) => {
        console.log("adding...");
        setItems(prevItems => {
            const newItem: generatorQuestion = {
            prompts: [],
            response: {type: t},
            pointValue: 1
        }
        const updatedItems = [...prevItems, newItem];
        setActive(updatedItems.length-1)
        return updatedItems;
        })
    }

    const duplicateItem = (index: number)=>{
        console.log("duplicating...");
        
        setItems(prevItems => {
            const newItems = [...prevItems];
            const toCopy = newItems[index];
            const copy = deepCopy<generatorQuestion>(toCopy);
            console.log("copied item",copy)
            newItems.splice(index+1, 0, copy);
            console.log("new items list", newItems)
            setActive(index+1);
            return newItems;
        })
    }

    const bulkAdd = (questions: generatorQuestion[]) => {
        console.log("bulk adding...")
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
        console.log("shifting...");
        
        setItems(prevItems => {
            const newItems = [...prevItems];
            const x = deepCopy(newItems.splice(xIndex, 1)[0]);
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
        console.log("swapping...");
        
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
        console.log("deleting...");
        
        setItems(prevItems=>{
            const oldItems = [...prevItems];
            oldItems.splice(index, 1);
            const updatedItems = oldItems.length > 0 ? oldItems : [];
            setActive(Math.min(index, updatedItems.length - 1));
            return updatedItems;
        })
    }

    const clearItems = ()=>{
        console.log("clearing...");
        
        setItems([]);
        setActive(0);
    }

    const updateItems = (index: number, item: generatorQuestion) => {
        if (index < 0 || index >= items.length) {
            console.error("Invalid index for updateItems");
            return;
        }
        console.log("updating...");
        console.trace()
        
        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems.splice(index, 1, item);
            return updatedItems;
        });
    }

    function deepCopy<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
    
        // Handle Date
        if (obj instanceof Date) {
            return new Date(obj.getTime()) as unknown as T;
        }
    
        // Handle Array
        if (Array.isArray(obj)) {
            return obj.map((item) => deepCopy(item)) as unknown as T;
        }
    
        // Handle File
        if (obj instanceof File) {
            return new File([obj], obj.name, { type: obj.type, lastModified: obj.lastModified }) as unknown as T;
        }
    
        // Handle Object
        const copiedObj: { [key: string]: unknown } = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copiedObj[key] = deepCopy((obj as { [key: string]: unknown })[key]);
            }
        }
        return copiedObj as T;
    }
    
    
      

    return (
        <ItemsContext.Provider 
            value={{
                items,
                addItem,
                duplicateItem, 
                bulkAdd, 
                shiftItems, 
                swapPositions, 
                deleteItem, 
                clearItems, 
                updateItems, 
                active, 
                setActive
            }}
        >
            {children}
        </ItemsContext.Provider>
    )
}
