import { Outlet, Route, Routes, useParams } from "react-router-dom";
import Home from "../Pages/Home";
import Header from "../Components/Header";
import Generator from "../Pages/Generator";
import Quizzer from "../Pages/Quizzer";
import Viewer from "../Pages/Viewer";
import Lookup from "../Pages/LookUp";

export default function ReactRoutes() {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {quizId} = useParams();

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
                    <Route path="quizzer">
                        <Route path=":quizId" element={<Quizzer />}/>
                    </Route>
                    <Route path="viewer" element={<Viewer />}/> 
                    <Route path="lookup" element={<Lookup />}/> 
                </Route>
                <Route path="/generator" element={<Generator />}/> 
            </Routes>
    )
}