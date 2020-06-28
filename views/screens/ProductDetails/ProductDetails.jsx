import React from "react"
import "../ProductDetails/ProductDetails.css"
import ButtonUI from "../../components/Button/Button"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { connect } from "react-redux"
import swal from 'sweetalert'

class ProductDetails extends React.Component {

    state = {
        productData: {
            image: "",
            productName: "",
            price: 0,
            desc: "",
            category: "",
            id: 0
        }
    }

    addToCartHandler = () => {
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId: this.props.user.id,
                productId: this.state.productData.id,
            }
        })
            .then(res => {
                if (res.data.length == 0) {
                    Axios.post(`${API_URL}/carts`, {
                        userId: this.props.user.id,
                        productId: this.state.productData.id,
                        quantity: 1
                    })
                        .then(res => {
                            console.log(res)
                            swal("Success!", "Item Added", "success")
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
                        quantity: res.data[0].quantity + 1
                    })
                        .then(res => {
                            console.log(res)
                            swal("Success!", "Item Added", "success")
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    addToWishListHandler = () => {
        Axios.get(`${API_URL}/wishList`, {
            params: {
                userId: this.props.user.id,
                productId: this.state.productData.id,
            }
        })
            .then(res => {
                if (res.data.length == 0) {
                    Axios.post(`${API_URL}/wishList`, {
                        userId: this.props.user.id,
                        productId: this.state.productData.id,
                    })
                        .then(res => {
                            console.log(res)
                            swal("Success!", "Item Added to Wish Liat", "success")
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    swal("Error", "Item already in Wish List", "error")

                }
            })
            .catch(err => {
                console.log(err)
            })

    }

    componentDidMount() {
        Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
            .then(res => {
                this.setState({ productData: res.data })
            })

            .catch(err => {
                console.log(err)
            })
    }

    render() {

        const { image, productName, price, desc, category } = this.state.productData

        return (
            <div>
                <div className="container">
                    <div className="row py-4">
                        <div className="col-6 text-center">
                            <img style={{ width: "100%", objectFit: "contain", height: "550px" }}
                                src={image}
                                alt=""
                            />

                        </div>

                        <div className="col-6 d-flex flex-column justify-content-center">
                            <h3>{productName}</h3>
                            <h4> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)}</h4>
                            <p className="mt-4">
                                {desc}
                            </p>

                            <div className="d-flex flex-row mt-4">
                                <ButtonUI
                                    onClick={this.addToCartHandler}
                                >Add to card </ButtonUI>
                                <ButtonUI className="ml-4" type="outlined"
                                    onClick={this.addToWishListHandler}
                                >
                                    Add to Wish List
                                </ButtonUI>
                            </div>
                        </div>
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


export default connect(mapStateToProps)(ProductDetails)