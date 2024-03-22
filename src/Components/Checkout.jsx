import axios from "axios";
const checkoutHandler=async(amount)=>{
    
    try {
      const {data:{key}}=await axios.get("http://localhost:4000/getKey");
      const {data:{order}}=await axios.post("http://localhost:4000/api/v1/checkout",{amount},{withCredentials:true})
      var options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: order.currency,
        name: "HelperHub",
        description: "Transaction amount for required service",
        image: "/ImagesFiles/HelperHub/Logo.jpg",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "http://localhost:4000/api/v1/paymentVerification",
        prefill: {
            name: "Sourav Kumar Sinha",
            email: "sourav9934413639@gmail.com",
            contact: "7488164548"
        },
        notes: {
            address: "Razorpay Corporate Office"
        },
        theme: {
            color: "#427D9D"
        }
    };
    const razor = new window.Razorpay(options);
    razor.open();
    console.log(options)
   }
    catch (error) {
      console.log(error)
    }
  }
  export default checkoutHandler;