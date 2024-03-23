import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createContext} from 'react';
import { Provider } from 'react-redux';
import store from './Redux/store';
export const Context=createContext({isAuthenticated:false});
const AppWrapper=()=>{
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [userRole, setUserRole] = useState("PUBLIC");
  const [orderId,setOrderId]=useState(null);
  const [unseenMessage,setUnseenMessage]=useState(0);


  return (
    <Context.Provider value={{isAuthenticated,setIsAuthenticated,loading,setLoading,
    user,setUser,userRole,setUserRole,orderId,setOrderId,unseenMessage,setUnseenMessage}}>
      <App />
    </Context.Provider>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <AppWrapper/>
    </Provider>
  </React.StrictMode>
);
