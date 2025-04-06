import axios from 'axios';
import React, { useState } from 'react'
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBRow,
  MDBCol
}
  from 'mdb-react-ui-kit';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ResendVerificationToken() {
  const [formData, setFormData] = useState({
    email: ''
  })
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    }
    if (Object.keys(validationErrors).length == 0) {
      try {
        const response = await axios.post("http://localhost:8082/api/v1/auth/resendToken", formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.status);
        if (response.status !== 200) {
          throw new Error('Something went Wrong');
        }
        const data = await response.data;
        if (data.toLowerCase().trim() == "Invalid Email. Register if you didn't register before".toLowerCase().trim()) {
          setErrorMessage('Email not Found, Register if you have not');
          setSuccessMessage('');
        }
        else {
          setSuccessMessage('Token sent Successfully');
          setErrorMessage('');

          console.log(data);
          navigate("/verify-email");
        }
        setFormData({
          email: ''
        });
        setErrors('');
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
        setSuccessMessage('');
      }
    }
    else {
      setErrors(validationErrors);
    }
  }
  return (
    <MDBContainer fluid className='my-5'>
      <MDBRow className='g-0 align-items-center justify-content-center'>
        <MDBCol sm='10' md='8' lg='4'>
          <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
            <MDBCardBody className='p-5 shadow-5 text-center'>
              <h2 className="fw-bold mb-5">Email Verification Request</h2>
              <Form onSubmit={handleSubmit}>
                <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' name='email' value={formData.email} onChange={handleInputChange} />
                {errors.email && <div className="text-danger">{errors.email}</div>}
                <MDBBtn className='w-100 mb-4' size='md' type='submit'>Send</MDBBtn>
                {successMessage && <Alert variant='success'>{successMessage}</Alert>}
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
              </Form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}
export default ResendVerificationToken