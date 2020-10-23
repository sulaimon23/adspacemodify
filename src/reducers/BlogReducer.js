import {BLOG_FETCH, BLOG_FETCH_FAILED, BLOG_FETCH_SUCCESS, BLOG_SET_BLOG} from "../actions/type";

const INITIAL_STATE = {
    loading: false,
    error: false,
    message: '',
    blogObject: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BLOG_FETCH:
            return { ...state, loading: true, error: false, message: '' };
        case BLOG_FETCH_SUCCESS:
            return { ...state, loading: false, error: false, message: '', blogObject: action.payload };
        case BLOG_FETCH_FAILED:
            return { ...state, loading: false, error: false, message: action.payload };
        case BLOG_SET_BLOG:
            return { ...state, loading: false, error: false, message: '', blogObject: action.payload };
        default:
            return state;
    }
}