import {applyMiddleware, createStore, compose} from "redux";

import logger from "redux-logger";
import sagaMiddlewareFactory from "redux-saga";
import promise from "redux-promise-middleware";

import reducer from "./reducers";
import saga from "./sagas";

const sagaMiddleware = sagaMiddlewareFactory();
const middleware = applyMiddleware(promise(), sagaMiddleware, logger());

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducer, composeEnhancers(middleware));

sagaMiddleware.run(saga);
