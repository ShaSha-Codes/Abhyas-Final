import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {BrowserRouter} from "react-router-dom"
import {configureStore,combineReducers} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import {persistReducer,persistStore} from 'redux-persist'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import userReducer from './features/user'


const persistConfig={
  key:'root',
  version:1,
  storage
}

const reducer=combineReducers({
  user:userReducer,
})

const persistedReducer=persistReducer(persistConfig,reducer)


const store=configureStore({
  reducer:persistedReducer
})

let persistor=persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
