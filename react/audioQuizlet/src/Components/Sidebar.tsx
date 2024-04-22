import LogoLink from "./Logo";
import NavMenu from "./Nav";

export default function SideBar() {
    return (
        <aside id="sideBar">
            <LogoLink tag={false}/>
            <NavMenu />
        </aside>
    )
}