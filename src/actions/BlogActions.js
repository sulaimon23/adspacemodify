import {
    BLOG_FETCH, BLOG_FETCH_FAILED,
    BLOG_FETCH_SUCCESS, BLOG_SET_BLOG
} from "./type";
import {getDb} from "../firebase";

export const setBlogObject = (blog) => {
    return { type: BLOG_SET_BLOG, payload: blog };
};

export const getBlog = (id) => {
    return async (dispatch) => {
        dispatch({ type: BLOG_FETCH });
        try{
           let blogSnapshot = await getDb().collection("blogs").doc(id).get();
           let blog = blogSnapshot.data();
           blog["id"] = blogSnapshot.id;
           return dispatch({ type: BLOG_FETCH_SUCCESS, payload: blog });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: BLOG_FETCH_FAILED, payload: "" });
        }
    }
};
