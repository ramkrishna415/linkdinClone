import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"
import postReducer from "./reducer/postReducer"


/**
 * steps for state manegement
 * submit action
 * handle action in its reducer
 * register here -> reducer
 */
export const store = configureStore({
    reducer:{
        auth: authReducer,
        post: postReducer
    }
})

