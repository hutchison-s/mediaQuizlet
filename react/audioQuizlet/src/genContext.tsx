/* eslint-disable no-case-declarations */
import { ReactNode, Dispatch, createContext, useReducer, useContext } from "react";
import { GenQuestion, GenQuiz } from "./types-new";

const initialState: GenQuiz= {
    admin: '',
    password: '',
    title: '',
    description: '',
    timeLimit: undefined,
    questions: [],
    active: 0
  };
  
  // Define the actions
  type Action =
    | { type: 'SET_ADMIN'; payload: string }
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_TITLE'; payload: string }
    | { type: 'SET_DESCRIPTION'; payload: string }
    | { type: 'SET_TIME_LIMIT'; payload: number | undefined }
    | { type: 'ADD_QUESTION'; payload: GenQuestion }
    | { type: 'ADD_MULTIPLE_QUESTIONS', payload: GenQuestion[]}
    | { type: 'UPDATE_QUESTION'; payload: GenQuestion }
    | { type: 'REMOVE_QUESTION'; payload: number }
    | { type: 'DUPLICATE_QUESTION'; payload: number }
    | { type: 'DELETE_ALL_QUESTIONS'; payload: boolean}
    | { type: 'MOVE_QUESTION_DOWN'; payload: number }
    | { type: 'MOVE_QUESTION_UP'; payload: number }
    | { type: 'INSERT_QUESTION_BEFORE'; payload: {questionId: number, targetId: number} }
    | { type: 'SET_ACTIVE'; payload: number};
  
  // Reducer function
  const quizReducer = (state: GenQuiz, action: Action): GenQuiz => {
    switch (action.type) {
        case 'ADD_QUESTION':
          return {
            ...state,
            questions: [...state.questions, action.payload],
          };
        case 'ADD_MULTIPLE_QUESTIONS':
            return {
                ...state,
                questions: [...state.questions, ...action.payload]
            };
        case 'UPDATE_QUESTION':
          return {
            ...state,
            questions: state.questions.map((q) =>
              q.id === action.payload.id ? action.payload : q
            ),
          };
        case 'REMOVE_QUESTION':
          return {
            ...state,
            questions: state.questions.filter((q) => q.id !== action.payload),
            active: state.active > 0 && state.active >= state.questions.length - 1 ? state.active - 1 : state.active
          };
        case 'DUPLICATE_QUESTION':
          const questionToDuplicate: GenQuestion | undefined = state.questions.find(
            (q) => q.id === action.payload
          );
          if (!questionToDuplicate) {
            return state;
          }
          const newQuestion: GenQuestion = {
            ...questionToDuplicate,
            id: Date.now(), // Or another unique ID generator
          };
          return {
            ...state,
            questions: [...state.questions, newQuestion],
          };
        case 'DELETE_ALL_QUESTIONS':
            if (action.payload) {
                return {
                    ...state,
                    questions: [],
                    active: 0
                };
            } else {
                return state;
            }
        case 'MOVE_QUESTION_UP':
          const indexUp = state.questions.findIndex((q) => q.id === action.payload);
          if (indexUp > 0) {
            const updatedQuestionsUp = [...state.questions];
            [updatedQuestionsUp[indexUp - 1], updatedQuestionsUp[indexUp]] = [
              updatedQuestionsUp[indexUp],
              updatedQuestionsUp[indexUp - 1],
            ];
            return { ...state, questions: updatedQuestionsUp };
          }
          return state;
        case 'MOVE_QUESTION_DOWN':
          const indexDown = state.questions.findIndex((q) => q.id === action.payload);
          if (indexDown < state.questions.length - 1) {
            const updatedQuestionsDown = [...state.questions];
            [updatedQuestionsDown[indexDown + 1], updatedQuestionsDown[indexDown]] = [
              updatedQuestionsDown[indexDown],
              updatedQuestionsDown[indexDown + 1],
            ];
            return { ...state, questions: updatedQuestionsDown };
          }
          return state;
        case 'INSERT_QUESTION_BEFORE':
          const { questionId, targetId } = action.payload;
          const indexInsert = state.questions.findIndex((q) => q.id === targetId);
          const questionToInsert = state.questions.find((q) => q.id === questionId);
          if (indexInsert !== -1 && questionToInsert) {
            const updatedQuestionsInsert = state.questions.filter((q) => q.id !== questionId);
            updatedQuestionsInsert.splice(indexInsert, 0, questionToInsert);
            return { ...state, questions: updatedQuestionsInsert };
          }
          return state;
        case 'SET_ACTIVE':
          if (action.payload < 0 || action.payload >= state.questions.length) {
            return state;
          }
          return {
            ...state,
            active: action.payload
          }
        case 'SET_ADMIN':
            return {
                ...state,
                admin: action.payload
            }
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.payload
            }
        case 'SET_DESCRIPTION':
            return {
                ...state,
                description: action.payload
            }
        case 'SET_TITLE':
            return {
                ...state,
                title: action.payload
            }
        default:
          return state;
      }
    };
  
  // Define the context and provider
  interface GeneratorProviderProps {
    children: ReactNode;
  }
  
  interface GeneratorContextType {
    state: GenQuiz;
    dispatch: Dispatch<Action>;
  }
  
  const QuizContext = createContext<GeneratorContextType | undefined>(undefined);
  
  export const GeneratorContextProvider = ({ children }: GeneratorProviderProps) => {
    const [state, dispatch] = useReducer(quizReducer, initialState);
  
    return (
      <QuizContext.Provider value={{ state, dispatch }}>
        {children}
      </QuizContext.Provider>
    );
  };
  
  // Custom hook to use the quiz context
  export const useGenerator = (): GeneratorContextType => {
    const context = useContext(QuizContext);
    if (context === undefined) {
      throw new Error('useQuizContext must be used within a GeneratorContextProvider');
    }
    return context;
  };