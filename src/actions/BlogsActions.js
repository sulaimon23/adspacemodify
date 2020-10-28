import {
    BLOGS_FETCH_FAILED,
    BLOGS_FETCH_SUCCESS,
    BLOGS_FETCH
} from "./type";
import {getDb} from "../firebase";

export const getBlogs = () => {
    return async (dispatch) => {
        dispatch({ type: BLOGS_FETCH });
        try{
            let blog = {}, blogs = [];
            let blogsSnapshot = await getDb().collection("blogs").orderBy("created_at", "desc").get();
            blogsSnapshot.forEach(doc => {
                blog = doc.data();
                blog["id"] = doc.id;
                blogs.push(blog);
            });

            return dispatch({ type: BLOGS_FETCH_SUCCESS, payload: blogs });
        }
        catch (e) {
            console.log(e);
            return dispatch({ type: BLOGS_FETCH_FAILED, payload: ''})
        }
    }
};