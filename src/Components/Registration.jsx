import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import "../Styles/RegistrationForm.css";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
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


function Registration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: 'Please enter a valid email address'
        });
      } else {
        setErrors({
          ...errors,
          email: ''
        });
      }
    }
    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(value)) {
        setErrors({
          ...errors,
          password:
            'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*)'
        });
      } else {
        setErrors({
          ...errors,
          password: ''
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.firstName) {
      validationErrors.firstName = 'First Name is required';
    }

    if (!formData.lastName) {
      validationErrors.lastName = 'Last Name is required';
    }

    if (!formData.email) {
      validationErrors.email = 'Email is required';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('http://localhost:8082/api/v1/auth/registration', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log(response.status);
        if (response.status !== 200) {
          throw new Error("something went wrong");
        }
        const data = await response.data;
        if (data.toLowerCase().trim() == 'Email already exists'.toLowerCase().trim()) {
          setErrorMessage('Email already exists, Use a different Email or login');
          setSuccessMessage('');
        }
        else {
          setSuccessMessage('Registered Successfully');
          navigate('/verify-email');
          setErrorMessage('');
          console.log(data);
        }
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        });
        setErrors({});
      }
      catch (error) {
        console.error(error);
        setErrorMessage(error.message);
        setSuccessMessage('');
      }

    }
    else {
      setErrors(validationErrors);
    }
  };


  return (
    <MDBContainer fluid className='my-5'>
      <MDBRow className='g-0 align-items-center justify-content-center'>
        <MDBCol sm='12' md='8' lg='4'>
          <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
            <MDBCardBody className='p-5 shadow-5 text-center'>
              <h2 className="fw-bold mb-5">Register now</h2>

              <Form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' name='firstName' value={formData.firstName} onChange={handleInputChange} />
                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                  </MDBCol>

                  <MDBCol md='6'>
                    <MDBInput wrapperClass='mb-4' label='Last name' id='form2' type='text' name='lastName' value={formData.lastName} onChange={handleInputChange} />
                    {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                  </MDBCol>
                </MDBRow>

                <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' name='email' value={formData.email} onChange={handleInputChange} />
                {errors.email && <div className="text-danger">{errors.email}</div>}
                <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' name='password' value={formData.password} onChange={handleInputChange} />
                {errors.password && <div className="text-danger">{errors.password}</div>}
                <MDBBtn className='w-100 mb-4' size='md' type='submit'>Register</MDBBtn>
                {successMessage && <Alert variant='success'>{successMessage}</Alert>}
                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
              </Form>

              <div className='mt-3'>
                <p>
                  Already have an account?{' '}
                  <Link to='/'>Login</Link>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>

  )
}


export default Registration;