import axios from 'axios';
import { API_URL, API_CMS_URL } from '../constants/global';


export const API_REQUEST = "API_REQUEST",
    API_SUCCESS = "API_SUCCESS",
    API_FAIL = "API_FAIL";


export const getBooks = () => {
    const url = API_URL + 'books/';
    return axios.get(url).then(response => response.data);
}

export const getBookInstance = (url_arg) => {
    const url = `${API_URL}books/${url_arg}/`;
    return axios.get(url).then(response => response.data); 
}

export const getSection = (url_arg, callback) => {
    return dispatch => {
        dispatch({ type: API_REQUEST });

        const url = `${API_URL}sections/${url_arg}/`;
        axios
            .get(url)
            .then(response => {
                if (typeof callback === "function") {
                    callback();
                }
                
                dispatch({
                    type: API_SUCCESS,
                    payload: response.data
                });
            })
            .catch(e => {
                dispatch({
                    type: API_FAIL,
                    payload: new Error("Request fail")
                });
            });
    }
}

export const getPosts = () => {
    return dispatch => {
        dispatch({ type: API_REQUEST });

        const url = `${API_CMS_URL}posts/`;
        axios
            .get(url)
            .then(response => {
                dispatch({
                    type: API_SUCCESS,
                    payload: response.data
                });
            })
            .catch(e => {
                dispatch({
                    type: API_FAIL,
                    payload: new Error("Request fail")
                });
            });
    }
}

export const getPostItem = (slug) => {
    return dispatch => {
        dispatch({ type: API_REQUEST });

        const url = `${API_CMS_URL}posts/${slug}/`;
        axios
            .get(url)
            .then(response => {
                dispatch({
                    type: API_SUCCESS,
                    payload: response.data
                });
            })
            .catch(e => {
                dispatch({
                    type: API_FAIL,
                    payload: new Error("Request fail")
                });
            });
    }
}

export const getAbout = () => {
    return dispatch => {
        dispatch({ type: API_REQUEST });

        const url = `${API_CMS_URL}pages/about/`;
        axios
            .get(url)
            .then(response => {
                dispatch({
                    type: API_SUCCESS,
                    payload: response.data
                });
            })
            .catch(e => {
                dispatch({
                    type: API_FAIL,
                    payload: new Error("Request fail")
                });
            });
    }
}