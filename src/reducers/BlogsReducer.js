import {BLOGS_FETCH, BLOGS_FETCH_FAILED, BLOGS_FETCH_SUCCESS} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    blogsArray: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BLOGS_FETCH:
            return { ...state, loading: true, error: false, message: '' };
        case BLOGS_FETCH_SUCCESS:
            return { ...state, loading: false, error: false, message: '', blogsArray: action.payload || []};
        case BLOGS_FETCH_FAILED:
            return { ...state, loading: false, error: true, message: action.payload };
        default:
            return state;
    }
};