
import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Loader from '../../Components/Loader';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DetailsRegardingBooking = () => {
  const { Title } = useSelector(state => state.serviceReducer);
  const dispatch = useDispatch();
  const [serviceOptions, setServiceOptions] = useState([]);
  const [queryAnswered, setQueryAnswered] = useState(0);
  const [getExtraDetails, setGetExtraDetails] = useState(null);
  const [loading,setLoading]=useState(true);

  const navigate = useNavigate();
  const fetchAdditionalDetails = useCallback(async () => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/v1/additionalDetail/title", { title: Title });
      setGetExtraDetails(data.particularAdditionalInfo);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  },[Title])
  useEffect(() => {
    fetchAdditionalDetails();
  }, [fetchAdditionalDetails]);

 

  const convertArrayToObject = (array) => {
    return array.reduce((result, currentObject) => {
      return { ...result, ...currentObject };
    }, {});
  };

  const handleSubmit = (totalQuery) => {
    if (queryAnswered !== totalQuery) {
      toast.error("Fill all fields...");
      return;
    }

    const singleObject = convertArrayToObject(serviceOptions);
    dispatch({ type: "addOtherServiceOptions", payload: singleObject });
    navigate("/summary");
  };

  const handleOptionClick = (heading, label) => {
    const isAlreadySelected = serviceOptions.some(option => Object.keys(option)[0] === heading);
    let updatedOptions;
    if (isAlreadySelected) {
      updatedOptions = serviceOptions.map(option => {
        if (Object.keys(option)[0] === heading) {
          return { [heading]: label };
        }
        return option;
      });
    } else {
      updatedOptions = [...serviceOptions, { [heading]: label }];
      setQueryAnswered(queryAnswered + 1);
    }
    setServiceOptions(updatedOptions);
  };

  const renderData = (section) => {
    if (!section) {
      return null;
    }

    const noOfQueries = section?.subsections.length;

    return (
      <div key={section.title}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {section?.title}
        </Typography>
        {section?.subsections.map((subsection, subIndex) => (
          <div key={subIndex}>
            <Typography variant="h6" gutterBottom>
              {subsection?.heading}
            </Typography>
            {subsection?.subHeading && (
              <Typography variant="body2" color="textSecondary">
                {subsection?.subHeading}
              </Typography>
            )}
            {subsection?.data && (
              <div style={{ display: 'flex', marginTop: '20px' }}>
                {subsection?.data.map((button, buttonIndex) => (
                  <Button
                    key={buttonIndex}
                    variant="text"
                    color="primary"
                    onClick={() => handleOptionClick(subsection?.heading, button?.label)}
                    style={{
                      border: '2px solid black',
                      borderColor: '#e7e7e7',
                      marginBottom: '1rem',
                      backgroundColor: serviceOptions.some(option => option[subsection?.heading] === button?.label) ? 'rgb(0,0,0)' : 'white',
                      color: serviceOptions.some(option => option[subsection?.heading] === button?.label) ? 'white' : '#454545'
                    }}
                  >
                    {button?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: '20px', opacity: (noOfQueries !== queryAnswered) ? 0.5 : 1 }}
          onClick={() => handleSubmit(noOfQueries)}
        >
          Proceed
        </Button>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ padding: '20px' }}>
      {getExtraDetails && renderData(getExtraDetails)}
    </div>
  );
};

export default DetailsRegardingBooking;



