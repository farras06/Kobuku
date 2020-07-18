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

    getUserList = () => {
        Axios.get(`${API_URL}/users/getUser`)
            .then((res) => {
                this.setState({ userList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderUserList = () => {
        return this.state.userList.map((val, idx) => {
            const { id, username, fullName, address, email, role } = val;
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
                        <td> {idx + 1} </td>
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
                                    {/* <img src={email} alt="" /> */}
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{username}</h5>

                                        <h6>
                                            ID :
                                            <span style={{ fontWeight: "normal" }}> {id} </span>
                                        </h6>
                                        <h6>
                                            Email:
                                            <span style={{ fontWeight: "normal" }}> {email} </span>
                                        </h6>

                                        <h6>
                                            Address:
                                            <span style={{ fontWeight: "normal" }}> {address} </span>
                                        </h6>
                                        <h6>
                                            Role:
                                            <span style={{ fontWeight: "normal" }}> {role}</span>
                                        </h6>
                                    </div>
                                </div>

                                <div className="d-flex flex-column align-items-center">
                                    <ButtonUI
                                        onClick={() => this.editBtnHandler(idx)}
                                        type="contained"
                                    >
                                        Edit
                                    </ButtonUI>

                                    <ButtonUI className="mt-3" type="textual"
                                        onClick={() => this.deleteUserHandler(id)}
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

    createUserHandler = () => {
        Axios.post(`${API_URL}/users`, this.state.createForm)
            .then((res) => {
                swal("Success!", "New Account Has Created", "success");
                console.log(this.state.createForm)
                this.setState({
                    createForm: {
                        username: "",
                        fullName: 0,
                        password: "",
                        email: "",
                        role: "",
                    },
                });
                this.getUserList();
            })
            .catch((err) => {
                swal("Error!", "Fail to Create new Account", "error");
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

    ediUserHandler = (id) => {
        console.log(this.state.editForm)
        Axios.put(`${API_URL}/users/EditUserByAdmin/${id}`, this.state.editForm)
            .then((res) => {
                console.log(res)
                swal("Success!", "The User has been Edited", "success");
                this.setState({ modalOpen: false });
                this.getUserList();
            })
            .catch((err) => {
                swal("Error!", "Fail to Edit the User", "error");
                console.log(err);
            });
    };

    deleteUserHandler = (id) => {
        Axios.delete(`${API_URL}/users/deleteUser/${id}`)
            .then((res) => {
                this.getUserList();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    toggleModal = () => {
        this.setState({ modalOpen: !this.state.modalOpen });
    };
    componentDidMount() {
        this.getUserList();
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
                                <th>No </th>
                                <th>User Name</th>
                                <th>Full Name</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderUserList()}</tbody>
                    </table>
                </div>

                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add User</h2>
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
                        <div className="col-3 mt-3">
                            <TextField
                                value={this.state.createForm.password}
                                onChange={(e) => this.inputHandler(e, "password", "createForm")}
                                style={{ resize: "none" }}
                                placeholder="Password"
                                className="custom-text-input"
                            ></TextField>
                        </div>
                        <div className="col-9 mt-3">
                            <TextField
                                value={this.state.createForm.address}
                                placeholder="Address"
                                onChange={(e) => this.inputHandler(e, "address", "createForm")}
                            />
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
                            <ButtonUI onClick={this.createUserHandler} type="contained">
                                Create User
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
                            <h3>Edit User</h3>
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
                                    value={this.state.editForm.address}
                                    placeholder="Address"
                                    onChange={(e) => this.inputHandler(e, "address", "editForm")}
                                />
                            </div>
                            <div className="col-8 mt-3">
                                <TextField
                                    value={this.state.editForm.email}
                                    placeholder="email Source"
                                    onChange={(e) => this.inputHandler(e, "email", "editForm")}
                                />
                            </div>
                            <div className="col-4 mt-3">
                                <select
                                    value={this.state.editForm.role}
                                    className="custom-text-input h-100 pl-3"
                                    onChange={(e) => this.inputHandler(e, "role", "editForm")}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>

                                </select>
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
                                    onClick={() => this.ediUserHandler(this.state.editForm.id)}
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