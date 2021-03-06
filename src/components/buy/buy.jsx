import "./buy.scss";
import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/navbar/navbar";
import {
  Segment,
  Button,
  Input,
  Label,
  Form,
  TextArea,
  Image,
  Modal
} from "semantic-ui-react";

const Buy = () => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [disabledButton, setDisabledButton] = useState(true);
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const location = useLocation();
  const id = location.pathname?.split("buy/")[1];
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState(false);
  const currentUser=localStorage.getItem('customerName');

  const [open, setOpen] = useState(false);
  const onChangeInfo = (event, field) => {
    const value = event.target.value;
    switch (field) {
      case "customerName":
        setCustomerName(value);
        break;
      case "phone":
        setPhoneNumber(value);
        // code block
        break;
      case "email":
        setEmail(value);
        // code block
        break;
      case "address":
        setAddress(value);
        // code block
        break;
      default:
      // code block
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  let checkInfo = true;
  if (!customerName || !phoneNumber || !email || !address) checkInfo = true;
  if (customerName && phoneNumber && email && address) checkInfo = false;
  const fetchData = async () => {
    setLoading(true);
    let url = `https://lap-center.herokuapp.com/api/product/getProductById/${id}`;
    axios
      .get(url)
      .then(function(response) {
        const data = response.data.response;
        setData(data);
        setImage(data.images[0]);
        setLoading(false);
      })
      .catch(function(error) {
        console.log("error: ", error);
        setLoading(false);
      });
  };
  const onChange = number => {
    setQuantity(number);
    console.log(number);
  };
  const onChangeQuantity = method => {
    if (method === "plus") {
      setQuantity(quantity + 1);
    } else if (quantity === 1) {
      setQuantity(1);
    } else {
      setQuantity(quantity - 1);
    }
  };
  const onOrder = () => {
    setOpen(false);
    setLoading(true);
    axios
      .post("https://lap-center.herokuapp.com/api/order/addOrder", {
        customerName: customerName,
        email: email,
        phone: phoneNumber,
        address: address,
        productName: data.name,
        productBrand: data.brand,
        quantity: quantity,
        orderStatus: 1
      })
      .then(function(response) {
        console.log(response);
        setLoading(false);
        currentUser && onAddToHistory();
        setOpenDialog(true);
        setMessage("?????t h??ng th??nh c??ng");
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
        setOpenDialog(true);
        setMessage("?????t hang that bai");
      });
  };
  const onAddToHistory=()=>{
    setOpen(false);
    setLoading(true);
    axios
      .post("https://lap-center.herokuapp.com/api/history/addProductToHistory", {
        userId: localStorage.getItem("userId"),
        phone: phoneNumber,
        address: address,
        productName: data.name,
        productBrand: data.brand,
        quantity: quantity,
        orderStatus: 1
      })
      .then(function(response) {
        console.log(response);
        setLoading(false);
        setOpenDialog(true);
        setMessage("?????t h??ng th??nh c??ng");
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
        setOpenDialog(true);
        setMessage("?????t hang that bai");
      });
  }
  return (
    <div>
      <Navbar />
      <Segment className="buy-container" loading={loading}>
        <div className="buy-title">
          <p>????? ?????t h??ng</p>
          <span>
            , qu?? kh??ch h??ng vui l??ng ki???m tra s???n ph???m, s??? l?????ng, gi??, m??u s???c
            v?? ??i???n c??c th??ng tin d?????i ????y:
          </span>
        </div>
        <div className="buy-content">
          <div className="buy-header">
            <img className="buy-image" src={image} alt="" />
            <p>{data.name}</p>
            <div className="quantity">
              <Button icon="minus" onClick={() => onChangeQuantity("minus")} />
              <Input
                className="inp-quantity"
                value={quantity}
                // onChange={(e) => {
                //   onChange(e.target.value);
                // }}
              />
              <Button icon="plus" onClick={() => onChangeQuantity("plus")} />
              <h4>{data.price}VND</h4>
            </div>
          </div>
          <hr />
          <div className="buy-total">
            <h3>T???ng ti???n:</h3>
            <p>{data.price * quantity} VND</p>
          </div>
          <div className="user-info">
            <Label as="a" color="red" ribbon>
              Th??ng tin kh??ch h??ng
            </Label>
            <Form className="info-form">
              <Form.Field>
                <label>T??n kh??ch h??ng</label>
                <input
                  placeholder="t??n kh??ch h??ng"
                  value={customerName}
                  onChange={e => onChangeInfo(e, "customerName")}
                />
              </Form.Field>
              <Form>
                <Form.Field>
                  <label>S??? ??i???n tho???i</label>
                  <input
                    placeholder="s??? ??i???n tho???i"
                    value={phoneNumber}
                    onChange={e => onChangeInfo(e, "phone")}
                  />
                </Form.Field>
              </Form>
              <Form>
                <Form.Field>
                  <label>Email</label>
                  <input
                    placeholder="email"
                    value={email}
                    onChange={e => onChangeInfo(e, "email")}
                  />
                </Form.Field>
              </Form>
              <Form>
                <Form.Field>
                  <label>?????a ch???</label>
                  <TextArea
                    placeholder="?????a ch???"
                    value={address}
                    onChange={e => onChangeInfo(e, "address")}
                  />
                </Form.Field>
              </Form>
              <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                  <Button color="red" className="btn-oder"
                  //  disabled={checkInfo}
                   >
                    ?????t H??ng
                  </Button>
                }
              >
                <Modal.Header>
                  <h2 className="txt-check">X??c nh???n th??ng tin</h2>
                </Modal.Header>
                <Modal.Content image>
                  <Image size="medium" src={image} wrapped />
                  <Modal.Description>
                    <h5 className="txt-title">Th??ng tin s???n ph???m</h5>
                    <div className="info-check">
                      <p>T??n s???n ph???m:</p>
                      <span>{data.name}</span>
                    </div>
                    <div className="info-check">
                      <p>H??ng:</p>
                      <span>{data.brand}</span>
                    </div>
                    <div className="info-check">
                      <p>S??? l?????ng:</p>
                      <span>{quantity}</span>
                    </div>
                    <div className="info-check">
                      <p>T???ng ti???n:</p>
                      <span>{quantity * data.price}</span>
                    </div>
                    <h5 className="txt-title">Th??ng tin s???n ph???m</h5>
                    <div className="info-check">
                      <p>T??n kh??ch h??ng:</p>
                      <span>{customerName}</span>
                    </div>
                    <div className="info-check">
                      <p>S??? ??i???n tho???i:</p>
                      <span>{phoneNumber}</span>
                    </div>
                    <div className="info-check">
                      <p>Email:</p>
                      <span>{email}</span>
                    </div>
                    <div className="info-check">
                      <p>?????a ch???:</p>
                      <span>{address}</span>
                    </div>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={() => setOpen(false)}>H???y</Button>
                  <Button onClick={onOrder} positive>
                    X??c nh???n
                  </Button>
                </Modal.Actions>
              </Modal>
            </Form>
          </div>
        </div>
      </Segment>
      <Modal
        onClose={() => setOpenDialog(false)}
        onOpen={() => setOpenDialog(true)}
        open={openDialog}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Th??ng b??o</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDialog(false)}>????ng</Button>
        </Modal.Actions>
      </Modal>
      <Modal
        onClose={() => setOpenDialog(false)}
        onOpen={() => setOpenDialog(true)}
        open={openDialog}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Th??ng b??o</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDialog(false)}>????ng</Button>
        </Modal.Actions>
      </Modal>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Th??ng b??o</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>B???n c?? mu???n mua s???n ph???m n??y kh??ng?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>H???y</Button>
          <Button color="green" onClick={() => {onOrder()
            setOpen(false)}}>X??c nh???n</Button>
          </Modal.Actions>
      </Modal>
     
    </div>
  );
};
export default Buy;
