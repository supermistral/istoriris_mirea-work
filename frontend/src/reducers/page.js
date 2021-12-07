import { UPDATE_CURRENT_BOOK } from "../actions/pageActions";


const initialState = {
    currentBook: {
        number: null
    }
};

export const pageReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CURRENT_BOOK:
            return {
                ...state,
                currentBook: action.payload
            };
    
        default:
            return state;
    }
}