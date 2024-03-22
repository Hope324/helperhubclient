import { configureStore } from "@reduxjs/toolkit/dist";
import {serviceReducer} from './serviceReducer.js';
import {paymentReducer} from './paymentReducer.js';
const store=configureStore({
    reducer:{
        serviceReducer,
        paymentReducer
    }
})
export default store;
