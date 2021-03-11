import { Todo, State } from './type';
import { v1 as uuid } from 'uuid';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';


// costants
const CREATE_TODO = "CREATE_TODO";
const EDIT_TODO = "EDIT_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const DELETE_TODO = "DELETE_TODO";
const SELECT_TODO = "SELECT_TODO";



// ACTION & ACTION TYPE

interface CreateTodoActionType {
    type: typeof CREATE_TODO;
    payload: Todo
}
interface EditTodoActionType {
    type: typeof EDIT_TODO;
    payload: {
        id: string,
        desc: string
    }
}
interface ToggleTodoActionType {
    type: typeof TOGGLE_TODO;
    payload: {
        id: string,
        isComplete: boolean
    }
}
interface DeleteActionTodoType {
    type: typeof DELETE_TODO,
    payload: {
        id: string
    }
}
interface SelectTodoActionType {
    type: typeof SELECT_TODO,
    payload: {
        id: string
    }
}

export const CreateTodoActionCreator = ({ desc }: {
    desc: string
}): CreateTodoActionType => {
    return {
        type: CREATE_TODO,
        payload: {
            id: uuid(),
            desc,
            isComplete: false
        }
    }
}
export const EditTodoActionCreator = ({ id, desc }: {
    desc: string,
    id: string
}): EditTodoActionType => {
    return {
        type: EDIT_TODO,
        payload: { id, desc }
    }
}
export const ToggleActionCreator = ({ id, isComplete }: {
    id: string,
    isComplete: boolean
}): ToggleTodoActionType => {
    return {
        type: TOGGLE_TODO,
        payload: { id, isComplete }
    }
}

export const DeleteActionCreator = ({ id }: { id: string }): DeleteActionTodoType => {
    return {
        type: DELETE_TODO,
        payload: { id }
    }
}

export const SelectActionCreator = ({ id }: { id: string }): SelectTodoActionType => {
    return {
        type: SELECT_TODO,
        payload: { id }
    }
}

// Reducers
const todosInitialState: Todo[] = [
    {
        id: uuid(),
        desc: "Learn React",
        isComplete: true
    },
    {
        id: uuid(),
        desc: "Learn Redux",
        isComplete: true
    },
    {
        id: uuid(),
        desc: "Learn Redux-ToolKit",
        isComplete: false
    }
];

type toDoActionTypes = CreateTodoActionType | ToggleTodoActionType | SelectTodoActionType | DeleteActionTodoType | EditTodoActionType;

const todoReducer = (
    state: Todo[] = todosInitialState,
    action: toDoActionTypes
) => {
    switch (action.type) {
        case CREATE_TODO: {
            const { payload } = action;
            return [...state, payload]
        }
        case EDIT_TODO: {
            const { payload } = action;
            const { id, desc } = payload;
            return state.map(todo => todo.id === id ? { ...todo, desc } : todo)
        }
        case TOGGLE_TODO: {
            const { payload } = action;
            const { id, isComplete } = payload;
            return state.map(todo => todo.id === id ? { ...todo, isComplete } : todo)
        }
        case DELETE_TODO: {
            const { payload } = action;
            const { id } = payload;
            return state.filter(todo => todo.id !== id);
        }
        default: {
            return state;
        }
    }
}
type SelectTodoActionTypes = SelectTodoActionType;
const selectTodoReducer = (
    state: string | null = null,
    action: SelectTodoActionTypes
) => {
    switch (action.type) {
        case SELECT_TODO:
            const { payload } = action;
            return payload.id
        default: {
            return state;
        }
    }
}
const counterReducer = (
    state: number = 0,
    action: toDoActionTypes
) => {
    switch (action.type) {
        case CREATE_TODO:
        case EDIT_TODO:
        case DELETE_TODO:
        case TOGGLE_TODO: {
            return state + 1
        } 
        default:
            return state;
    }
}

const reducers = combineReducers < State> ({
    todos: todoReducer,
    selectedTodo: selectTodoReducer,
    counter: counterReducer
})

export default createStore(reducers,
    composeWithDevTools(applyMiddleware(reduxThunk, logger))
);