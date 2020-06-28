import React from "react";
import { connect } from "react-redux";
import { Table, Alert } from "reactstrap";

import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom"
import swal from 'sweetalert'


class WishList extends React.Component {

    state = {
        wishListData: [],
    };

    componentDidMount() {
        this.getWishListData()
    }

    getWishListData = () => {
        Axios.get(`${API_URL}/wishList`, {
            params: {
                userId: this.props.user.id,
                _expand: "product"
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({ wishListData: res.data });
                console.log(this.state.wishListData)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    renderWishList = () => {
        return this.state.wishListData.map((val, idx) => {
            const { product, id } = val
            const { productName, image, price, category } = product
            return (
                <tr>
                    <td> {idx + 1} </td>
                    <td> {productName} </td>
                    <td> {category} </td>
                    <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)} </td>
                    <td>
                        <img
                            src={image}
                            alt=""
                            style={{ width: "100px", height: "200px", objectFit: "contain" }}
                        />
                    </td>
                    <td>
                        <ButtonUI
                            type="contained"
                            onClick={() => this.deleteWishLitHandler(id)}
                        > Delete
                        </ButtonUI>

                    </td>
                </tr>
            )
        })
    }

    deleteWishLitHandler = (id) => {
        Axios.delete(`${API_URL}/wishList/${id}`)
            .then(res => {
                console.log(res)
                this.getWishListData()
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <div className="container py-4">
                <Table>
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>Product Name</th>
                            <th>category</th>
                            <th>Price</th>
                            <th>Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody> {this.renderWishList()} </tbody>
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

export default connect(mapStateToProps)(WishList)