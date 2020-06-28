import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { connect } from "react-redux"
import { Table } from "reactstrap"
import ButtonUI from "../../components/Button/Button"

class History extends React.Component {

    state = {
        historyList: [],
        listProductDetail: []
    }

    componentDidMount() {
        this.getUserHistory()
    }

    getUserHistory = () => {
        Axios.get(`${API_URL}/transaction`, {
            params: {
                userId: this.props.user.id,
                _embed: "transactionDetail"
            }
        })
            .then(res => {
                this.setState({ historyList: res.data })
                console.log(this.state.historyList)
            })
            .catch(err => {
                console.log(err)
            })
    }

    UserHistoryDetail = (id) => {
        const { transactionDetail } = this.state.historyList[id]
        this.setState({ listProductDetail: transactionDetail })
    }

    renderUserHistory = () => {
        return this.state.historyList.map((val, idx) => {
            const { transactionCompleted, transactionStarted, status, totalPrice, userName, } = val
            return (
                <>
                    <tr>
                        <td> {idx + 1} </td>
                        <td> {userName} </td>
                        <td> {transactionStarted} </td>
                        <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)} </td>
                        <td> {transactionCompleted} </td>
                        <td> {status} </td>
                        <td>
                            <ButtonUI
                                onClick={() => this.UserHistoryDetail(idx)}
                            > Detail
                                </ButtonUI>
                        </td>
                    </tr>

                </>
            )

        })
    }


    renderUserHistoryDetail = () => {
        return this.state.listProductDetail.map((val, idx) => {
            const { price, quantity, totalPrice, productName, } = val
            return (
                <>
                    <tr>
                        <td> {productName} </td>
                        <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)} </td>
                        <td> {quantity} </td>
                        <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalPrice)} </td>
                    </tr>

                </>

            )

        })
    }

    render() {
        return (
            <div className="container">
                <Table>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>User Name</th>
                            <th>Transaction Date</th>
                            <th>Total Price</th>
                            <th>Transaction Completed</th>
                            <th>status</th>
                            <th>Actiion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUserHistory()}
                    </tbody>
                </Table>

                <Table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUserHistoryDetail()}
                    </tbody>
                </Table>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(History)