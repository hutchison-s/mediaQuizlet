import { Outlet, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Header from "../Components/Header";
import Generator from "../Pages/Generator";
import Quizzer from "../Pages/Quizzer";
import Viewer from "../Pages/Viewer";
import Lookup from "../Pages/LookUp";

export default function ReactRoutes() {

    function Frame() {
        return (
            <>
                <Header />
                <Outlet />
            </>
        )
    }

    return (
            <Routes>
                <Route path="/" element={<Frame />}>
                    <Route index element={<Home />}/>
                    <Route path="generator" element={<Generator />}/> 
                    <Route path="quizzer" element={<Quizzer />}/> 
                    <Route path="viewer" element={<Viewer />}/> 
                    <Route path="lookup" element={<Lookup />}/> 
                </Route>
            </Routes>
    )
}