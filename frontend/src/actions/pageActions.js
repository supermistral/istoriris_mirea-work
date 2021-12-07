export const UPDATE_CURRENT_BOOK = 'UPDATE_CURRENT_BOOK';


export const updateCurrentBook = (bookData) => {
    return dispatch => {
        dispatch({
            type: UPDATE_CURRENT_BOOK,
            payload: bookData
        });
    }
}