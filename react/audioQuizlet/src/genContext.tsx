/* eslint-disable no-case-declarations */
import { Dispatch, createContext, useReducer, useContext, PropsWithChildren } from "react";
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
    | { type: 'INSERT_QUESTION_BEFORE'; payload: {questionId: number, targetIndex: number} }
    | { type: 'SET_ACTIVE'; payload: number};
  
  // Reducer function
  const quizReducer = (state: GenQuiz, action: Action): GenQuiz => {
    switch (action.type) {
        case 'ADD_QUESTION':
            console.log("adding question...", action.payload);
            
          return {
            ...state,
            questions: [...state.questions, action.payload],
            active: state.questions.length
          };
        case 'ADD_MULTIPLE_QUESTIONS':
            return {
                ...state,
                questions: [...state.questions, ...action.payload],
                active: state.questions.length + action.payload.length - 1
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
          const newQuestion = {...deepCopy(questionToDuplicate), id: Date.now()};
          return {
            ...state,
            questions: [...state.questions, newQuestion],
            active: state.active + 1
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
            return { ...state, questions: updatedQuestionsUp, active: state.active - 1 };
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
            return { ...state, questions: updatedQuestionsDown, active: state.active + 1 };
          }
          return state;
        case 'INSERT_QUESTION_BEFORE':
          const { questionId, targetIndex } = action.payload;
          const questionToInsert = state.questions.find((q) => q.id === questionId);
          if (targetIndex >= 0 && targetIndex < state.questions.length && questionToInsert) {
            const updatedQuestionsInsert = state.questions.filter((q) => q.id !== questionId);
            updatedQuestionsInsert.splice(targetIndex, 0, questionToInsert);
            return { ...state, questions: updatedQuestionsInsert, active: targetIndex };
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
        case 'SET_TIME_LIMIT':
            return {
                ...state,
                timeLimit: action.payload
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
  
  // Define the context and provider
  
  interface GeneratorContextType {
    state: GenQuiz;
    dispatch: Dispatch<Action>;
  }
  
  const QuizContext = createContext<GeneratorContextType | undefined>(undefined);
  
  export const GeneratorContextProvider = ({ children }: PropsWithChildren) => {
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