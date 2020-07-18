import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";

import { saveForgetPasswordHandler } from "../../../redux/actions";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../../constants/API";



class ForgetPassword extends React.Component {
    state = {

        editForm: {
            newPassword: '',
            showPassword: false,
        },
    };


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

    forgetPasswordBtnHandler = () => {
        // console.log(this.props.match.params.username)
        const { newPassword } = this.state.editForm;
        let newUser = {
            id: this.props.user.id,
            newPassword,
            username: this.props.match.params.username
        };

        if (newPassword == "") {
            alert("Fill all the empty field")
        }

        console.log(this.props.user.username)
        console.log(this.props.user.id)

        this.props.onSaveForgetPassword(newUser)
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
            <div className="mt-5">
                <h3>Forget Password</h3>
                <p className="mt-4">
                    Reader Always Reading
                </p>

                <TextField
                    value={this.state.editForm.rePassword}
                    onChange={(e) => this.inputHandler(e, "newPassword", "editForm")}
                    placeholder="New Password"
                    className="mt-2"
                    type={this.state.editForm.showPassword ? "text" : "password"}
                />
                <input
                    type="checkbox"
                    onChange={(e) => this.checkboxHandler(e, "editForm")}
                    className="mt-3"
                    name="showPasswordRegister"
                />{" "}
                Show Password

                <div className="d-flex justify-content-center">
                    <ButtonUI
                        type="contained"
                        onClick={this.forgetPasswordBtnHandler}
                        className="mt-4"
                    >
                        Save New Password
            </ButtonUI>
                </div>
            </div>
        );

    };

    render() {

        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-5">
                        {this.renderAuthComponent()}
                    </div>
                </div>
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
    onSaveForgetPassword: saveForgetPasswordHandler
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);
