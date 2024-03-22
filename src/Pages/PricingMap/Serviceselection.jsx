
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../../Components/Loader";

const ServiceSelection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Title } = useSelector((state) => state.serviceReducer);
  const [selectedGender, setSelectedGender] = useState("Male");
  const [totalPrice, setTotalPrice] = useState(0);
  const [basicServicePay, setBasicServicePay] = useState({});
  const [basicPayAdded, setBasicPayAdded] = useState(false);
  const [addOns, setAddOns] = useState({});
  const [getDetails,setGetDetails] = useState({});
  const [loading,setLoading]=useState(true);

  const fetchServiceByTitle = useCallback(async () => {
    try {
      const {data} = await axios.post("http://localhost:4000/api/v1/selectService/title",{title:Title});
      setGetDetails(data.particularServiceDetail);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  },[Title])

  useEffect(() => {
    dispatch({ type: 'basicPayObj', payload: basicServicePay });
    dispatch({ type: 'addOnsObj', payload: addOns });
    fetchServiceByTitle();
  }, [basicServicePay, addOns, dispatch,fetchServiceByTitle]);

  const moveNext = () => {
    if (!basicPayAdded) {
      toast.error("Please avail basic service to move further");
      return;
    } else {
      dispatch({ type: "addGenderAndAmount", payload: { Gender: selectedGender, TotalPrice: Number(totalPrice) } });
      navigate("/DetailsRegardingBooking");
    }
  };

  const handleServiceSelection = (mainHeading, price) => {
    if (Object.keys(basicServicePay).length !== 0) {
      setBasicPayAdded(false);
      const updatedBasePay = { ...basicServicePay };
      delete updatedBasePay[mainHeading];
      console.log(updatedBasePay);
      setBasicServicePay(updatedBasePay);
      setAddOns({});
      dispatch({ type: 'removeBasicPay', payload: mainHeading });
      setTotalPrice(0);
    } else {
      setBasicPayAdded(true);
      const numOfAddons=getDetails?.servicesInfo?.addonsData.length;
       if (numOfAddons !==0){
         toast.success("You may avail addOns also");
       }
      setBasicServicePay((prevBasicPay) => {
        const updatedBasicPay = { ...prevBasicPay, [mainHeading]: Number(price) };
        console.log(updatedBasicPay);
        dispatch({ type: "basicPay", payload: updatedBasicPay });
        return updatedBasicPay;
      });
      setTotalPrice((prev) => {
        const updatedPrice = prev + Number(price);
        console.log(updatedPrice);
        return updatedPrice;
      });
    }
  };

  const sumUp = (heading, extraCharge) => {
    if (!basicPayAdded) {
      return;
    }
    if (addOns[heading]) {
      const updatedAddOns = { ...addOns };
      delete updatedAddOns[heading];
      console.log(updatedAddOns);
      setAddOns(updatedAddOns);
      setTotalPrice((prevPrice) => {
        console.log(prevPrice - Number(extraCharge));
        return prevPrice - Number(extraCharge);
      });
    } else {
      setTotalPrice((prev) => {
        const updatedPrice = prev + Number(extraCharge);
        console.log(updatedPrice);
        return updatedPrice;
      });
      setAddOns((prevAddOn) => {
        const updatedAddOns = { ...prevAddOn, [heading]: Number(extraCharge) };
        console.log(updatedAddOns);
        return updatedAddOns;
      });
    }
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event.target.value);
  };


  if (loading) return <Loader/>

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Select Service
      </Typography>

      <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Gender
        </Typography>
        <RadioGroup
          row
          aria-label="gender"
          name="gender"
          value={selectedGender}
          onChange={handleGenderChange}
        >
          <FormControlLabel
            key="male"
            value="Male"
            control={<Radio />}
            label="Male"
          />
          <FormControlLabel
            key="female"
            value="Female"
            control={<Radio />}
            label="Female"
          />
          <FormControlLabel
            key="other"
            value="Other"
            control={<Radio />}
            label="Other"
          />
        </RadioGroup>
      </FormControl>

      <Typography variant="h5" marginTop={1}>
        {Title}
      </Typography>

      <Card
        sx={{
          height: "100%",
          display: "flex",
          borderRadius: "1rem",
          marginBottom: "1rem",
        }}
      >
        <img
          src={`/ImagesFiles/${Title}/BasicService/${getDetails?.servicesInfo?.serviceData?.imgName}.jpg`}
          alt="Service"
          style={{
            width: "20%",
            objectFit: "cover",
            margin: "1rem",
            borderRadius: "1rem",
          }}
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {getDetails?.servicesInfo?.serviceData?.header}
            </Typography>
            <Typography variant="h6">
              Price: Rs{getDetails?.servicesInfo?.serviceData?.price}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {getDetails?.servicesInfo?.serviceData?.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {getDetails?.servicesInfo?.serviceData?.description2}
            </Typography>
          </div>
          <CardActions sx={{ alignSelf: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                borderRadius: "50%",
                minWidth: "3rem",
                padding: "0.5rem",
                background: "black",
              }}
              onClick={() =>
                handleServiceSelection(
                  getDetails?.servicesInfo?.serviceData?.header,
                  getDetails?.servicesInfo?.serviceData?.price
                )
              }
            >
              <Typography
                variant="h6"
                style={{ color: "white", borderColor: "white" }}
              >
                {Object.keys(basicServicePay).length !== 0 ? "-" : "+"}
              </Typography>
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      {getDetails?.servicesInfo?.addonsData && getDetails?.servicesInfo?.addonsData.length !==0  && (<Typography variant="h5" marginTop={2} fontWeight={"bold"}>
        Add-Ons
      </Typography>)}
      {getDetails?.servicesInfo?.addonsData && getDetails?.servicesInfo?.addonsData?.length !==0 &&
      getDetails?.servicesInfo?.addonsData.map((addon, index) => (
        <Card
          key={index}
          sx={{
            height: "100%",
            display: "flex",
            width: "100%",
            borderRadius: "1rem",
            marginBottom: "1rem",
            marginRight: "1rem",
          }}
        >
          <img
            src={`/ImagesFiles/${Title}/AddOns/${addon.imgName}.jpg`}
            alt={`Addon`}
            style={{
              width: "20%",
              objectFit: "cover",
              margin: "1rem",
              borderRadius: "1rem",
            }}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {addon.header}
              </Typography>
              <Typography variant="h6">Price: Rs{addon.price}</Typography>
              <Typography variant="body2" color="textSecondary">
                {addon.description}
              </Typography>
            </div>
            <CardActions sx={{ alignSelf: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  borderRadius: "50%",
                  minWidth: "3rem",
                  padding: "0.5rem",
                  background: "black",
                  opacity: !basicPayAdded ? 0.5 : 1,
                }}
                disabled={!basicPayAdded}
                onClick={() => sumUp(addon.header, addon.price)}
              >
                <Typography
                  variant="h6"
                  style={{ color: "white", borderColor: "white" }}
                >
                  {addOns[addon.header] ? "-" : "+"}
                </Typography>
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      ))}
      <Box m={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          style={{ opacity: !basicPayAdded ? 0.5 : 1 }}
          onClick={moveNext}
        >
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default ServiceSelection;

