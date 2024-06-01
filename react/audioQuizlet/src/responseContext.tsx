/* eslint-disable no-case-declarations */
import { Dispatch, PropsWithChildren, createContext, useContext, useReducer } from "react"
import { ResponseAction, userResponse } from "./types-new"

import { useQuiz } from "./Context/QuizContext"



const responseReducer = (state: userResponse, action: ResponseAction): userResponse => {
  switch(action.type) {
      case 'INITIALIZE':
          if (!state.questions || !state.quizId) {
              return state;
          }
          return {
              ...state,
              ...action.payload,
              answers: new Array(state.questions.length).fill({answer: '', score: 0})
          }
      case 'UPDATE_ANSWER':
          if (!state.answers || !state.questions) {
              return state;
          }
          const index = state.questions?.findIndex(q => q.id === action.payload.id);
          if (index === -1) {
              return state;
          }
          return {
              ...state,
              answers: state.answers.map((a, i) => i === index ? action.payload.answer : a)
          }
      case 'UPDATE_MANY':
          if (!state.answers || !state.questions) {
            return state;
          }
          const newAnswers = [...state.answers];
          for (const needsUpdating of action.payload) {
            const index = state.questions?.findIndex(q => q.id === needsUpdating.id);
            if (index === -1) {
                continue;
            }
            newAnswers.map((a, i) => i === index ? needsUpdating.answer : a);
          }
          return {
            ...state,
            answers: newAnswers
          }

      case 'PRE-SUBMIT':
          return {
              ...state,
              ...action.payload
          }
      default:
          return state;
  }
}

interface ResponseContextType {
    state: userResponse;
    dispatch: Dispatch<ResponseAction>;
}

const ResponseContext = createContext<ResponseContextType | undefined>(undefined);

export const ResponseProvider = ({children}: PropsWithChildren) => {

    const {questions, quizId} = useQuiz();
    const initialState: userResponse = {
        quizId: quizId,
        questions: questions,
        timeLimit: null
    }

    const [state, dispatch] = useReducer(responseReducer, initialState);

    return (
        <ResponseContext.Provider value={{state, dispatch}}>
            {children}
        </ResponseContext.Provider>
    )
}

export const useResponse = ()=>{
    const context = useContext(ResponseContext);
    if (context === undefined) {
        throw new Error('useResponse must be used within a ResponseContextProvider');
      }
    return context;
}
