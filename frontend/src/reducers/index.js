import { combineReducers } from 'redux';
import { bookReducer } from './book';
import { pageReducer } from './page';


export const rootReducer = combineReducers({
    page: pageReducer,
    book: bookReducer,
});