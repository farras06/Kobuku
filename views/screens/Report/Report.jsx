import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { Table } from "reactstrap"


class Report extends React.Component {

    state = {
        listUser: [],
        listusername: [],
        priceTotalUserTransactionCompleted: [],
        transactionProduct: [],
        product: []
    }

    componentDidMount() {
        this.getReportData()
    }

    getReportData = () => {
        Axios.get(`${API_URL}/users`)
            .then(res => {
                this.setState({ listUser: res.data })
                res.data.map((val) => {
                    const { username } = val
                    this.setState({ listusername: [...this.state.listusername, username] })
                })
                this.state.listUser.map((val) => {
                    const { id } = val
                    Axios.get(`${API_URL}/transaction`, {
                        params: {
                            userId: id,
                            status: "done",
                            _embed: "transactionDetail"
                        }
                    })
                        .then(res => {
                            let priceTotal = 0
                            // console.log(res.data)
                            res.data.map(val => {
                                const { totalPrice } = val
                                priceTotal += totalPrice
                            })
                            this.setState({ priceTotalUserTransactionCompleted: [...this.state.priceTotalUserTransactionCompleted, priceTotal] })
                            // console.log(this.state.priceTotalUserTransactionCompleted)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            })
            .catch(err => {
                console.log(err)
            })

        Axios.get(`${API_URL}/transaction`, {
            params: {
                status: "done",
                _embed: "transactionDetail"
            }
        })
            .then((res) => {
                this.setState({ transactionProduct: res.data })
                console.log(this.state.transactionProduct)

            })
            .catch((err) => {
                console.log(err)
            })

        Axios.get(`${API_URL}/products`)
            .then((res) => {
                this.setState({ product: res.data })
                console.log(this.state.product)
            })
            .catch((err) => {
                console.log(err)
            })

    }

    renderUserTotalPrice = () => {
        return this.state.priceTotalUserTransactionCompleted.map((val, idx) => {
            return (
                <tr>
                    <td> {idx + 1} </td>
                    <td> {this.state.listusername[idx]} </td>
                    <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val)} </td>
                </tr>
            )
        })
    }

    renderTotalProductBought = () => {
        return this.state.product.map((val, idx) => {

            const { productName, id } = val
            let totalQuantity = 0

            this.state.transactionProduct.map((value) => {

                value.transactionDetail.map((nilai) => {

                    if (id === nilai.productId) {
                        totalQuantity += nilai.quantity
                    }
                })
            })
            return (
                <>
                    <tr>
                        <td>{idx + 1}</td>
                        <td>{productName}</td>
                        <td>{totalQuantity}</td>
                    </tr>
                </>
            )
        })
    }




    render() {
        return (
            <div>
                <Table>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>User Name</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUserTotalPrice()}
                    </tbody>
                </Table>

                <Table>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>Product Name</th>
                            <th>Total Bought</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTotalProductBought()}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Report