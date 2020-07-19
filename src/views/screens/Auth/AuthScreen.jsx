import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";
import "./AuthScreen.css";

import { registerHandler, loginHandler, forgetPasswordHandler } from "../../../redux/actions";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../../constants/API";

class AuthScreen extends React.Component {
  state = {

    loginForm: {
      username: "",
      password: "",
      showPassword: false,
    },
    registerForm: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      rePassword: '',
      address: "",
      showPassword: false,
    },
    modalOpenRegister: false
  };

  componentDidUpdate() {
    if (this.props.user.id) {
      swal("Success!", "Welcome", "success")
      const cookie = new Cookies();
      cookie.set("authData", JSON.stringify(this.props.user), { path: "/" });
    }
  }

  inputHandler = (e, field, form) => {
    const { value } = e.target;
    this.setState({
      [form]: {
        ...this.state[form],
        [field]: value,
      },
    });

    console.log(e.target);
  };

  registerBtnHandler = (idx) => {
    this.setState({
      registerForm: {
        ...this.state.registerForm,
      },
      modalOpenRegister: true,
    });
  };

  toggleModal = () => {
    this.setState({ modalOpenRegister: !this.state.modalOpenRegister });
  };

  registerHandler = () => {
    const { username, fullName, password, email, rePassword, address } = this.state.registerForm;
    let newUser = {
      username,
      fullName,
      password,
      email,
      address,
    };

    if (username == "" || fullName == "" || password == "" || email == "" || rePassword == "" || address == "") {
      alert("Fill all the empty field")
    } if (password != rePassword) {
      alert("password isn't match")

    }
    if ((username != "" || fullName != "" || password != "" || email != "" || rePassword != "" || address != "") && (password == rePassword)) {
      this.props.onRegister(newUser)
    }



  };

  loginBtnHandler = () => {
    const { username, password } = this.state.loginForm;
    let newUser = {
      username,
      password,
    };

    this.props.onLogin(newUser);
  };

  forgetBtnHandler = () => {
    const { username } = this.state.loginForm;
    let newUser = {
      username
    };

    this.props.onForgetPassword(newUser);
  };

  checkboxHandler = (e, form) => {
    const { checked } = e.target;

    console.log(checked);

    this.setState({
      [form]: {
        ...this.state[form],
        showPassword: checked,
      },
    });
  };

  renderAuthComponent = () => {
    return (
      <div className="mt-5 justify-content-center"
        style={{
          border: "1px solid black",
          paddingTop: "10px",
          paddingBottom: "20px",
          paddingLeft: "10px",
          paddingRight: "10px",
          borderRadius: "10px"
        }}
      >
        <p className="mt-4 text-center"
          style={{ borderBottom: "1px solid black", padding: "10px" }}
        >
          Welcome back.
            <br />
          Please, login to your account
        </p>

        <TextField
          value={this.state.loginForm.username}
          onChange={(e) => this.inputHandler(e, "username", "loginForm")}
          placeholder="Username"
          className="mt-5"
        />
        <TextField
          value={this.state.loginForm.password}
          onChange={(e) => this.inputHandler(e, "password", "loginForm")}
          type={this.state.registerForm.showPassword ? "text" : "password"}
          placeholder="Password"
          className="mt-2"
        />
        <input
          type="checkbox"
          onChange={(e) => this.checkboxHandler(e, "registerForm")}
          className="mt-3"
          name="showPasswordRegister"
        />{" "}
          Show Password

        <div className="row">
          <div className="d-flex justify-content-center"
            style={{ width: "100%" }}
          >
            <ButtonUI
              onClick={this.loginBtnHandler}
              type="contained"
              className="mt-4"
              style={{ width: "90%" }}
            >
              Login
            </ButtonUI>
          </div>
        </div>

        <div className="d-flex">
          <text
            onClick={this.forgetBtnHandler}
            type="contained"
            className="mt-4"
            style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
          >
            Forgot Your Password ?
          </text>
        </div>

        <div className="d-flex">
          <text
            onClick={() => this.registerBtnHandler()}
            style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
          > Doesn't have an Account ? Register Now

          </text>
        </div>
      </div>


    );
  }

  render() {
    if (this.props.user.id > 0) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container"
        style={{ width: '25%' }}
      >
        <div className="row mt-5 auth-screen w">
          {this.props.user.errMsg ? (
            <div className="alert alert-danger mt-3">
              {this.props.user.errMsg}
            </div>
          ) : null}
          {this.renderAuthComponent()}
        </div>

        <Modal
          toggle={this.toggleModal}
          isOpen={this.state.modalOpenRegister}
          className="edit-modal"
        >
          <ModalHeader toggle={this.toggleModal}>
            <caption>
              <h3>Register</h3>
            </caption>
          </ModalHeader>

          <ModalBody>
            <div className="row">
              <div className="col-8">
                <TextField
                  value={this.state.registerForm.username}
                  placeholder="User Name"
                  onChange={(e) => this.inputHandler(e, "username", "registerForm")}
                />
              </div>

              <div className="col-8 mt-3">
                <TextField
                  value={this.state.registerForm.fullName}
                  placeholder="Full Name"
                  onChange={(e) => this.inputHandler(e, "fullName", "registerForm")}
                />
              </div>

              <div className="col-8 mt-3">
                <TextField
                  value={this.state.registerForm.email}
                  placeholder="Email"
                  onChange={(e) => this.inputHandler(e, "email", "registerForm")}
                />
              </div>

              <div className="col-10 mt-3">
                <textarea
                  value={this.state.registerForm.address}
                  onChange={(e) => this.inputHandler(e, "address", "registerForm")}
                  style={{ resize: "none" }}
                  placeholder="User Address"
                  className="custom-text-input">
                </textarea>
              </div>

              <div className="col-8 mt-3">
                <TextField
                  value={this.state.registerForm.password}
                  onChange={(e) => this.inputHandler(e, "password", "registerForm")}
                  placeholder="Password"
                  className="mt-2"
                  type={this.state.registerForm.showPassword ? "text" : "password"}
                />
              </div>

              <div className="col-8 mt-3">
                <TextField
                  value={this.state.registerForm.rePassword}
                  onChange={(e) => this.inputHandler(e, "rePassword", "registerForm")}
                  placeholder="Re-Enter Password"
                  className="mt-2"
                  type={this.state.registerForm.showPassword ? "text" : "password"}
                />
              </div>

              <div className="col-8 mt-3">
                <input
                  type="checkbox"
                  onChange={(e) => this.checkboxHandler(e, "registerForm")}
                  className="mt-3"
                  name="showPasswordRegister"
                />{" "}
                Show Password
              </div>

              <div className="col-5 mt-3 offset-1">
                <ButtonUI
                  className="w-100"
                  onClick={this.toggleModal}
                  type="outlined"
                >
                  Cancel
                  </ButtonUI>
              </div>

              <div className="col-5 mt-3">
                <ButtonUI
                  className="w-100"
                  onClick={() => this.registerHandler()}
                  type="contained"
                >
                  Register
                  </ButtonUI>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  onRegister: registerHandler,
  onLogin: loginHandler,
  onForgetPassword: forgetPasswordHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
