import { Outlet, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Header from "../Components/Header";
import Generator from "../Pages/Generator";
import Quizzer from "../Pages/Quizzer";
import Viewer from "../Pages/Viewer";
import Lookup from "../Pages/LookUp";
import Success from "../Pages/Success";
import QuizProvider from "../Context/QuizProvider";
import { GeneratorContextProvider } from "../Context/genContext";
import { ResponseProvider } from "../Context/responseContext";
import UserQuizzes from "../Pages/UserQuizzes";
import PageNotFound from "../Pages/PageNotFound";

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
                    <Route path="quizzer">
                        <Route path=":quizId" element={
                            <QuizProvider>
                                <ResponseProvider>
                                    <Quizzer />
                                </ResponseProvider>
                            </QuizProvider>
                        }/>
                    </Route>
                    <Route path="viewer">
                        <Route path=":quizId" element={<Viewer />} />
                    </Route> 
                    <Route path="lookup" element={<Lookup />} />
                    <Route path="users" >
                        <Route path=":userId" element={<UserQuizzes />} />
                    </Route>
                    <Route path="success">
                        <Route path=":quizId" element={<Success />} />
                    </Route>
                </Route>
                <Route path="/generator" element={
                    <GeneratorContextProvider>
                        <Generator />
                    </GeneratorContextProvider>
                }/>
                <Route path="/*" element={<PageNotFound />} /> 
            </Routes>
    )
}