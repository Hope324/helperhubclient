
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ResetPassword from './Pages/ResetPassword';
import Home from './Pages/Home';
import PaymentPage from './Pages/PaymentPage';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import About from './Pages/About';
import ContactUs from './Pages/ContactUs';
import Profile from './Pages/Profile';
import ServicesPage from './Pages/Services/Services';

import { useContext, useEffect } from 'react';
import { Context } from './index';
import axios from 'axios';
import {Toaster} from 'react-hot-toast'

import CitySelection from './Pages/PricingMap/CitySelection';

import RegistrationForm from './Pages/Register';
import SignInForm from './Pages/Login';
import ServicesDescription from './Pages/Services/ServicesDescription'
import ServiceSelection from './Pages/PricingMap/Serviceselection';
import DetailsRegardingBooking from './Pages/PricingMap/DetailsRegardingBooking'
import Admin from './Admin/Admin'
import SummaryPage from './Pages/SummaryPage';

import Sidebar from './Admin/Sidebar'
import ServiceAdmin from './Admin/ServicesAdmin'
import ServiceGrid from './Admin/ServiceGrid'
import ServiceDetailDescription from './Admin/ServiceDetailDescription'
import ServiceDetail from './Admin/ServiceDetail'
import AllServices from './Admin/AllServices';
import Location from './Admin/Location';
import UserDetails from './Admin/UserDetails';
import BasicServiceDetails from './Admin/BasicServiceDetails';
import MessageDetail from './Admin/MessageDetail';

const AdminRoute = ({ element }) => {
  const { isAuthenticated, userRole } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && userRole !== 'ADMIN') {
    return <Navigate to="/home" />;
  }

  return element;
};


function App() {
  const {setUser,setIsAuthenticated,setLoading,isAuthenticated,user,setUserRole}=useContext(Context)
  useEffect(()=>{
    setLoading(true);
    axios.get('http://localhost:4000/api/v1/userDetails',{withCredentials:true}).then(res=>{
      setUser(res.data.user);
      console.log(res.data.user)
      setIsAuthenticated(true);
      if(user.role === "admin"){
        setUserRole("ADMIN");
      }else{
        setUserRole("USER");
      }
      setLoading(false);
  }).catch((error)=>{
    console.log(error)
    setUser({});
    setIsAuthenticated(false);
    setUserRole("PUBLIC");
    setLoading(false);
  })
    
  },[isAuthenticated,setIsAuthenticated,setLoading,setUser,setUserRole,user.role])
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/home' element={<Home/>} />
          <Route path='/login' element={<SignInForm/>} />
          <Route path='/register' element={<RegistrationForm/>} />
          <Route path="/api/v1/password/reset/:token" element={<ResetPassword />} />
          <Route path="/paymentsuccess" element={<PaymentPage/>} />
          <Route path='/about' element={<About/>}/>
          <Route path='/contact' element={<ContactUs/>}/>           
          <Route path='/profile' element={<Profile/>}/>
          <Route path="/services/All services" element={<ServicesPage/>}/>
          <Route path='/location' element={<CitySelection/>}/>
          <Route path="/service/:title" element={<ServicesDescription />}/>
          <Route path='/CitySelection'  element={<CitySelection />}/>
          <Route path='/ServiceSelection' element={<ServiceSelection />}/>
          <Route path='/DetailsRegardingBooking' element= {<DetailsRegardingBooking/>}/>
          <Route path='/summary' element= {<SummaryPage/>} ></Route>
          <Route
            path="/Admin/*"
            element={
              <AdminRoute
                element={
                  <>
                    <Sidebar />
                    <Routes>
                      <Route
                        path="/"
                        element={<Admin />}
                      />
                      <Route
                        path="/service"
                        element={<ServiceAdmin />}
                      />
                      <Route
                        path="/serviceGrid"
                        element={<ServiceGrid />}
                      />
                      <Route
                        path="/additionalDetails"
                        element={<ServiceDetailDescription />}
                      />
                      <Route
                        path="/serviceDetails"
                        element={<ServiceDetail />}
                      />
                      <Route
                        path="/allServices"
                        element={<AllServices />}
                      />
                      <Route
                        path="/locations"
                        element={<Location />}
                      />
                      <Route
                        path="/user-details/user/:userId"
                        element={<UserDetails />}
                      />
                      <Route path="/serviceDetails/basicService/:id" element={<BasicServiceDetails />} />
                      <Route
                        path="/user-details/user/:userId"
                        element={<UserDetails />}
                      />
                      <Route path="/user-details/user/:userId/message/:messageId" element={<MessageDetail />} />
                    </Routes>
                    

                  </>
                }
              />
            }
          />
        </Routes>
        <Footer/>
        <Toaster/>
      </BrowserRouter>
    </div>
  );
}

export default App;
