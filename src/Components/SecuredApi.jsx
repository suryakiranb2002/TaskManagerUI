import React from 'react'
import axios from 'axios';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../ContextStore/AuthenticationContext';

function Demo() {
  const navigate = useNavigate();
  const [responseData, setResponseData] = useState('');
  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log(token);
      const response = await axios.get("http://localhost:8082/demo/hi", {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      setResponseData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.get("http://localhost:8082/api/v1/auth/logout", {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(() => {
        localStorage.removeItem('jwtToken');
        localStorage.setItem('auth', 'false');
        navigate("/");
      })
    } catch (error) {
      console.error(error);
    }
  };

  return (
    authenticated == 'true' ?
      <LoggedInComp fetchData={fetchData} responseData={responseData} logOut={logOut} />
      :
      <LoggedOutComp authenticated={authenticated} />
  )

}

const LoggedInComp = ({ fetchData, responseData, logOut }) => {
  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      <div>{responseData}</div>
      <button onClick={logOut}>Logout</button>
    </div>
  );
}

const LoggedOutComp = ({ authenticated }) => {
  return (
    <div>
      <h1>You are not Authenticated</h1>
      <p>New User? <Link to="/registration">Register</Link> </p>
      <p>Not Logged in? <Link to="/">Login</Link> </p>
    </div>
  )
}
export default Demo