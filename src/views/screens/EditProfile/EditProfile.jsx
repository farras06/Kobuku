import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Cookies from "universal-cookie";

import TextField from "../../components/TextField/TextField";
import ButtonUI from "../../components/Button/Button";

import { EditProfileHandler, loginHandler } from "../../../redux/actions";
import swal from "sweetalert";
import Axios from "axios";
import { API_URL } from "../../../constants/API";



class EditProfile extends React.Component {
    state = {
        activePage: "register",
        loginForm: {
            username: "",
            password: "",
            showPassword: false,
        },
        editForm: {
            username: this.props.user.username,
            fullName: this.props.user.fullName,
            email: this.props.user.email,
            address: this.props.user.address,
            oldPassword: "",
            newPassword: '',
            newRePassword: '',
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

    editProfileBtnHandler = () => {
        const { username, fullName, oldPassword, email, newPassword, newRePassword, address } = this.state.editForm;
        let newUser = {
            id: this.props.user.id,
            username,
            fullName,
            oldPassword,
            newPassword,
            address,
            email,
        };

        if (username == "" || fullName == "" || oldPassword == "" || newPassword == "" || newRePassword == "" || email == "" || address == "") {
            swal("Fail", "Fill all the empty field", "error")
        } if (newPassword != newRePassword) {
            swal("Fail", "New Password isn't Match", "error")
        } if (this.props.user.verified == 0) {
            swal("Fail", "Your Account is not Verified, Verified Your Account First", "error")
        }

        if ((username != "" || fullName != "" || oldPassword != "" || newPassword != "" || newRePassword != "" || email != "" || address != "") && (newPassword == newRePassword) && (this.props.user.verified != 0)) {
            this.props.onEditProfile(newUser)
        }
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

    resendVerificationHandler = () => {
        Axios.get(`${API_URL}/users/verifyAgain/${this.props.user.username}`)
            .then((res) => {
                console.log(res)
                swal("Success!", "Your Email Verification has been Resend", "success")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderAuthComponent = () => {
        return (
            <div className="mt-5">
                <h3>Edit Profile</h3>
                <p className="mt-4">
                    Reader Always Reading
                </p>
                <TextField
                    value={this.state.editForm.username}
                    onChange={(e) => this.inputHandler(e, "username", "editForm")}
                    placeholder="Username"
                    className="mt-5"
                />
                <TextField
                    value={this.state.editForm.fullName}
                    onChange={(e) => this.inputHandler(e, "fullName", "editForm")}
                    placeholder="Name"
                    className="mt-2"
                />
                <TextField
                    value={this.state.editForm.email}
                    onChange={(e) => this.inputHandler(e, "email", "editForm")}
                    placeholder="Email"
                    className="mt-2"
                />

                <TextField
                    value={this.state.editForm.address}
                    onChange={(e) => this.inputHandler(e, "address", "editForm")}
                    placeholder="Address"
                    className="mt-2"
                />
                <TextField
                    value={this.state.editForm.password}
                    onChange={(e) => this.inputHandler(e, "oldPassword", "editForm")}
                    placeholder="Old Password"
                    className="mt-2"
                    type={this.state.editForm.showPassword ? "text" : "password"}
                />

                <TextField
                    value={this.state.editForm.rePassword}
                    onChange={(e) => this.inputHandler(e, "newPassword", "editForm")}
                    placeholder="New Password"
                    className="mt-2"
                    type={this.state.editForm.showPassword ? "text" : "password"}
                />

                <TextField
                    value={this.state.editForm.rePassword}
                    onChange={(e) => this.inputHandler(e, "newRePassword", "editForm")}
                    placeholder="Re-enter New Password"
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
                        onClick={() => this.editProfileBtnHandler()}
                        className="mt-4"
                    >
                        Save
                    </ButtonUI>
                </div>
            </div>
        );

    };

    render() {

        return (
            <div className="container">
                <div className="row mt-5">
                    <div
                        className="col-5 mt-5"
                        style={{ border: "1px solid black ", padding: "10px", borderRadius: "10px" }}
                    >
                        <h3> Current Profile : </h3>

                        {this.props.user.verified == 1 ?
                            <p className="mt-4" style={{ textAlign: "center" }}> Your Account is Verified</p> :
                            <p className="mt-4" style={{ textAlign: "center" }}> Your Account is Not Verified</p>
                        }
                        <center>

                            {this.props.user.verified != 1 ?
                                <div>
                                    <ButtonUI
                                        type="contained"
                                        onClick={() => this.resendVerificationHandler()}
                                        className="mt-4"
                                    >
                                        Resend Verification
                            </ButtonUI>
                                </div> : null
                            }


                            <div className="d-flex flex-column mt-5" style={{ height: "60px", width: "80%", marginTop: "20px", borderRadius: "8px", border: "1px solid wheat" }}>
                                <div style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", backgroundColor: "#fcd4c4" }}> <h6>Username</h6></div>
                                <div> < h6 className="mt-1">{this.props.user.username}</h6></div>
                            </div>

                            <div className="d-flex flex-column mt-5" style={{ height: "60px", width: "80%", marginTop: "20px", borderRadius: "8px", border: "1px solid wheat" }}>
                                <div style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", backgroundColor: "#fcd4c4" }}> <h6>Full Name</h6></div>
                                <div> < h6 className="mt-1">{this.props.user.fullName}</h6></div>
                            </div>

                            <div className="d-flex flex-column mt-5" style={{ height: "60px", width: "80%", marginTop: "20px", borderRadius: "8px", border: "1px solid wheat" }}>
                                <div style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", backgroundColor: "#fcd4c4" }}> <h6>Email</h6></div>
                                <div> < h6 className="mt-1">{this.props.user.email}</h6></div>
                            </div>

                            <div className="d-flex flex-column mt-5" style={{ height: "60px", width: "80%", marginTop: "20px", borderRadius: "8px", border: "1px solid wheat" }}>
                                <div style={{ borderTopLeftRadius: "8px", borderTopRightRadius: "8px", backgroundColor: "#fcd4c4" }}> <h6>Address</h6></div>
                                <div> < h6 className="mt-1">{this.props.user.address}</h6></div>
                            </div>
                        </center>


                    </div>
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
    onEditProfile: EditProfileHandler,
    onLogin: loginHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
