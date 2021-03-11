import { createSlice, PayloadAction, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { v1 as uuid } from 'uuid';
import logger from 'redux-logger';

import { Todo, State } from './type';

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

const todosSlice = createSlice({
    name: 'todos',
    initialState: todosInitialState,
    reducers: {
        // create: (state, {payload}: PayloadAction<{desc: string}> ) => {
        //     const { desc} = payload;
        //     const newElement = {
        //         id : uuid(),
        //         desc, 
        //         isComplete : false
        //     }
        //     state.push(newElement);
        // DO NOT DO THIS SINCE REDUCERS HAVE TO BE PURE
        // },
        create: {
            prepare: ({ desc }: { desc: string }) => ({
                payload: {
                    id: uuid(),
                    desc: desc,
                    isComplete: false
                }
            }),
            reducer: (state, { payload }: PayloadAction<Todo>) => {
                state.push(payload);
            }
        },
        edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
            const elementToEdit = state.find(e => e.id === payload.id);
            if (elementToEdit) {
                elementToEdit.desc = payload.desc
            }
        },
        toggle: (state, { payload }: PayloadAction<{ id: string; isComplete: boolean }>) => {
            const elementToToggle = state.find(e => e.id === payload.id);
            if (elementToToggle) {
                elementToToggle.isComplete = payload.isComplete
            }
        },
        remove: (state, { payload }: PayloadAction<{ id: string }>) => {
            const indexOfElementToDelete = state.findIndex(e => e.id === payload.id);
            if (indexOfElementToDelete !== -1) {
                const numberOfElementToDelete = 1
                state.splice(indexOfElementToDelete, numberOfElementToDelete);
            }
        }
    }
})

const selectedTodoSlice = createSlice({
    name: 'selectedTodo',
    initialState: null as string | null,
    reducers: {
        select: (state, { payload }: PayloadAction<{ id: string }>) => {
            return payload.id
        }
    }
})

const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {},
    extraReducers: {
        [todosSlice.actions.create.type]: state => state + 1,
        [todosSlice.actions.edit.type]: state => state + 1,
        [todosSlice.actions.remove.type]: state => state + 1,
        [todosSlice.actions.toggle.type]: state => state + 1    }
})

export const {
    create: CreateTodoActionCreator,
    edit: EditTodoActionCreator,
    toggle: ToggleTodoActionCreator,
    remove: DeleteTodoActionCreator
} = todosSlice.actions;

export const {
    select: SelecTodoActionCreator
} = selectedTodoSlice.actions

const reducer = {
    todos: todosSlice.reducer,
    selectedTodo: selectedTodoSlice.reducer,
    counter: counterSlice.reducer
}

const middleware = [...getDefaultMiddleware(), logger]

export default configureStore({
    reducer,
    middleware,
});