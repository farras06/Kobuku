import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Cookie from "universal-cookie"
import { logoutHandler, searchBarHandler, ProductCategory } from "../../../redux/actions/index"
import Axios from "axios"
import logo from "../../../assets/images/Showcase/logo.jpg"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { faUser } from "@fortawesome/free-regular-svg-icons";
import ProductCard from "../../components/Cards/ProductCard";
import "./Navbar.css";
import ButtonUI from "../Button/Button";
import { API_URL } from "../../../constants/API";

const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};



class Navbar extends React.Component {

  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    cartItem: 0,
    totalCartQuantity: 0,
    isCondition: false,
    bestSellerData: [],
  };

  logoutBtnHandler = () => {
    this.props.onLogout()
  }

  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  componentDidMount() {
    this.getCartItems()
  }



  getCartItems = () => {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id
      }
    })
      .then(res => {
        console.log(res.data)
        this.setState({ cartItem: res.data.length })
      })

      .catch(err => {
        console.log(err)
      })
  }


  enterPressed = (e) => {
    if (e.keyCode == 13) {
      console.log('value', e.target.value);
      console.log('enter pressed');
      this.scrollToProduct();
    }
  }

  scrollToProduct = () => {
    window.scrollTo({ top: 800, behavior: 'smooth' });
  }


  getBestSellerData = () => {
    Axios.get(`${API_URL}/products`)
      .then((res) => {
        this.setState({ bestSellerData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.getBestSellerData();
  }

  bestSellerDataBasedOnCategory = (selectcategory) => {
    console.log(selectcategory);

    Axios.get(`${API_URL}/products`, {
      params: {
        category: selectcategory
      }
    })

      .then((res) => {
        console.log(res)
        this.setState({ bestSellerData: res.data });
        this.props.onSeacrhCategory(this.state.bestSellerData) // set best sellerdata to redux
        console.log(this.props.user.searchBar)
        console.log(this.props.user.searchCategory)
        this.scrollToProduct();
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
        this.props.onSeacrhCategory(this.state.bestSellerData)
        console.log(this.props.user.searchBar)
        this.scrollToProduct();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {

    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text col-2" style={{ alignItems: "center" }} >
          <Link style={{ textDecoration: "none", color: "inherit", }} to="/">
            <img src={logo} style={{ height: "90px", width: "110px" }} />
          </Link>
        </div>

        <div
          className="col-4"
        >
          <div className="d-flex justify-content-center flex-row align-items-center my-3">
            <Link to="/" style={{ color: "inherit" }}
              onClick={() => this.bestSellerDataAll()}
            >
              <h6 className="mx-4 font-weight-bold text-black">All</h6>
            </Link>

            <Link to="/" style={{ color: "inherit" }}
              onClick={() => this.bestSellerDataBasedOnCategory("Phone")}
            >
              <h6 className="mx-4 font-weight-bold text-black">PHONE</h6>
            </Link>

            <Link to="/" style={{ color: "inherit" }}
              onClick={() => this.bestSellerDataBasedOnCategory("Laptop")}
            >
              <h6 className="mx-4 font-weight-bold text-black">LAPTOP</h6>
            </Link>

            <Link to="/" style={{ color: "inherit" }}
              onClick={() => this.bestSellerDataBasedOnCategory("Tab")}
            >
              <h6 className="mx-4 font-weight-bold text-black">TAB</h6>
            </Link>

            <Link to="/" style={{ color: "inherit" }}
              onClick={() => this.bestSellerDataBasedOnCategory("Desktop")}
            >
              <h6 className="mx-4 font-weight-bold text-black">DESKTOP</h6>
            </Link>
          </div>
        </div>

        <div
          className="col-4"
        >

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
        </div>


        <div className="d-flex flex-row align-items-center col-2">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>

                {this.props.user.role == "admin" ?

                  (<DropdownMenu className="mt-2">
                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/dashboard"
                      >
                        Dashboard
                    </Link>
                    </DropdownItem>

                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/member"
                      >
                        Members
                    </Link>
                    </DropdownItem>

                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/payment"
                      >
                        Payment
                    </Link>
                    </DropdownItem>

                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/admin/report"
                      >
                        Report
                    </Link>
                    </DropdownItem>
                  </DropdownMenu>) :

                  (<DropdownMenu className="mt-2">
                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/wishlist"
                      >
                        Wish List
                    </Link>
                    </DropdownItem>

                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        to="/history"
                      >
                        History
                    </Link>
                    </DropdownItem>

                    <DropdownItem>
                      <Link
                        style={{ color: "inherit", textDecoration: "none" }}
                        onClick={this.logoutBtnHandler}
                      >
                        Logout
                    </Link>
                    </DropdownItem>

                  </DropdownMenu>)
                }

              </Dropdown>
              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {this.state.cartItem}
                  </small>
                </CircleBg>
              </Link>
            </>
          ) : (
              <>
                <ButtonUI type="contained">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign in / Sign up
                </Link>
                </ButtonUI>
              </>
            )}
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

const mapDispatchToProps = {
  onLogout: logoutHandler,
  onSearch: searchBarHandler,
  onSeacrhCategory: ProductCategory
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
