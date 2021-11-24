import Navbar from "../../components/navbar/navbar";
import {
  Segment,
  Table,
  Button,
  Popup,
  Menu,
  Icon,
  Label,
  Modal,
  select,
  Pagination
} from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {useHistory} from 'react-router-dom';

import "./manageOrder.scss";
// import { from } from "webpack-sources/lib/CompatSource";

const ManageOrder = () => {
  const [brand, setBrand] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dataItem, setDataItem] = useState([]);
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [isUserRole, setIsUserRole] = useState(false);
  const isAdmin = localStorage.getItem("isAdmin");
  const history=useHistory();

  const [open2, setopen2] = useState("");

  const [temp, setTemp] = useState([]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("https://lap-center.herokuapp.com/api/order")
      .then(function(response) {
        const data = response.data.orders;
        setPageNumber(1);
        setTotalPage(response.data.totalPage);
        setData(data);
        setLoading(false);
        console.log(data);
      })
      .catch(function(error) {
        setLoading(false);
      });
  };

  useEffect(() => {
    if(isAdmin === "undefined" || isAdmin === "false") {
      setOpenDialog(true)
      setMessage("Bạn không thể truy cập vào địa chỉ này. Vui lòng quay lại trang chủ!!!");
      setIsUserRole(true);
    } else {
      fetchData();
    } 
  }, []);

  const changeOrderStatus = () => {
    setLoading(true);
    setOpen(false);
    axios
      .patch(
        `https://lap-center.herokuapp.com/api/order/editOrderStatus/${orderId}`,
        {
          orderStatus: orderStatus
        }
      )
      .then(function(response) {
        console.log(response);
        handlePaginationChange(temp);
        setLoading(false);
        setOpenDialog(true);
        setMessage("Thay đổi trạng trái đơn hàng thành công !!!");
      })
      .catch(function(error) {
        console.log(error);
        setLoading(false);
        setOpenDialog(true);
        setMessage(
          "Thay đổi trạng trái đơn hàng thất bại, vui lòng thử lại sau !!!"
        );
      });
  };

  const handlePaginationChange = async activePage => {
    setTemp(activePage);
    const page = parseInt(activePage?.target?.innerHTML);
    await setLoading(true);
    await setPageNumber(activePage);
    let url = "";
    if (pageNumber === 1) {
      url = `https://lap-center.herokuapp.com/api/order?pageNumber=1`;
    } else {
      url = `https://lap-center.herokuapp.com/api/order?pageNumber=${page}`;
    }
    await axios
      .get(url)
      .then(function(response) {
        // handle success
        window.scrollTo(0, 0);
        setData(response.data.orders);
        setTotalPage(response.data.totalPage);
        setLoading(false);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  };

  const handleSelectChange = e => {
    const order = parseInt(e.target.value);
    setOrderStatus(order);
  };
  const convertOrder = order => {
    return order === 1 ? (
      <span className="case1">Vừa đặt hàng</span>
    ) : order === 2 ? (
      <span className="case2">Đang giao hàng</span>
    ) : order === 3 ? (
      <span className="case3">Đã nhận hàng</span>
    ) : (
      <span className="case4">Trả hàng</span>
    );
    // switch(order) {
    //     case 1:
    //       return <span className="case1">Vừa đặt hàng</span>
    //     case 2:
    //       return <span className="case2">Đang giao hàng</span>
    //     case 3:
    //       return <span className="case3">Đã nhận hàng</span>
    //     default:
    //       return <span className="case4">Trả hàng</span>
    //   }
  };
  const onOpenDetail = item => {
    setDataItem(item);
    setOrderId(item._id);
    setOrderStatus(item.orderStatus);
    setOpen(true);
  };
  const onOpenDelete = item => {
    setMessage("Bạn có chắc chắn muốn xóa đơn hàng này?");
    setOpenDialog(true);
    setOrderId(item._id);
    setIsDelete(true);
  };
  const onDelete = () => {
    setLoading(true);
    setIsDelete(false);
    axios
      .delete(
        `https://lap-center.herokuapp.com/api/order/removeOrder/${orderId}`
      )
      .then(function(response) {
        setLoading(false);
        setOpenDialog(true);
        setMessage("Xóa thành công sản phẩm khỏi danh sách!!!");
        handlePaginationChange(temp);
      })
      .catch(function(error) {
        setLoading(false);
        setOpenDialog(true);
        setMessage("Xóa không thành công sản phẩm khỏi danh sách!!!");
      });
  };
  return (
    <div>
      <Navbar />
      <Segment className="order-container" loading={loading}>
        <h1>Quản lý đơn hàng</h1>
        <Table celled color="green">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Tên khách hàng</Table.HeaderCell>
              <Table.HeaderCell>Tên sản phẩm</Table.HeaderCell>
              <Table.HeaderCell>tình Trạng</Table.HeaderCell>

              <Table.HeaderCell>số điện thoại</Table.HeaderCell>

              <Table.HeaderCell>Hành động</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  <Label>{item.customerName}</Label>
                </Table.Cell>
                <Table.Cell>{item.productBrand}</Table.Cell>

                <Table.Cell>
                  {/* {item.orderStatus===1 ?
                <span className="case1">Vừa đặt hàng</span>:
                item.orderStatus===2 ?
                <span  className="case2">đang giao hàng</span>:
                item.orderStatus===3 ?
                <span  className="case3">đã nhận hàng</span>:
                
                <span  className="case4">trả hàng</span>
                } */}
                  {convertOrder(item.orderStatus)}
                </Table.Cell>
                <Table.Cell>{item.phone}</Table.Cell>
                <Table.Cell>
                  <Popup
                    content="xem"
                    trigger={
                      <Button
                        icon="eye"
                        color="facebook"
                        circular
                        onClick={() => {
                          setDataItem(item);
                          setOpen(true);
                          setOrderId(item._id);
                          setOrderStatus(item.orderStatus);
                        }}
                      />
                    }
                  />
                  <Popup
                    content="xoa"
                    trigger={
                      <Button
                        icon="trash alternate"
                        color="youtube"
                        circular
                        onClick={() => onOpenDelete(item)}
                        // onClick={() => {
                        //   setOrderId(item._id);
                        //   setopen2(true);
                        // }}
                      />
                    }
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="5">
                <Pagination
                  boundaryRange={0}
                  defaultActivePage={1}
                  ellipsisItem={true}
                  firstItem={true}
                  lastItem={true}
                  siblingRange={1}
                  activePage={pageNumber}
                  totalPages={totalPage}
                  onPageChange={handlePaginationChange.bind(this)}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header></Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <div className="info-check">
              <p>Tên khách hàng:</p>
              <span>{dataItem.customerName}</span>
            </div>
            <div className="info-check">
              <p>Tên sản phẩm:</p>
              <span>{dataItem.productName}</span>
            </div>
            <div className="info-check">
              <p>Hãng:</p>
              <span>{dataItem.productBrand}</span>
            </div>
            <div className="info-check">
              <p>Số lượng:</p>
              <span> {dataItem.quantity}</span>
            </div>
            <div className="info-check">
              <p>Số điện thoại:</p>
              <span>{dataItem.phone}</span>
            </div>
            <div className="info-check">
              <p>Địa chỉ:</p>
              <span>{dataItem.address}</span>
            </div>
            <div className="info-check">
              <p>Trạng thái đơn hàng:</p>
              <select
                value={orderStatus}
                onChange={e => handleSelectChange(e)}
                className="select-status"
              >
                <option value="1">Vừa đặt hàng</option>
                <option value="2">Đang giao hàng</option>
                <option value="3">Đã nhận hàng</option>
                <option value="4">Trả hàng</option>
              </select>
              >
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={e => changeOrderStatus(e)} positive>
            Cập nhật
          </Button>
        </Modal.Actions>
      </Modal>
      x
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
          <Button
            onClick={() => {
              setOpenDialog(false);
              setIsDelete(false);
            }}
          >
            {isDelete ? "Hủy" : "Đóng"}
          </Button>
          {!isUserRole && 
            <Button onClick={() => {setOpenDialog(false); setIsDelete(false)}}>{isDelete ? "Hủy" : "Đóng"}</Button>
          }
          {isDelete &&
            <Button onClick={() => onDelete()} color="blue">Xác nhận</Button>
          }
          {isUserRole &&
            <Button onClick={() => {history.push(""); setOpenDialog(false)}} color="blue">Trang chủ</Button>
          }
        </Modal.Actions>
      </Modal>
      {/* <Modal
        onClose={() => setopen2(false)}
        onOpen={() => setopen2(true)}
        open={open2}
        size="mini"
      >
        <Modal.Header>
          <h4 className="txt-check">Thông báo</h4>
        </Modal.Header>
        <Modal.Content image>
          <p>Bạn có muốn xóa sản phẩm này không?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setopen2(false)}>Hủy</Button>
          <Button
            color="green"
            onClick={() => {
              onDelete();
              setopen2(false);
            }}
          >
            Xác nhận
          </Button>
        </Modal.Actions>
      </Modal> */}
    </div>
  );
};
export default ManageOrder;
