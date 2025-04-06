import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

function VerifyEmail() {
  const [formData, setFormData] = useState({
    token: ''
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
    if (!formData.token) {
      validationErrors.token = 'Verification Token is Required';
    }
    if (Object.keys(validationErrors).length == 0) {
      try {
        const response = await axios.post("http://localhost:8082/api/v1/auth/confirm", formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response.status);
        if (response.status !== 200) {
          throw new Error("Something went wrong");
        }
        const data = await response.data;
        if (data.toLowerCase().trim() == 'Invalid Token'.toLowerCase().trim()) {
          setErrorMessage('Invalid Token');
          setSuccessMessage('');
        }
        else if (data.toLowerCase().trim() == 'Token got Expired. Click on resend to generate new token'.toLowerCase().trim()) {
          setErrorMessage('Token Expired');
          setSuccessMessage('');
        }
        else {
          setSuccessMessage('Verified Successfully');
          setErrorMessage('');
          console.log(data);
          navigate("/");
        }
        setFormData({
          token: ''
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
              <h2 className="fw-bold mb-5">Email Verifcation Form</h2>
              <Form onSubmit={handleSubmit}>
                <MDBInput wrapperClass='mb-4' label='Token' id='form3' type='text' name='token' value={formData.token} onChange={handleInputChange} />
                {errors.token && <div className="text-danger">{errors.token}</div>}
                <MDBBtn className='w-100 mb-4' size='md' type='submit'>Verify</MDBBtn>
                {successMessage && <Alert variant='success'>{successMessage}</Alert>}
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
              </Form>

              <div className='mt-3'>
                <p>
                  Token Expired? Click on
                  <Link to='/resend-verification-token'>  Resend</Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}

export default VerifyEmail
