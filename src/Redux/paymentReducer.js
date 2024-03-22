import { createReducer } from "@reduxjs/toolkit/dist";

const initialState = {
  cardName: "",
  cardNumber: "",
  expiryDate: "",
  cvv: "",
};

export const paymentReducer = createReducer(initialState, {
  SET_PAYMENT_INFO: (state, action) => {
    state.cardName = action.payload.cardName;
    state.cardNumber = action.payload.cardNumber;
    state.expiryDate = action.payload.expiryDate;
    state.cvv = action.payload.cvv;
  },
  CLEAR_PAYMENT_INFO: (state) => {
    state.cardName = "";
    state.cardNumber = "";
    state.expiryDate = "";
    state.cvv = "";
  },
});
export const setPaymentInfo = (paymentInfo) => ({
    type: "SET_PAYMENT_INFO",
    payload: paymentInfo,
  });
  
  export const clearPaymentInfo = () => ({
    type: "CLEAR_PAYMENT_INFO",
  });
