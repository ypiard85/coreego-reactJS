import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
//Redux
import {applyMiddleware, createStore} from 'redux';
import {allReducers} from './reducer/allReducer';
import { Provider } from 'react-redux';
import logger from 'redux-logger'

const store = createStore(allReducers, {}, applyMiddleware(logger));

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
