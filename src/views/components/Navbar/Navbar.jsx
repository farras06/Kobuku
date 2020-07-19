import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Cookie from "universal-cookie"
import { logoutHandler, searchBarHandler, ProductCategory } from "../../../redux/actions/index"
import Axios from "axios"
import logo from "../../../assets/images/Showcase/logo.png"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faHome, faSignOutAlt } from "@fortawesome/free-solid-svg-icons/";
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

  render() {
    return (
      <div>
        <div
          className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container navbar-home-bg"
        >
          <div className="logo-text col-2" style={{ alignItems: "center", alignContent: "center", }} >
            <Link to="/">
              <img
                src={logo}
                style={{ height: "70px", width: "70px" }}
              />
            </Link>
              Kobuku
          </div>

          <div className="logo-text col-8" style={{ alignItems: "center", alignContent: "center", }} >
            <Link
              style={{ height: "70px", width: "70px", color: "black" }}
              to="/"
            > <FontAwesomeIcon
                icon={faHome}
              />
              HOME
            </Link>
          </div>

          <div className="d-flex flex-row align-items-center col-2">
            {this.props.user.id ? (
              <>
                <Dropdown
                  toggle={this.toggleDropdown}
                  isOpen={this.state.dropdownOpen}
                >
                  <DropdownToggle tag="div" className="d-flex">
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: 24, cursor: "pointer" }} />
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
                          to="/editprofile"
                        >
                          Edit Profile
                    </Link>
                      </DropdownItem>

                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/admin/member"
                        >
                          Users
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

                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          onClick={this.logoutBtnHandler}
                          to="/"
                        >
                          Logout
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="ml-2"
                          />
                        </Link>
                      </DropdownItem>

                    </DropdownMenu>) :

                    (<DropdownMenu className="mt-2">

                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/history"
                        >
                          Payment
                    </Link>
                      </DropdownItem>

                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          to="/editprofile"
                        >
                          Edit Profile
                    </Link>
                      </DropdownItem>

                      <DropdownItem>
                        <Link
                          style={{ color: "inherit", textDecoration: "none" }}
                          onClick={this.logoutBtnHandler}
                          to="/"
                        >
                          Logout
                          <FontAwesomeIcon
                            icon={faSignOutAlt}
                            className="ml-2"
                          />
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
                      {this.props.user.cartItem}
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
                      Sign in
                </Link>
                  </ButtonUI>
                </>
              )}
          </div>
        </div>
        <div style={{ height: "10px" }}></div>
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
