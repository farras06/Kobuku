import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { connect } from "react-redux"
import { Table } from "reactstrap"
import ButtonUI from "../../components/Button/Button"
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import swal from "sweetalert"


class AdminPayment extends React.Component {

    state = {
        getUserTransaction: [],
        listProductDetail: [],
        activeUser: [],
        modalOpenOption: false,
        selectedImage: null,
        transactionId: '',
        transfer: null,
        confirmDate: new Date,
        rejectedDate: new Date,
        status: "pending"

    }

    componentDidMount() {
        this.getUserTransaction(this.state.status)
    }

    getUserTransaction = (val) => {
        Axios.get(`${API_URL}/transaction?status=${val}`)
            .then(res => {
                this.setState({ getUserTransaction: res.data })
                console.log(this.state.getUserTransaction)
            })
            .catch(err => {
                console.log(err)
            })
    }

    toggleModal = () => {
        this.setState({ modalOpenOption: !this.state.modalOpenOption });
    };

    optionBtnHandler = (id, transfer, status) => {
        this.setState({
            transactionId: id,
            modalOpenOption: true,
            transfer: transfer,
            status: status
        });
    };

    fileChangeHandler = (e) => {
        this.setState({ selectedImage: e.target.files[0] });
    };


    confirmHandler = (transactionId) => {
        Axios.put(`${API_URL}/transaction/admin/accept/${transactionId}`, {
            confirmDate: this.state.confirmDate.toLocaleDateString(),
        })
            .then((res) => {
                console.log(res)
                this.getUserTransaction()
                this.setState({ modalOpenOption: false });
            })
            .catch((err) => {
                console.log(err)
            })
    }

    rejectHandler = (transactionId) => {
        Axios.put(`${API_URL}/transaction/admin/reject/${transactionId}`, {
            rejectedDate: this.state.confirmDate.toLocaleDateString(),
        })
            .then((res) => {
                console.log(res)
                this.getUserTransaction()
                this.setState({ modalOpenOption: false });
            })
            .catch((err) => {
                console.log(err)
            })
    }


    renderUserHistory = () => {
        return this.state.getUserTransaction.map((val, idx) => {
            const { confirmDate, purchaseDate, status, totalPrice, transactionDetail, id, transfer, user } = val
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
                        <td> {user.username} </td>
                        <td> {purchaseDate} </td>
                        <td> {confirmDate} </td>
                        <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)} </td>
                        <td> {status} </td>
                        <td>
                            <div className="d-flex flex-column">
                                <ButtonUI
                                    onClick={() => this.optionBtnHandler(id, transfer, status)}
                                    type="contained"
                                >
                                    Option
                                    </ButtonUI>

                            </div>
                        </td>
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
                                        {transactionDetail.map((value, idx) => {
                                            return (
                                                <div className="mt-4 row justify-content-center">

                                                    <div className="m-3">
                                                        <img
                                                            src={value.product.image}
                                                            alt=""
                                                            style={{ width: "100px", height: "200px", objectFit: "contain" }}
                                                        />{" "}
                                                    </div>

                                                    <div className="m-3">
                                                        <h6 className="mt-3">
                                                            Product Name:
                                                            <span style={{ fontWeight: "normal" }}> {value.product.productName}  </span>
                                                        </h6>

                                                        <h6>
                                                            Price :
                                                        <span style={{ fontWeight: "normal" }}> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value.product.price)} </span>
                                                        </h6>

                                                        <h6>
                                                            Quantity:
                                                        <span style={{ fontWeight: "normal" }}> {value.quantity}  </span>
                                                        </h6>

                                                        <h6>
                                                            Items Price :
                                                        <span style={{ fontWeight: "normal" }}> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value.totalPriceProduct)} </span>
                                                        </h6>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </>
            );

        })
    }

    render() {
        return (
            <>
                <div className="d-flex justify-content-center flex-row align-items-center my-3">

                    <ButtonUI
                        type="outlined"
                        onClick={() => this.getUserTransaction("accepted")}
                    >ACCEPTED
                    </ButtonUI>

                    <ButtonUI
                        type="outlined"
                        className="ml-4"
                        onClick={() => this.getUserTransaction("pending")}
                    >PENDING
                    </ButtonUI>

                    <ButtonUI
                        type="outlined"
                        className="ml-4"
                        onClick={() => this.getUserTransaction("rejected")}
                    >REJECTED
                    </ButtonUI>
                </div>

                <div className="container">
                    <Table>
                        <thead>
                            <tr>
                                <th>NO</th>
                                <th>User Name</th>
                                <th>Transaction Date</th>
                                <th>Completed Date</th>
                                <th>Total Price</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderUserHistory()}
                        </tbody>
                    </Table>
                </div>

                <div>
                    <Modal
                        toggle={this.toggleModal}
                        isOpen={this.state.modalOpenOption}
                        className="edit-modal"
                    >
                        <ModalHeader toggle={this.toggleModal}>
                            <caption>
                                <h3>Option</h3>
                            </caption>
                        </ModalHeader>

                        <ModalBody>
                            <div className>
                                <h6> Tranfer Receipt </h6>
                                <img
                                    src={this.state.transfer}
                                >
                                </img>
                            </div>

                            <div className="d-flex flex-row py-5 justify-content-center row">

                                <div className="">
                                    <ButtonUI
                                        className="w-100"
                                        onClick={this.toggleModal}
                                        type="outlined"
                                    >
                                        Cancel
                                    </ButtonUI>
                                </div>

                                <div className="ml-4">
                                    {this.state.status != "accepted" && this.state.transfer != null ?
                                        <ButtonUI
                                            className="w-100"
                                            onClick={() => this.confirmHandler(this.state.transactionId)}
                                            type="contained"
                                        >
                                            Accept
                                        </ButtonUI> : null
                                    }

                                </div>

                                <div className="ml-4">
                                    {this.state.status != "rejected" && this.state.status != "accepted" ?
                                        <ButtonUI
                                            className="w-100"
                                            onClick={() => this.rejectHandler(this.state.transactionId)}
                                            type="contained"
                                        >
                                            Reject
                                        </ButtonUI> : null
                                    }
                                </div>
                            </div>
                        </ModalBody>

                    </Modal>
                </div>

            </>


        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(AdminPayment)



