import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselControl, CarouselItem, ButtonGroup, FormControl, InputGroup, } from "reactstrap";
import Axios from "axios";
import { connect } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShippingFast, faMoneyBillWave, faHeadset, faStepBackward, faStepForward, faFastForward, } from "@fortawesome/free-solid-svg-icons";
import { searchBarHandler, ProductCategory } from "../../../redux/actions"
import "./Home.css";

import ProductCard from "../../components/Cards/ProductCard";

import ButtonUI from "../../components/Button/Button";
import CarouselShowcaseItem from "./CarouselShowcaseItem.tsx";
import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";
import "../../components/Navbar/Navbar.css"
import TextField from "../../components/TextField/TextField";


class Home extends React.Component {
  state = {
    activeIndex: 0,
    animating: false,
    bestSellerData: [],
    categoryList: [],
    bestSellerDataSort: [],
    search: {
      categoryName: 'All',
      minPrice: 0,
      maxPrice: 0,
      productName: '',
      orderBy: 'productName',
      sortBy: 'asc'
    },
    currentPage: 0,
    currentPagePaket: 0,
    itemsPerPage: 6,
    totalPages: 0,
    totalElements: 0,
    carouselItem: []
  };

  inputHandler = (e, field, form) => {
    let { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });
  };

  renderCarouselItems = () => {
    return this.state.carouselItem.map(({ image, productName, description, price, id, stockUser, sold }) => {
      return (
        <CarouselItem
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          key={id.toString()}
        >
          <div className="carousel-item-home">
            <div className="container position-relative">
              <div className="row" style={{ paddingTop: "80px" }}>
                <div className="col-4 text-white position-relative">
                  <h2>{productName}</h2>
                  <p className="mt-4"> Price : {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", }).format(price)}</p>
                  <p className="mt-2"> Avability : {stockUser}</p>
                  <p className="mt-2"> Sold : {sold}</p>
                  <p className="mt-4">{description}</p>
                  <Link to={`/product/${id}`}>
                    <ButtonUI className="mt-3" type="contained">
                      BUY NOW
                    </ButtonUI>
                  </Link>

                </div>
                <div className="col-6 d-flex flex-row justify-content-center">
                  <img src={image} alt="" style={{ height: "400px", widht: "260px" }} />
                </div>
              </div>
            </div>
          </div>
        </CarouselItem>
      );
    });
  };

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  nextHandler = () => {
    if (this.state.animating) return;
    let nextIndex =
      this.state.activeIndex === this.state.carouselItem.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  prevHandler = () => {
    if (this.state.animating) return;
    let prevIndex =
      this.state.activeIndex === 0
        ? this.state.carouselItem.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: prevIndex });
  };

  getProduct = () => {
    Axios.get(`${API_URL}/products/getProduct`)
      .then((res) => {
        this.setState({ bestSellerData: res.data });
        console.log(this.state.bestSellerData)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProducts = () => {
    return this.state.bestSellerDataSort.map((val) => {
      return (
        <ProductCard key={`bestseller-${val.id}`} data={val} className="m-2" />
      );
    });
  };

  componentDidMount() {
    this.getCategory();
    this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage)
    this.getCarouselItem()
  }

  enterPressed = (e) => {
    if (e.keyCode == 13) {
      console.log('value', e.target.value);
      console.log('enter pressed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getCategory = () => {
    Axios.get(`${API_URL}/category/getCategory`)
      .then((res) => {
        this.setState({ categoryList: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getCarouselItem = () => {
    Axios.get(`${API_URL}/products/getProduct/carousel/`)
      .then((res) => {
        this.setState({ carouselItem: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  renderCategoryName = () => {
    return this.state.categoryList.map((val) => {
      return (
        <option value={val.categoryName}>{val.categoryName}</option>
      )
    })
  }

  getBestSellerDataByFilterSort = (val, currentPage) => {
    console.log(this.state.search)
    currentPage -= 1
    if (val == "All") {
      Axios.get(`${API_URL}/products/${this.state.search.minPrice}/${this.state.search.maxPrice}/${this.state.search.orderBy}/${this.state.search.sortBy}/?productName=${this.state.search.productName}&page=${currentPage}&size=6`)
        .then((res) => {
          console.log(res.data)
          console.log(this.state.search)
          this.setState({
            bestSellerDataSort: res.data.content,
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements,
            currentPage: res.data.number + 1
          })
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      Axios.get(`${API_URL}/products/${this.state.search.minPrice}/category/${this.state.search.maxPrice}/${this.state.search.orderBy}/${this.state.search.sortBy}/?productName=${this.state.search.productName}&categoryName=${val}&page=${currentPage}&size=6`)
        .then((res) => {
          console.log(res.data)
          this.setState({
            bestSellerDataSort: res.data.content,
            totalPages: res.data.totalPages,
            totalElements: res.data.totalElements,
            currentPage: res.data.number + 1
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  changePage = event => {
    let targetPage = parseInt(event.target.value)
    this.getBestSellerDataByFilterSort(this.state.search.categoryName, targetPage);

    this.setState({
      [event.target.name]: targetPage
    })
  }
  // button untuk balik ke page pertama 
  firstPage = () => {
    let firstPage = 0;
    if (this.state.currentPage > firstPage) {
      this.getBestSellerDataByFilterSort(this.state.search.categoryName, firstPage)
    }

  }
  // button untuk kembali ke page sebelumnya
  prevPage = () => {
    let prevPage = 1;

    if (this.state.currentPage > prevPage) {
      this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage - prevPage)
    }
  }
  // button untuk maju ke page selanjutnya
  nextPage = () => {

    if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.itemsPerPage)) {
      this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage + 1)
    }

  }
  // button untuk maju ke page terakhir
  lastPage = () => {
    let condition = Math.ceil(this.state.totalElements / this.state.itemsPerPage)

    if (this.state.currentPage < condition) {
      this.getBestSellerDataByFilterSort(this.state.search.categoryName, condition)
    }

  }

  PageHandler = () => {
    const { currentPage, totalPages } = this.state;

    return (
      <div className="row">
        <div
          className="col-12"
        >
          <InputGroup
            className="justify-content-center"
          >
            <ButtonUI disabled={currentPage === 1 ? true : false}
              onClick={this.firstPage}><FontAwesomeIcon
                className=""
              />
              First
            </ButtonUI>

            <ButtonUI disabled={currentPage === 1 ? true : false}
              onClick={this.prevPage}
              className="ml-3"
            >
              Prev
            </ButtonUI>

            <div className="ml-3 justify-content-center align-item-center"
              style={{ "float": "left" }}>
              Showing Page {currentPage} of {totalPages}
            </div>

            <ButtonUI disabled={currentPage === totalPages ? true : false}
              onClick={this.nextPage}
              className="ml-3"
            >
              Next
            </ButtonUI>

            <ButtonUI disabled={currentPage === totalPages ? true : false}
              onClick={this.lastPage}
              className="ml-3">
              Last
            </ButtonUI>

          </InputGroup>
        </div>


      </div>
    )

  }

  render() {

    return (
      <div>
        <div className="row justify-content-center">

          <Carousel
            className="carousel-item-home-bg col-10 justify-item-center "
            next={this.nextHandler}
            previous={this.prevHandler}
            activeIndex={this.state.activeIndex}
          >
            {this.renderCarouselItems()}
            <CarouselControl
              directionText="Previous"
              direction="prev"
              onClickHandler={this.prevHandler}
            />
            <CarouselControl
              directionText="Next"
              direction="next"
              onClickHandler={this.nextHandler}
            />
          </Carousel>

        </div>

        <div className="row mt-5">
          <div className="col-4 justify-content-center ml-5" >

            <h2 className="text-center font-weight-bolder mt-5">Filter Product</h2>

            <h5 style={{ textAlign: "left" }}> Product Name</h5>

            <div className="mt-2 mb-4">
              <TextField
                value={this.state.search.productName}
                onChange={(e) => this.inputHandler(e, "productName", "search")}
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                type="text"
                placeholder="Insert Your Book title"
              >
              </TextField>

            </div>

            <h5 style={{ textAlign: "left" }}> Category</h5>

            <div className="mt-2 mb-4">
              <select className="justify-item-center form-control"
                value={this.state.search.categoryName}
                onClick={(e) => { this.getReportData(this.state.search.categoryName) }}
                onChange={(e) => this.inputHandler(e, "categoryName", "search")} >
                <option value="" disabled> Select Book Category</option>
                <option value="All"> All Categories</option>
                {this.renderCategoryName()}
              </select>
            </div>

            <div className="row ml-1">
              <div>
                <h5 style={{ textAlign: "left" }}> Minimal Price</h5>
                <div className="mt2 mb-4">
                  <TextField
                    value={this.state.search.minPrice}
                    onChange={(e) => this.inputHandler(e, "minPrice", "search")}
                    onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                    type="text"
                    placeholder="Insert Minimal Proce"
                  >
                  </TextField>
                </div>
              </div>

              <div>
                <h5 className="ml-2" style={{ textAlign: "left" }}> Maximal Price</h5>
                <div className="mt-2 mb-4 ml-2">
                  <TextField
                    value={this.state.search.maxPrice}
                    onChange={(e) => this.inputHandler(e, "maxPrice", "search")}
                    onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                    type="text"
                    placeholder="Insert Maximal Price"
                  >
                  </TextField>
                </div>
              </div>
            </div>

            <h5 style={{ textAlign: "left" }}> Order By</h5>

            <div className="mt-2 mb-4">
              <select
                className="justify-item-center form-control"
                value={this.state.search.orderBy}
                onChange={(e) => this.inputHandler(e, "orderBy", "search")}
                onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}>
                <option value="price"> Price</option>
                <option value="productName"> Product Name </option>
                {this.props.user.role == "admin" ?
                  <option value="sold">Sold</option> : null
                }
              </select>
            </div>

            <h5 style={{ textAlign: "left" }}> Sort Orientation</h5>

            <div className="mt-2 mb-4">
              <select
                className="justify-item-center form-control"
                value={this.state.search.sortBy}
                onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                onChange={(e) => this.inputHandler(e, "sortBy", "search")} >
                <option value="asc"> A-Z </option>
                <option value="desc"> Z-A </option>
              </select>

            </div>
          </div>

          <div className="col-7"
            style={{ borderLeft: "1px solid #e7aa8d" }}
          >
            <h2 className="text-center font-weight-bolder mt-5">PRODUCT</h2>
            <div className="row d-flex flex-wrap justify-content-center">
              {this.renderProducts()}
            </div>
          </div>

        </div>

        <div className="d-flex justify-content-center flex-row align-items-center mt-5">
          {this.PageHandler()}
        </div>


        {/* <div className="row p-4">

          <div className="col-3">
            <select className="justify-item-center form-control"
              value={this.state.search.categoryName}
              onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName) }}
              onChange={(e) => this.inputHandler(e, "categoryName", "search")} >
              <option value=""> Select Book Category</option>
              <option value="All"> All Categories</option>
              {this.renderCategoryName()}
            </select>
          </div>

          <div className="col-5">
            <div
              style={{ flex: 1 }}
              className="px-1 d-flex flex-row justify-content-start"
            >
              <TextField
                value={this.state.search.productName}
                onChange={(e) => this.inputHandler(e, "productName", "search")}
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                type="text"
                placeholder="Insert Your Book title"
              >
              </TextField>
            </div>
          </div>

          <div className="col-2">
            <div
              style={{ flex: 1 }}
              className="px-1 d-flex flex-row justify-content-start"
            >
              <TextField
                value={this.state.search.minPrice}
                onChange={(e) => this.inputHandler(e, "minPrice", "search")}
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                type="text"
                placeholder="Insert Minimal Proce"
              >
              </TextField>

            </div>
          </div>

          <div className="col-2">
            <div
              style={{ flex: 1 }}
              className="px-1 d-flex flex-row justify-content-start"
            >
              <TextField
                value={this.state.search.maxPrice}
                onChange={(e) => this.inputHandler(e, "maxPrice", "search")}
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
                type="text"
                placeholder="Insert Maximal Price"
              >
              </TextField>
            </div>
          </div>
        </div> */}

        {/* <div className="row">
          <div className="col-2"></div>
          <div className='col-4' >
           
            <select
              className="justify-item-center form-control"
              value={this.state.search.orderBy}
              onChange={(e) => this.inputHandler(e, "orderBy", "search")}
              onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}>
              <option value="price"> Price</option>
              <option value="productName"> Product Name </option>
              {this.props.user.role == "admin" ?
                <option value="sold">Sold</option> : null
              }
            </select>
          </div>

          <div className='col-4' >
            
            <select
              className="justify-item-center form-control"
              value={this.state.search.sortBy}
              onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage) }}
              onChange={(e) => this.inputHandler(e, "sortBy", "search")} >
              <option value="asc"> A-Z </option>
              <option value="desc"> Z-A </option>
            </select>
          </div>
          <div className="col-2"></div>
        </div> */}

        {/* <div className="container">
          <h2 className="text-center font-weight-bolder mt-5">PRODUCT</h2>
          <div className="row d-flex flex-wrap justify-content-center">
            {this.renderProducts()}
          </div>
        </div> */}

        {/* <div className="d-flex justify-content-center flex-row align-items-center">
          {this.PageHandler()}
        </div> */}


      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Home);