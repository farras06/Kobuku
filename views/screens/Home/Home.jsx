import React from "react";
import { Link } from "react-router-dom";
import { Carousel, CarouselControl, CarouselItem } from "reactstrap";
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
import a1984 from "../../../assets/images/Showcase/a1984.jpeg"
import ButtonUI from "../../components/Button/Button";
import CarouselShowcaseItem from "./CarouselShowcaseItem.tsx";
import Colors from "../../../constants/Colors";
import { API_URL } from "../../../constants/API";
import "../../components/Navbar/Navbar.css"

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
                  {/* <ButtonUI
                    type="outlined"
                    style={{
                      backgroundColor: "#CCEAD7",
                      borderColor: "#CCEAD7",
                      borderRadius: "16px",
                      fontWeight: "bolder",
                      position: "absolute",
                      bottom: 420,
                    }}
                  >
                    BUY NOW
                  </ButtonUI> */}
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

  getBestSellerData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ bestSellerData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderProducts = () => {
    return this.props.user.searchCategory.map((val) => {
      if (val.productName.toLowerCase().startsWith(this.props.user.searchBar.toLowerCase())) {
        return (
          <ProductCard key={`bestseller-${val.id}`} data={val} className="m-2" />
        );
      }
    });
  };

  componentDidMount() {
    this.getBestSellerData();
  }

  bestSellerDataBasedOnCategory = (selectcategory) => {
    Axios.get(`${API_URL}/products`, {
      params: {
        category: selectcategory
      }
    })

      .then((res) => {
        console.log(res)
        this.setState({ bestSellerData: res.data });
        console.log(this.props.user.searchBar)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  bestSellerDataAll = () => {
    Axios.get(`${API_URL}/products`)

      .then((res) => {
        console.log(res)
        this.setState({ bestSellerData: res.data });
        console.log(this.props.user.searchBar)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  enterPressed = (e) => {
    if (e.keyCode == 13) {
      console.log('value', e.target.value);
      console.log('enter pressed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  render() {

    return (
      <div>
        <div>
          <Carousel
            className="carousel-item-home-bg "
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

        <br />

        <div
          className="row p-4 search-item-home-bg"
          style={{
            backgroundColor: "#e2b9b9",
            borderColor: "#CCEAD7",
            borderRadius: "1px",
          }}
        >
          {/* <div
            className="col-6"
          >
            <h4 className="font-weight-bold text-center text-white">BOOKS CATEGORY</h4>

            <div className="d-flex justify-content-center flex-row align-items-center my-3">
              <Link to="/" style={{ color: "inherit" }}
                onClick={() => this.bestSellerDataAll()}
              >
                <h6 className="mx-4 font-weight-bold text-white">All</h6>
              </Link>

              <Link to="/" style={{ color: "inherit" }}
                onClick={() => this.bestSellerDataBasedOnCategory("Phone")}
              >
                <h6 className="mx-4 font-weight-bold text-white">PHONE</h6>
              </Link>

              <Link to="/" style={{ color: "inherit" }}
                onClick={() => this.bestSellerDataBasedOnCategory("Laptop")}
              >
                <h6 className="mx-4 font-weight-bold text-white">LAPTOP</h6>
              </Link>

              <Link to="/" style={{ color: "inherit" }}
                onClick={() => this.bestSellerDataBasedOnCategory("Tab")}
              >
                <h6 className="mx-4 font-weight-bold text-white">TAB</h6>
              </Link>

              <Link to="/" style={{ color: "inherit" }}
                onClick={() => this.bestSellerDataBasedOnCategory("Desktop")}
              >
                <h6 className="mx-4 font-weight-bold text-white">DESKTOP</h6>
              </Link>
            </div>
          </div>

          <div
            className="col-6"
          >
            <h4 className="font-weight-bold text-center text-white">SEARCH YOUR BOOK</h4>

            <div
              style={{ flex: 1 }}
              className="px-5 d-flex flex-row justify-content-start"
            >
              <input
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={(e) => { this.props.onSearch(e.target.value) }}
                onKeyDown={this.enterPressed}
                className={`search-bar ${
                  this.state.searchBarIsFocused ? "active" : null
                  }`}
                type="text"
                placeholder="Insert Your Book title"
              />
            </div>
          </div> */}

          <div
            className="col-12 mt-4"
          >
            <h4 className="font-weight-bold text-center text-white">SORT BY :</h4>

            <div
              className="d-flex justify-content-center flex-row align-items-center my-3"
            >
              <Link to="/" style={{ color: "inherit" }}
              // onClick={}
              >
                <h6 className="mx-4 font-weight-bold text-white">Lowest Price</h6>
              </Link>

              <Link to="/" style={{ color: "inherit" }}
              // onClick={}
              >
                <h6 className="mx-4 font-weight-bold text-white">Highest Price</h6>
              </Link>
            </div>
          </div>
        </div>

        <div className="container">

          <h2 className="text-center font-weight-bolder mt-5">PRODUCT</h2>
          <div className="row d-flex flex-wrap justify-content-center">
            {this.renderProducts()}
          </div>
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

// const mapDispatchToProps = {
//   onSearch: searchBarHandler,
//   onSeacrhCategory: ProductCategory
// };

export default connect(mapStateToProps)(Home);
