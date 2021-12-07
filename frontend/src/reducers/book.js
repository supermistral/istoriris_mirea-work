import { API_REQUEST, API_SUCCESS, API_FAIL } from "../actions/bookActions";


const initialState = {
    data: {},
    isLoading: false,
    error: null
}

export const bookReducer = (state = initialState, action) => {
    switch (action.type) {
        case API_REQUEST:
            return {
                data: {},
                isLoading: true,
                error: null
            };
        case API_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: action.payload
            };
        case API_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload.message
            };
    }

    return state;
}