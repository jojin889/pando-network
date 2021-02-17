// Combine tous les reducers : root reducer
import { combineReducers } from 'redux';
import usersReducer from './users.reducer';
import userReducer from './user.reducer';
import postReducer from './post.reducer';
import errorReducer from './error.reducer';
import allPostsReducer from './allPosts.reducer';
import trendingReducer from './trending.reducer';


export default combineReducers({
    userReducer,
    usersReducer,
    postReducer,
    errorReducer,
    allPostsReducer,
    trendingReducer
});