import { useItems } from "../../Context/ItemsContext";
import { generatorQuestion } from "../../types";
import LogoLink from "../Logo";
import NavMenu from "../Nav";
import ItemSummary from "./ItemSummary";
import FileUploader from "./Uploader";

export default function SideBar() {

    const {bulkAdd} = useItems();

    const handleFiles = (files: File[]) => {
        const newQuestions: generatorQuestion[] = [];
        files.forEach(f => {
            const q: generatorQuestion = {prompts: [{file: f, instructions: "", type: f.type.includes("audio") ? "Audio" : "Image"}], response: {type: "MC"}}
            newQuestions.push(q);
        })
        bulkAdd(newQuestions);
        console.log("files:", files)
    }
    return (
        <aside id="sideBar">
            <LogoLink tag={false}/>
            <NavMenu />
            <ItemSummary />
            <FileUploader handleFiles={handleFiles} />
        </aside>
    )
}
