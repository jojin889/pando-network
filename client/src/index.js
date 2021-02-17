import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './styles/index.scss';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { getUsers } from './actions/users.action';

// dev tools pour redux

//lui c'est dans l'extension chrome
import { composeWithDevTools,  } from 'redux-devtools-extension';
import { getPosts } from './actions/post.action';
// lui c'est dans la console
// import logger from 'redux-logger';


const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(thunk))
)

store.dispatch(getUsers())
store.dispatch(getPosts())


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);