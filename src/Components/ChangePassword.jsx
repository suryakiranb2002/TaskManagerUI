import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
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


function ChangePassword() {
  const [formData, setFormData] = useState({
    fpToken: '',
    newPassword: ''
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
    if (name === 'newPassword') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(value)) {
        setErrors({
          ...errors,
          newPassword:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)'
        });
      } else {
        setErrors({
          ...errors,
          newPassword: ''
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formData.fpToken) {
      validationErrors.fpToken = 'Verification Token is Required';
    }
    if (!formData.newPassword) {
      validationErrors.newPassword = 'New Password is Required';
    }
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8082/api/v1/auth/forgot-password", formData, {
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
          setSuccessMessage('Changed Password Successfully');
          navigate("/");
          setErrorMessage('');
          console.log(data);
        }
        setFormData({
          fpToken: '',
          newPassword: ''
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
              <h2 className="fw-bold mb-5">New Password Form</h2>
              <Form onSubmit={handleSubmit}>
                <MDBInput wrapperClass='mb-4' label='Token' id='form3' type='text' name='fpToken' value={formData.fpToken} onChange={handleInputChange} />
                {errors.fpToken && <div className="text-danger">{errors.fpToken}</div>}
                <MDBInput wrapperClass='mb-4' label='New Password' id='form4' type='password' name='newPassword' value={formData.newPassword} onChange={handleInputChange} />
                {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
                <MDBBtn className='w-100 mb-4' size='md' type='submit'>Change Password</MDBBtn>
                {successMessage && <Alert variant='success'>{successMessage}</Alert>}
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
              </Form>

              <div className='mt-3'>
                <p>
                  Token Expired? Click on
                  <Link to='/fp-token'>  Resend</Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}
export default ChangePassword