import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { connect } from "react-redux"
import { Table } from "reactstrap"
import ButtonUI from "../../components/Button/Button"
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import swal from "sweetalert";

class History extends React.Component {

    state = {
        getUserTransaction: [],
        listProductDetail: [],
        activeUser: [],
        modalOpenTranser: false,
        selectedImage: null,
        transactionId: '',
        transfer: '',
        status: "pending"
    }

    componentDidMount() {
        this.getUserTransaction(this.state.status)
    }

    getUserTransaction = (val) => {
        Axios.get(`${API_URL}/transaction/userTransaction/${this.props.user.id}?status=${val}`)
            .then(res => {
                this.setState({ getUserTransaction: res.data, status: val })
                console.log(this.state.getUserTransaction)
            })
            .catch(err => {
                console.log(err)
            })
    }

    toggleModal = () => {
        this.setState({ modalOpenTranser: !this.state.modalOpenTranser });
    };

    optionBtnHanlder = (id, transfer, status) => {
        console.log(this.state.status)
        this.setState({
            transactionId: id,
            modalOpenTranser: true,
            transfer: transfer,
            status: status
        });
    };

    fileChangeHandler = (e) => {
        this.setState({ selectedImage: e.target.files[0] });
    };

    uploadBuktiHandler = (transactionId) => {
        let formData = new FormData();
        if (this.state.selectedImage) {
            formData.append(
                "file",
                this.state.selectedImage,
                this.state.selectedImage.name
            );
        }

        Axios.put(`${API_URL}/transaction/transfer/${transactionId}`, formData)
            .then((res) => {
                swal("Success!", "Your Transfer Receipt has been Uploaded", "success");
                this.setState({ modalOpenTranser: false });
                this.getUserTransaction();
            })
            .catch((err) => {
                swal("Error!", "Fail to Upload Your Transfer Receipt", "error");
                console.log(err);
            });
    };

    renderUserHistory = () => {
        return this.state.getUserTransaction.map((val, idx) => {
            const { confirmDate, purchaseDate, status, totalPrice, transactionDetail, id, transfer } = val
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
                        <td> {id} </td>
                        <td> {purchaseDate} </td>
                        <td> {confirmDate} </td>
                        <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)} </td>
                        <td> {status} </td>
                        <td>
                            <div className="d-flex flex-column">
                                <ButtonUI
                                    onClick={() => this.optionBtnHanlder(id, transfer, status)}
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
                                                        <span style={{ fontWeight: "normal" }}>  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value.totalPriceProduct)} </span>
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
                                <th>Transaction No</th>
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
                        isOpen={this.state.modalOpenTranser}
                        className="edit-modal"
                    >
                        <ModalHeader toggle={this.toggleModal}>
                            <caption>
                                <h3>Transfer Recipt</h3>
                            </caption>
                        </ModalHeader>

                        <ModalBody>
                            <div>

                                <img
                                    src={this.state.transfer}
                                >
                                </img>
                            </div>

                            {(this.state.status != "accepted") ?
                                <div className="col-6 mt-3">
                                    Image :
                                    <input className="mt-3 ml-4"
                                        type="file"
                                        name="file"
                                        onChange={(e) => {
                                            this.fileChangeHandler(e, "selectedImage");
                                        }}
                                    />
                                </div> : null
                            }

                            <div className="d-flex flex-row py-5">
                                <div className="col-5  offset-1">
                                    <ButtonUI
                                        className="w-100"
                                        onClick={this.toggleModal}
                                        type="outlined"
                                    >
                                        Cancel
                                    </ButtonUI>
                                </div>

                                {(this.state.status != "accepted") ?

                                    <div className=" col-5 ">
                                        <ButtonUI
                                            className="w-100"
                                            onClick={() => this.uploadBuktiHandler(this.state.transactionId)}
                                            type="contained"
                                        >
                                            Upload
                                    </ButtonUI>
                                    </div> : null
                                }
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

export default connect(mapStateToProps)(History)