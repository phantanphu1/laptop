import "./home.scss";
import React, { useState, useEffect } from "react";
import { Button, Icon, Input, Segment, Pagination } from "semantic-ui-react";
import Navbar from "../../components/navbar/navbar";
import Card from "../../components/card/card";
import product from "../../assets/data/data";
import Footer from "../../components/footer/footer";
import HistoryAndCart from "../../components/historyAndCart/historyAndCart";
import { useLocation } from "react-router-dom";
import axios from "axios";

import Carousel from "react-multi-carousel";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

function Home() {
  const [data, setData] = useState([]);

  const fetchData = async url => {
    // start call API
    setLoading(true);
    await axios
      .get(url)
      .then(function(response) {
        setPageNumber(1);
        setTotalPage(response.data.totalPage);
        setData(response.data.products);
        setLoading(false);
      })
      .catch(function(error) {
        setLoading(false);
      });
    // end call API
  };

  const [search, setSearch] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const imageBanner = [
    "https://laptopbaominh.com/wp-content/uploads/2015/08/banner-n04.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSYdD9jOx-1-FGrfE0uXOrM48mT7Co4FJLWtQ6fPnJf8pEqvLVPLegU0x-OfeATRfVAw&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAUzUfmw9he-AW3JLebOJU0zokludk3Zi-C-ehReY5suYVg1TXV7TwTiSEtr-G20bNDg&usqp=CAU",
    "https://laptopjapan.com/wp-content/uploads/2020/04/baner-trang-chu.jpg",
    "https://storage-asset.msi.com/event/nb/2018/my-pre-order/images/banner.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo6geHK6ewGvS-ZxhZjtPz3ImXDK8Z0wsQUazOtFyXJnnkKK06s5FAuT-wLSzoTzI_lQ&usqp=CAU",
    "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://laptopdell.com.vn/wp-content/uploads/2021/07/Laptop-do-hoa-1.jpg",
    "https://i.ytimg.com/vi/nlDVbSoc3so/maxresdefault.jpg"
  ];
  const currentUser = localStorage.getItem("customerName");
  useEffect(async () => {
    let url = `https://lap-center.herokuapp.com/api/product`;
    // setLoading(true);
    await fetchData(url);
    setIsSearch(false);
    setSearch("");
    setBrand("");
    setPrice("");
  }, [location]);

  const onChangeSearch = e => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const onSubmitSearch = async () => {
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${brand}&orderByColumn=price&orderByDirection=${price}`;
    await fetchData(url);
    setIsSearch(true);
  };

  const onSearchBrand = async e => {
    setBrand(e.target.value);
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${e.target.value}&orderByColumn=price&orderByDirection=${price}`;
    await fetchData(url);
    setIsSearch(true);
  };

  const sortPrice = async e => {
    setPrice(e.target.value);
    setIsSearch(true);

    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${brand}&orderByColumn=price&orderByDirection=${e.target.valuee}`;
    await fetchData(url);
  };
  const handlePaginationChange = async (e, { activePage }) => {
    setIsSearch(true);

    await setLoading(true);
    await setPageNumber(activePage);
    let url = `https://lap-center.herokuapp.com/api/product?productName=${search}&productBrand=${brand}&orderByColumn=price&orderByDirection=${price}&pageSize=12&pageNumber=${activePage}`;
    await axios
      .get(url)
      .then(function(response) {
        // handle success
        setData(response.data.products);
        setTotalPage(response.data.totalPage);

        setLoading(false);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  };
  return (
    <div className="home-container">
      <Navbar />
      <div className="filter">
        <div className="seach">
          <Input
            icon={
              <Icon
                name="search"
                inverted
                circular
                link
                onClick={onSubmitSearch}
              />
            }
            placeholder="Search..."
            value={search}
            onChange={onChangeSearch}
          />
        </div>
        <div className="selectForm">
          <select className="selectBox" value={brand} onChange={onSearchBrand}>
            <option selected value="">
              T???t c???
            </option>
            <option value="Asus">ASUS</option>
            <option value="Dell">DELL</option>
            <option value="Acer">ACER</option>
            <option value="Lenovo">LENOVO</option>
          </select>
        </div>
        <div className="selectForm">
          <select className="selectBox" value={price} onChange={sortPrice}>
            <option selected value="">
              T???t c???
            </option>
            <option value="asc">T??? th???p ?????n cao</option>
            <option value="desc">T??? cao ?????n th???p</option>
          </select>
        </div>
      </div>
      {/* {currentUser && <p>Ch??o m???ng, <span>{currentUser} </span></p>} */}
      <div className="currentUser">
        {currentUser && (
          <p>
            Ch??o m???ng, <span> {currentUser} </span>
          </p>
        )}
      </div>
      {!isSearch && (
        <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={1000}>
          {imageBanner?.map(item => (
            <img className="imgBanner" src={item} />
          ))}
        </Carousel>
      )}
      {currentUser && <HistoryAndCart />}
      <div className="container-body">
        <div className="menuLeft"></div>
        <Segment loading={loading} className="product">
          {data.length === 0 ? (
            <div className="noResults">
              <h1 style={{ textAlign: "center" }}>
                Kh??ng t??m th???y k???t qu??? n??o!!!
              </h1>
            </div>
          ) : (
            data.map(item => <Card product={item} />)
          )}
        </Segment>
        <div className="menuRight"></div>
      </div>
      <div className="paginator">
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={true}
          firstItem={true}
          lastItem={true}
          siblingRange={1}
          totalPages={totalPage}
          onPageChange={handlePaginationChange}
        />
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
