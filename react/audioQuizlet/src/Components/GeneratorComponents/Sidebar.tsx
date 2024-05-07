import { useItems } from "../../Context/ItemsContext";
import LogoLink from "../Logo";
import NavMenu from "../Nav";

export default function SideBar() {

    const {items, active, setActive} = useItems();

    return (
        <aside id="sideBar">
            <LogoLink tag={false}/>
            <NavMenu />
            <div className="itemSummary">
                {items.map((item, index)=>
                    <div 
                        className={active == index ? "active sideItem": "sideItem"} 
                        key={index} 
                        onClick={()=>{setActive(index)}}
                    >
                        Question {index+1}
                    </div>)}
            </div>
        </aside>
    )
}