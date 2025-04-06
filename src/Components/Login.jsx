import axios from 'axios';
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import AuthContext from '../ContextStore/AuthenticationContext';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { authenticated, setAuthenticated, setToStorage } = useContext(AuthContext);
    // console.log(authenticated);
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

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.email) {
            validationErrors.email = 'Email is required';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post("http://localhost:8082/api/v1/auth/login", formData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response.status);

                if (response.status !== 200) {
                    throw new Error('Something went Wrong');
                }
                const data = await response.data;
                if (data.toLowerCase().trim() == 'User did not Registered'.toLowerCase().trim()) {
                    setErrorMessage('You have not Registered');
                    setSuccessMessage('');
                    setAuthenticated(true);
                }
                else if (data.toLowerCase().trim() == 'Email not verified'.toLowerCase().trim()) {
                    setErrorMessage('Email not verified');
                    setSuccessMessage('');
                    setAuthenticated(true);
                }
                else {
                    console.log(data);
                    localStorage.setItem('jwtToken', data);
                    setToStorage('true')
                    setAuthenticated('true');
                    setSuccessMessage('Logged in Successfully');
                    setErrorMessage('');
                    navigate("/home");
                }
                setFormData({
                    email: '',
                    password: ''
                });
                setErrors({});
            }
            catch (error) {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    setErrorMessage('Incorrect password');
                } else {
                    setErrorMessage(error.message);
                }
                setSuccessMessage('');
            }
        }
        else {
            // setAuthenticated(true);
            setErrors(validationErrors);
        }

    }
    return (

        <MDBContainer fluid className='my-5'>
            <MDBRow className='g-0 align-items-center justify-content-center'>
                <MDBCol sm='10' md='8' lg='4'>
                    <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                        <MDBCardBody className='p-5 shadow-5 text-center'>
                            <h2 className="fw-bold mb-5">Login Form</h2>

                            <Form onSubmit={handleSubmit}>
                                <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' name='email' value={formData.email} onChange={handleInputChange} />
                                {errors.email && <div className="text-danger">{errors.email}</div>}
                                <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' name='password' value={formData.password} onChange={handleInputChange} />
                                {errors.password && <div className="text-danger">{errors.password}</div>}
                                <div className='mt-3'>
                                    <p>
                                        <Link to='/fp-token'>Forgot Password?</Link>
                                    </p>
                                </div>
                                <MDBBtn className='w-100 mb-4' size='md' type='submit'>Login</MDBBtn>
                                {successMessage && <Alert variant='success'>{successMessage}</Alert>}
                                {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                            </Form>
                            <div className='mt-3'>
                                <p>
                                    Don't have an account?
                                    <Link to='/registration'>Register</Link>
                                </p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}
export default Login
