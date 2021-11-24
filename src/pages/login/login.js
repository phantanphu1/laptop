import React,{useState} from "react";
import { Input, Button,Icon,Dimmer,Loader } from 'semantic-ui-react';
import './login.scss';
import {useHistory} from 'react-router-dom';
const axios = require("axios");
const account = { username: 'admin', password: 'admin' };


  
const Login = () => {

const [username, setUsername] = useState('');

const [password, setPassword] = useState('');

const [loading, setLoading] = useState(false);

const history=useHistory();

const handleChange = (e, field) => {
    if(field === 'username') {
      setUsername(e.target.value)
    }
    if(field === 'password') {
      setPassword(e.target.value)
    }
  }
  const onLogin = () => {
    setLoading(true);

    // console.log(username, password);
    // if(username===account.username && password===account.password){
    //     console.log('danwg nhap thanh cong');
    //     history.push('/');
    // }else{
    //     console.log('danwg nhap k thanh cong');
    //     alert('dang nhap k thanh cong')
    // }
    axios.post('https://lap-center.herokuapp.com/api/login', {
      username: username,
      password: password
    })
    .then(function (response) {
      console.log(response);
      setLoading(false);
      history.push('/');
      localStorage.setItem('customerName', response.data.userName);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('isAdmin', response.data.isAdmin);

    })
    .catch(function (error) {
      setLoading(false);

      console.log(error);
      alert("sai dang nhap")
    });
  }
  let checkInfo = true;
  (!username|| !password) ? checkInfo = true : checkInfo = false;
  return (
    <div>
       <Dimmer active={loading} inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>
      <Icon
        className='icon-home' name="home" size="large" inverted circular link
        onClick={() => history.push("/")}
      />
      <div className="login-container">
        <div className="login-form">
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}> Đăng nhập </h1>
          <div className="login-content">
            <label>Tên đăng nhập</label>
            <br />
            <Input placeholder="Username"value={username} className="inputText" onChange={(e) => handleChange(e, 'username')}/>
            <br />
            <label style={{ marginTop: "10px" }}>Mật khẩu</label>
            <br />
            <Input placeholder="Password"type="password"
            className="inputText"value={password} onChange={(e) => handleChange(e, 'password')} />
            <br />
            <Button color="green" onClick={onLogin} disabled={checkInfo}> 
              Đăng nhập 
            </Button>
            <p style={{ marginTop: "20px", textAlign: "center" }}>
              Bạn chưa có tài khoản?{" "}
              <a className="register-text" onClick={() => history.push('/register')}>
                Đăng ký ngay.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;