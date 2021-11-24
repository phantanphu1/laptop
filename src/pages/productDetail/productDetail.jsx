import React ,{useEffect,useState} from "react";
import { Segment, Button, Table,Modal } from "semantic-ui-react";
import "./productDetail.scss";
import Navbar from "../../components/navbar/navbar";
import { useLocation,useHistory } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import CardItem from "../../components/cardItem/cardItem";
import Footer from "../../components/footer/footer";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};


const ProductDetail = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [sameProduct, setSameProduct] = useState([]);
  const[image,setImage]=useState("");
  const location = useLocation();
  const id = location.pathname?.split('product/')[1];
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState(false);


const currentUser=localStorage.getItem('customerName');

  const history=useHistory();
  // const id = location.pathname?.replace('product/', '');
  useEffect(()=>{
    window.scrollTo(0, 0);
    fetchData();
  },[location])
  const fetchData = () => {
    setLoading(true);
    let url = `https://lap-center.herokuapp.com/api/product/getProductById/${id}`;
    axios.get(url)
      .then(function (response) {
        const data=response.data.response;
        console.log('data detail: ',data);
        setData(data);
        setImage(data.images[0]);
        fecthSameProduct(data.brand);
      })
      .catch(function (error) {
        console.log('error: ', error);
        setLoading(false);
      })
  }
  
const moveToBy=()=>{
  history.push(`/buy/${id}`)
}

  const onChooseImage = (image) => {
    setImage(image);
  }
  const fecthSameProduct = (brand) => {
    // fetch API for get more product for this brand
    setLoading(true);
    axios.get(`https://lap-center.herokuapp.com/api/product?productBrand=${brand}&pageSize=10&pageNumber=1`)
      .then(function (response) {
        console.log('product more: ', response.data.products);
        setSameProduct(response.data.products);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      })
    }
    const onAddToCart = () => {
      setLoading(true)
      axios.post('https://lap-center.herokuapp.com/api/cart/addProductToCart', {
        userId: localStorage.getItem("userId"),
        productId: data._id,
        productName: data.name,
        productBrand: data.brand,
        image: image,
        price: data.price
      })
      .then(function (res) {
        console.log(res);
        setLoading(false)
        setOpenDialog(true);
        setMessage("Bạn đã thêm sản phẩm thành công");
        
      })
      .catch(function (err) {
        console.log(err);
        setLoading(false)
        setOpenDialog(true);
        setMessage("Bạn đã thêm sản phẩm không thành công");
      });
    }
  return (
    <div>
      <Navbar></Navbar>
      <Segment loading={loading} className="detail-segment-container">
        <div className="detail-product-name">{data?.name}</div>
        <div className="detail-status">
          <p>Tình trạng: Còn hàng</p>
          <p style={{ marginLeft: "20px" }}>Bảo hành: 24 tháng</p>
        </div>
        <hr style={{ width: "80%" }} />
        <div className="detail-container">
          <div className="detail-left">
            <img
              className="detail-image"
              src={image}
              alt={image}
            />
            <div className="detail-list-images">
              {data?.images?.map((item) => (
                <img className="detail-image-small" src={item} alt="" onClick={() => onChooseImage(item)} />
              ))}
            </div>
          </div>
          <div className="detail-main">
            <p>
              Giá bán: <span>{data.price} VND</span>
            </p>
            <div className="detail-discount">
              <div className="discount-top">
                <p>Khuyến mãi - Quà tặng</p>
              </div>
              <div className="discount-content">something</div>
            </div>
            <div className="detail-buy">
              <Button color="red"onClick={moveToBy}>MUA NGAY</Button>
              {currentUser &&
              <Button color="green" className="btncart" onClick={onAddToCart}>THÊM VÀO GIỎ HÀNG</Button>
              }
              <p>
                GỌI NGAY <a href="tel:+84969442510"> 0379 26 6143 </a> ĐỂ GIỮ
                HÀNG
              </p>
            </div>
          </div>
          <div className="detail-right">
            <div>
              <span>Điện thoại tư vấn - Đặt hàng</span>
              <ul>
                <li>Kim Lý - 0904 555 666</li>
                <li>Huỳnh Lệ - 0345 789 789</li>
                <li>Văn Dũng - 0876 567 678</li>
              </ul>
            </div>
            <div>
              <span>Địa chỉ mua hàng</span>
              <ul>
                <li>152 ABC, Thanh Khê, TP. Đà Nẵng</li>
                <li>162 ABC, Thanh Khê, TP. Đà Nẵng</li>
                <li>172 ABC, Thanh Khê, TP. Đà Nẵng</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="specifications">
          <Table celled fixed singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Phần cứng</Table.HeaderCell>
                <Table.HeaderCell>Thông số kĩ thuật</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Model</Table.Cell>
                <Table.Cell>{data.model}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>CPU</Table.Cell>
                <Table.Cell>{data.cpu}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Ram</Table.Cell>
                <Table.Cell>{data.ram}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Ổ cứng</Table.Cell>
                <Table.Cell>{data.disk}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Card đồ họa</Table.Cell>
                <Table.Cell>{data.card}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Màn hình</Table.Cell>
                <Table.Cell>{data.monitor}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="same-product">
          <h3>Sản phẩm cùng thương hiệu</h3>
          <hr />
          <Carousel 
            responsive={responsive}
            showDots={true}
          >
            {sameProduct.map((item)=>(
            <CardItem product={item}></CardItem> 
            ))}
          </Carousel>
        </div>
      </Segment>
      <Footer></Footer>
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
      
    </div>
  );
};

export default ProductDetail;
