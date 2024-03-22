import { createReducer } from "@reduxjs/toolkit/dist";
const initialState={};
export const serviceReducer=createReducer(initialState,{
  addTitleFromMenu:(state,action)=>{
    const {key,value}=action.payload;
    return {
        [key]:value
    }
  },
  addLocation:(state,action)=>{
    const {key,value}=action.payload;
    return {
        ...state,
        [key]: value
      };
  
  },
  addGenderAndAmount:(state,action)=>{
    
    return {
        ...state,
        ...action.payload
    }
  },
  basicPay:(state,action)=>{
    const basicPay=action.payload;
    return {
      ...state,
      basicPay
    }
  },
  removeBasicPay: (state, action) => {
    const toRemove = action.payload;
    const newBasicPay = { ...state.basicPay };
    delete newBasicPay[toRemove];
    return {
      ...state,
      basicPay: newBasicPay
    };
  },
  addOnsObj:(state,action)=>{
    const addOns=action.payload;
    return {
      ...state,
      addOns
    }
  },
  addOtherServiceOptions:(state,action)=>{
    const obj=action.payload;
    
    return {
        ...state,
        obj
    }
  },
 
})
