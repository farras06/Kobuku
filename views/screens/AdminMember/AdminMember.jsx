import React from "react";
import "./AdminMember.css"
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminMember extends React.Component {
    state = {
        userList: [],
        createForm: {
            username: "",
            fullName: '',
            password: "",
            email: "",
            role: "user",
        },
        editForm: {
            id: 0,
            username: "",
            fullName: '',
            password: "",
            email: "",
            role: "user",
        },
        activeUser: [],
        modalOpen: false,
    };

    getProductList = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                this.setState({ userList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderProductList = () => {
        return this.state.userList.map((val, idx) => {
            const { id, username, fullName, password, email, role } = val;
            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.activeUser.includes(idx)) {
                                this.setState({
                                    activeUser: [
                                        ...this.state.activeUser.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    activeUser: [...this.state.activeUser, idx],
                                });
                            }
                        }}
                    >
                        <td> {id} </td>
                        <td> {username} </td>
                        <td> {fullName} </td>
                    </tr>
                    <tr
                        className={`collapse-item ${
                            this.state.activeUser.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={3}>
                            <div className="d-flex justify-content-around align-items-center">
                                <div className="d-flex">
                                    <img src={email} alt="" />
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{username}</h5>
                                        <h6 className="mt-2">
                                            Password:
                                            <span style={{ fontWeight: "normal" }}> {password}</span>
                                        </h6>

                                        <h6>
                                            Email:
                                            <span style={{ fontWeight: "normal" }}> {email} </span>
                                        </h6>
                                        <h6>
                                            Role:
                                            <span style={{ fontWeight: "normal" }}> {role}</span>
                                        </h6>
                                    </div>
                                </div>

                                <div className="d-flex flex-column align-items-center">
                                    <ButtonUI
                                        onClick={(_) => this.editBtnHandler(idx)}
                                        type="contained"
                                    >
                                        Edit
                                    </ButtonUI>

                                    <ButtonUI className="mt-3" type="textual"
                                        onClick={() => this.deleteProductsHandler(id)}
                                    >
                                        Delete
                                    </ButtonUI>
                                </div>
                            </div>
                        </td>
                    </tr>
                </>
            );
        });
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

    createProductHandler = () => {
        Axios.post(`${API_URL}/users`, this.state.createForm)
            .then((res) => {
                swal("Success!", "Your item has been added to the list", "success");
                this.setState({
                    createForm: {
                        username: "",
                        fullName: 0,
                        password: "",
                        email: "",
                        role: "",
                    },
                });
                this.getProductList();
            })
            .catch((err) => {
                swal("Error!", "Your item could not be added to the list", "error");
            });
    };

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.userList[idx],
            },
            modalOpen: true,
        });
    };

    editProductHandler = () => {
        Axios.put(
            `${API_URL}/users/${this.state.editForm.id}`,
            this.state.editForm
        )
            .then((res) => {
                swal("Success!", "Your item has been edited", "success");
                this.setState({ modalOpen: false });
                this.getProductList();
            })
            .catch((err) => {
                swal("Error!", "Your item could not be edited", "error");
                console.log(err);
            });
    };

    deleteProductsHandler = (id) => {
        Axios.delete(`${API_URL}/users/${id}`)
            .then((res) => {
                this.getProductList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };
    componentDidMount() {
        this.getProductList();
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>User</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Name</th>
                                <th>Full Name</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderProductList()}</tbody>
                    </table>
                </div>
                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add Member</h2>
                    </caption>
                    <div className="row">
                        <div className="col-4">
                            <TextField
                                value={this.state.createForm.username}
                                placeholder="User Name"
                                onChange={(e) => this.inputHandler(e, "username", "createForm")}
                            />
                        </div>
                        <div className="col-8">
                            <TextField
                                value={this.state.createForm.fullName}
                                placeholder="Full Name"
                                onChange={(e) => this.inputHandler(e, "fullName", "createForm")}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <textarea
                                value={this.state.createForm.password}
                                onChange={(e) => this.inputHandler(e, "password", "createForm")}
                                style={{ resize: "none" }}
                                placeholder="Password"
                                className="custom-text-input"
                            ></textarea>
                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createForm.email}
                                placeholder="Email"
                                onChange={(e) => this.inputHandler(e, "email", "createForm")}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <select
                                value={this.state.createForm.role}
                                className="custom-text-input h-100 pl-3"
                                onChange={(e) => this.inputHandler(e, "role", "createForm")}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>

                            </select>
                        </div>
                        <div className="col-3 mt-3">
                            <ButtonUI onClick={this.createProductHandler} type="contained">
                                Create Member
                            </ButtonUI>
                        </div>
                    </div>
                </div>
                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpen}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Member</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-4">
                                <TextField
                                    value={this.state.editForm.username}
                                    placeholder="User Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "username", "editForm")
                                    }
                                />
                            </div>
                            <div className="col-8">
                                <TextField
                                    value={this.state.editForm.fullName}
                                    placeholder="Full Name"
                                    onChange={(e) => this.inputHandler(e, "fullName", "editForm")}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <TextField
                                    value={this.state.editForm.password}
                                    placeholder="Password"
                                    onChange={(e) => this.inputHandler(e, "password", "editForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editForm.email}
                                    placeholder="email Source"
                                    onChange={(e) => this.inputHandler(e, "email", "editForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <select
                                    value={this.state.editForm.role}
                                    className="custom-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "role", "editForm")}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>

                                </select>
                            </div>
                            <div className="col-12 text-center my-3">
                                <img src={this.state.editForm.email} alt="" />
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
                                    onClick={this.editProductHandler}
                                    type="contained"
                                >
                                    Save
                                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
export default AdminMember;