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
        setMessage("đặt hàng thành công");
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
        setOpenDialog(true);
        setMessage("đặt hang that bai");
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
        setMessage("đặt hàng thành công");
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
        setOpenDialog(true);
        setMessage("đặt hang that bai");
      });
  }
  return (
    <div>
      <Navbar />
      <Segment className="buy-container" loading={loading}>
        <div className="buy-title">
          <p>Để đặt hàng</p>
          <span>
            , quý khách hàng vui lòng kiểm tra sản phẩm, số lượng, giá, màu sắc
            và điền các thông tin dưới đây:
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
            <h3>Tổng tiền:</h3>
            <p>{data.price * quantity} VND</p>
          </div>
          <div className="user-info">
            <Label as="a" color="red" ribbon>
              Thông tin khách hàng
            </Label>
            <Form className="info-form">
              <Form.Field>
                <label>Tên khách hàng</label>
                <input
                  placeholder="tên khách hàng"
                  value={customerName}
                  onChange={e => onChangeInfo(e, "customerName")}
                />
              </Form.Field>
              <Form>
                <Form.Field>
                  <label>Số điện thoại</label>
                  <input
                    placeholder="số điện thoại"
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
                  <label>Địa chỉ</label>
                  <TextArea
                    placeholder="Địa chỉ"
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
                    Đặt Hàng
                  </Button>
                }
              >
                <Modal.Header>
                  <h2 className="txt-check">Xác nhận thông tin</h2>
                </Modal.Header>
                <Modal.Content image>
                  <Image size="medium" src={image} wrapped />
                  <Modal.Description>
                    <h5 className="txt-title">Thông tin sản phẩm</h5>
                    <div className="info-check">
                      <p>Tên sản phẩm:</p>
                      <span>{data.name}</span>
                    </div>
                    <div className="info-check">
                      <p>Hãng:</p>
                      <span>{data.brand}</span>
                    </div>
                    <div className="info-check">
                      <p>Số lượng:</p>
                      <span>{quantity}</span>
                    </div>
                    <div className="info-check">
                      <p>Tổng tiền:</p>
                      <span>{quantity * data.price}</span>
                    </div>
                    <h5 className="txt-title">Thông tin sản phẩm</h5>
                    <div className="info-check">
                      <p>Tên khách hàng:</p>
                      <span>{customerName}</span>
                    </div>
                    <div className="info-check">
                      <p>Số điện thoại:</p>
                      <span>{phoneNumber}</span>
                    </div>
                    <div className="info-check">
                      <p>Email:</p>
                      <span>{email}</span>
                    </div>
                    <div className="info-check">
                      <p>Địa chỉ:</p>
                      <span>{address}</span>
                    </div>
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={() => setOpen(false)}>Hủy</Button>
                  <Button onClick={onOrder} positive>
                    Xác nhận
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
          <h4 className="txt-check">Thông báo</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>{message}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpenDialog(false)}>Đóng</Button>
        </Modal.Actions>
      </Modal>
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
        </Modal.Actions>
      </Modal>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Thông báo</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>Bạn có muốn mua sản phẩm này không?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button color="green" onClick={() => {onOrder()
            setOpen(false)}}>Xác nhận</Button>
          </Modal.Actions>
      </Modal>
     
    </div>
  );
};
export default Buy;
