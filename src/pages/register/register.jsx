import React, { useState } from "react";
import { Input, Button, Icon, Dimmer, Loader, Modal } from "semantic-ui-react";
import "./register.scss";
import { useHistory } from "react-router-dom";
const axios = require("axios");

const account = { username: "admin", password: "admin" };

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cfpassword, setcfPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState(false);
  const [mail, setMail] = useState("");

  const history = useHistory();

  const handleChange = (e, field) => {
    if (field === "username") {
      setUsername(e.target.value);
    }
    if (field === "password") {
      setPassword(e.target.value);
    }
    if (field === "cfpassword") {
      setcfPassword(e.target.value);
    }
    if (field === "email") {
      setMail(e.target.value);
    }
    if (field === "phone") {
      setPhone(e.target.value);
    }
  };

  const onRegister = () => {
    if (password === cfpassword) {
      setLoading(true)
      axios.post('https://lap-center.herokuapp.com/api/register', {
        name: username,
        email: mail,
        phone: phone,
        password: password
      })
      .then(function (res) {
        setLoading(false);
        setOpenDialog(true);
        setMessage('Đặt ký thành công!!!');
      })
      .catch(function (err) {
        setLoading(false);
        setOpenDialog(true);
        setMessage('Đăng ký tài khoản không thành công. Vui lòng thử lại sau!!!');
      });
    } else {
      setOpenDialog(true);
      setMessage('Mật khẩu không trùng khớp. Vui lòng thử lại!!!');
    }
  };
  let checkInfo = true;
  !username || !phone || !mail || !password || !cfpassword
    ? (checkInfo = true)
    : (checkInfo = false);

  // if (!name || !phone || !email || !password || !cfpassword)
  //   checkInfo = true;
  // else
  //   checkInfo = false;

  // if (!name || !phone || !email || !password || !cfpassword)
  // if (customerName && phoneNumber && email && address) checkInfo = false
  return (
    <div>
      <Dimmer active={loading} inverted>
        <Loader inverted>Loading</Loader>
      </Dimmer>

      <Icon
        className="icon-home"
        name="home"
        size="large"
        inverted
        circular
        link
        onClick={() => history.push("/")}
      />
      <div className="register-container">
        <div className="register-form">
          <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
            {" "}
            Đăng Ký{" "}
          </h1>
          <div className="register-content">
            <label>Tên đăng nhập</label>
            <br />
            <Input
              placeholder="Username"
              className="inputText"
              value={username}
              onChange={e => handleChange(e, "username")}
            />
            <label>Số Điện Thoại</label>
            <br />
            <Input
              placeholder="phone"
              className="inputText"
              value={phone}
              onChange={e => handleChange(e, "phone")}
            />
            <label>Email</label>
            <br />
            <Input
              placeholder="email"
              className="inputText"
              value={mail}
              onChange={e => handleChange(e, "email")}
            />
            <br />
            <br />
            <label style={{ marginTop: "10px" }}>Mật khẩu</label>
            <br />
            <Input
              placeholder="Password"
              type="password"
              className="inputText"
              value={password}
              onChange={e => handleChange(e, "password")}
            />
            <label style={{ marginTop: "10px" }}>Nhập Lai Mật khẩu</label>
            <br />

            <Input
              placeholder="Password"
              type="password"
              className="inputText"
              value={cfpassword}
              onChange={e => handleChange(e, "cfpassword")}
            />
            <br />
            <br />

            <Button color="green" onClick={onRegister} disabled={checkInfo}>
              Đăng Ký
            </Button>
            <p style={{ marginTop: "10px", textAlign: "center" }}>
              Bạn đã có tài khoản.{" "}
              <a className="login-text" onClick={() => history.push("./login")}>
                Đăng nhập.
              </a>
            </p>
          </div>
        </div>
      </div>
      <Modal
        onClose={() => setOpenDialog(false)}
        onOpen={() => setOpenDialog(true)}
        open={openDialog}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Thông báo</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
          {password === cfpassword && (
            <Button
              primary
              onClick={() => (history.push("/login"), setOpenDialog(false))}
            >
              Đăng nhập
            </Button>
          )}
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default Register;
