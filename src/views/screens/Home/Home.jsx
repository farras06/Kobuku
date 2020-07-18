import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselControl, CarouselItem, ButtonGroup, FormControl } from "reactstrap";
import Axios from "axios";
import { connect } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShippingFast,
  faMoneyBillWave,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { searchBarHandler, ProductCategory } from "../../../redux/actions"
import "./Home.css";

import ProductCard from "../../components/Cards/ProductCard";

import homage_to_catalonia from "../../../assets/images/Showcase/homage_to_catalonia.jpeg"
import home from '../../../assets/images/home.jpg'
import a1984 from "../../../assets/images/Showcase/a1984.jpeg"
import ButtonUI from "../../components/Button/Button";
import CarouselShowcaseItem from "./CarouselShowcaseItem.tsx";
import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";
import "../../components/Navbar/Navbar.css"
import TextField from "../../components/TextField/TextField";

const dummy = [
  {
    productName: "1984",
    image: a1984,
    writer: "George Orwel",
    Published: "1949",
    desc: `1984 is a dystopian novella by George Orwell published in 1949, which follows the life of Winston Smith, a low ranking member 
    of ‘the Party’, who is frustrated by the omnipresent eyes of the party, and its ominous ruler Big Brother.
    ‘Big Brother’ controls every aspect of people’s lives. It has invented the language ‘Newspeak’ in an attempt 
    to completely eliminate political rebellion; created ‘Throughtcrimes’ to stop people even thinking of things
    considered rebellious. The party controls what people read, speak, say and do with the threat that if they
    disobey, they will be sent to the dreaded Room 101 as a looming punishment.
    Orwell effectively explores the themes of mass media control, government surveillance, totalitarianism and 
    how a dictator can manipulate and control history, thoughts, and lives in such a way that no one can escape it. `,
    id: 1,

  },
  {
    productName: "Homage to Catalonia",
    image: homage_to_catalonia,
    writer: "George Orwel",
    Published: "1938",
    desc: `Unleashed on 17 July 1936 by a military coup against the democratically elected government of the Second 
    Republic, the Spanish civil war was a rehearsal for the second world war. The British, French and American governments
    stood aside and permitted General Francisco Franco, with the substantial aid of Hitler and Mussolini, to defeat the republic. 
    To this day, the war is remembered by many as “the last great cause”, the war of the volunteers of the International Brigades,
    of the bombing of Guernica and of the mini-civil war within the civil war fought in Barcelona as CNT anarchists and
    the Poum’s quasi-Trotskyists battled forces of the Catalan government, the Generalitat, backed by the communists of the PSUC.`,
    id: 2,
  },
];


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
    activePage: "product",
    currentPage: 0,
    currentPagePaket: 0,
    itemsPerPage: 2,
    totalPages: 0,
    totalElements: 0,
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
    return dummy.map(({ image, productName, desc, writer, Published, id }) => {
      return (
        <CarouselItem
          onExiting={() => this.setState({ animating: true })}
          onExited={() => this.setState({ animating: false })}
          key={id.toString()}
        >
          <div className="carousel-item-home">
            <div className="container position-relative">
              <div className="row" style={{ paddingTop: "80px" }}>
                <div className="col-6 text-white position-relative">
                  <h2>{productName}</h2>
                  <p className="mt-4"> Wtiter : {writer}</p>
                  <p className="mt-4"> Published : {Published}</p>
                  <p className="mt-4">{desc}</p>
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
      this.state.activeIndex === dummy.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  };

  prevHandler = () => {
    if (this.state.animating) return;
    let prevIndex =
      this.state.activeIndex === 0
        ? dummy.length - 1
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
    this.getProduct();
    this.getCategory();
    this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage)
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
      Axios.get(`${API_URL}/products/${this.state.search.minPrice}/${this.state.search.maxPrice}/${this.state.search.orderBy}/${this.state.search.sortBy}/?productName=${this.state.search.productName}&page=${currentPage}&size=2`)
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
      Axios.get(`${API_URL}/products/${this.state.search.minPrice}/category/${this.state.search.maxPrice}/${this.state.search.orderBy}/${this.state.search.sortBy}/?productName=${this.state.search.productName}&categoryName=${val}&page=${currentPage}&size=2`)
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
    if (this.state.activePage == "product") {
      this.getBestSellerDataByFilterSort(this.state.search.categoryName, targetPage);
    } else {
      this.getBestSellerPaketByFilterSort(this.state.search.categoryName, targetPage);
    }
    this.setState({
      [event.target.name]: targetPage
    })
  }
  // button untuk balik ke page pertama 
  firstPage = () => {
    let firstPage = 0;
    if (this.state.activePage == "product") {
      if (this.state.currentPage > firstPage) {
        this.getBestSellerDataByFilterSort(this.state.search.categoryName, firstPage)
      }
    } else {
      if (this.state.currentPagePaket > firstPage) {
        this.getBestSellerPaketByFilterSort(this.state.search.categoryName, firstPage);
      }
    }
  }
  // button untuk kembali ke page sebelumnya
  prevPage = () => {
    let prevPage = 1;
    if (this.state.activePage == "product") {
      if (this.state.currentPage > prevPage) {
        this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage - prevPage)
      }
    } else {
      if (this.state.currentPagePaket > prevPage) {
        this.getBestSellerPaketByFilterSort(this.state.search.categoryName, this.state.currentPagePaket - prevPage);
      }
    }
  }
  // button untuk maju ke page selanjutnya
  nextPage = () => {
    if (this.state.activePage == "product") {
      if (this.state.currentPage < Math.ceil(this.state.totalElements / this.state.itemsPerPage)) {
        this.getBestSellerDataByFilterSort(this.state.search.categoryName, this.state.currentPage + 1)
      }
    } else {
      if (this.state.currentPagePaket < Math.ceil(this.state.totalElements / this.state.itemsPerPage)) {
        this.getBestSellerPaketByFilterSort(this.state.search.categoryName, this.state.currentPagePaket + 1)
      }
    }
  }
  // button untuk maju ke page terakhir
  lastPage = () => {
    let condition = Math.ceil(this.state.totalElements / this.state.itemsPerPage)
    let conditionPaket = Math.ceil(this.state.totalElements / this.state.itemsPerPage)
    if (this.state.activePage == "product") {
      if (this.state.currentPage < condition) {
        this.getBestSellerDataByFilterSort(this.state.search.categoryName, condition)
      }
    } else {
      if (this.state.currentPagePaket < condition) {
        this.getBestSellerPaketByFilterSort(this.state.search.categoryName, conditionPaket)
      }
    }
  }

  PageHandler = () => {
    const { currentPage, totalPages } = this.state;
    if (this.state.activePage == "product") {
      return (
        <div className="row">
          <div
            className="col-12 justify-item-center"
          >
            <ButtonGroup>


              <ButtonUI disabled={currentPage === 1 ? true : false}
                onClick={this.firstPage}><FontAwesomeIcon />
              First
            </ButtonUI>

              <ButtonUI disabled={currentPage === 1 ? true : false}
                onClick={this.prevPage}><FontAwesomeIcon />
              Prev
            </ButtonUI>

              <div className={"page-num bg-light"} name="currentPage" value={currentPage}
                onChange={this.changePage} >
              </div>

              <ButtonUI disabled={currentPage === totalPages ? true : false}
                onClick={this.nextPage}><FontAwesomeIcon />
              Next
            </ButtonUI>

              <ButtonUI disabled={currentPage === totalPages ? true : false}
                onClick={this.lastPage}><FontAwesomeIcon />
              Last
            </ButtonUI>

            </ButtonGroup>
          </div>


          <text
            className="text-center"
            style={{ "float": "left" }}>
            Showing Page {currentPage} of {totalPages}
          </text>
        </div>
      )
    } else if (this.state.activePage == "paket") {
      return (
        this.renderPaket()
      )
    }
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

        <div className="row p-4">

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
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName) }}
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
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName) }}
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
                onKeyUp={() => { this.getBestSellerDataByFilterSort(this.state.search.categoryName) }}
                type="text"
                placeholder="Insert Maximal Price"
              >
              </TextField>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-2"></div>
          <div className='col-4' >
            {/* <h4 className="font-weight-bold text-center text-white">Sort By</h4> */}
            <select
              className="justify-item-center form-control"
              value={this.state.search.orderBy}
              onChange={(e) => this.inputHandler(e, "orderBy", "search")}
              onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName) }}>
              <option value="price"> Price</option>
              <option value="productName"> Product Name </option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className='col-4' >
            {/* <h4 className="font-weight-bold text-center text-white">Sort By</h4> */}
            <select
              className="justify-item-center form-control"
              value={this.state.search.sortBy}
              onClick={(e) => { this.getBestSellerDataByFilterSort(this.state.search.categoryName) }}
              onChange={(e) => this.inputHandler(e, "sortBy", "search")} >
              <option value="asc"> A-Z </option>
              <option value="dsc"> Z-A </option>
            </select>
          </div>
          <div className="col-2"></div>
        </div>

        <div className="container">
          <h2 className="text-center font-weight-bolder mt-5">PRODUCT</h2>
          <div className="row d-flex flex-wrap justify-content-center">
            {this.renderProducts()}
          </div>
        </div>

        <div className="d-flex justify-content-center flex-row align-items-center">
          {this.PageHandler()}
        </div>

        <div
          className="py-5"
          style={{ marginTop: "128px", backgroundColor: Colors.lightestGray }}
        >
          <div className="container">
            <div className="row">
              <div className="col-4 text-center d-flex flex-column align-items-center">
                <FontAwesomeIcon
                  icon={faShippingFast}
                  style={{ fontSize: 70, color: Colors.accentLight }}
                />
                <h3 className="font-weight-bolder mt-4">FAST SHIPPING</h3>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
              </div>
              <div className="col-4 text-center d-flex flex-column align-items-center">
                <FontAwesomeIcon
                  icon={faMoneyBillWave}
                  style={{ fontSize: 70, color: Colors.accentLight }}
                />
                <h3 className="font-weight-bolder mt-4">100% REFUND</h3>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
              </div>
              <div className="col-4 text-center d-flex flex-column align-items-center">
                <FontAwesomeIcon
                  icon={faHeadset}
                  style={{ fontSize: 70, color: Colors.accentLight }}
                />
                <h3 className="font-weight-bolder mt-4">SUPPORT 24/7</h3>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Hic
                  impedit facilis nam vitae, accusamus doloribus alias
                  repellendus veniam voluptates ad doloremque sequi est, at
                  fugit pariatur quisquam ratione, earum sapiente.
                </p>
              </div>
            </div>
          </div>
        </div>
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