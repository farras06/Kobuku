import React from "react"
import "../ProductDetails/ProductDetails.css"
import ButtonUI from "../../components/Button/Button"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { connect } from "react-redux"
import { itemInCart } from "../../../redux/actions/"
import swal from 'sweetalert'
import Cart from "../Cart/Cart"

class ProductDetails extends React.Component {

    state = {
        productData: {
            image: "",
            productName: "",
            price: 0,
            description: "",
            category: [],
            id: 0
        },
        cart: []
    }

    addToCartHandler = () => {
        if (this.props.user.id < 1) {
            swal("Sorry :(", "You have not login yet, please login before add your item", "error");
        } else {
            Axios.get(`${API_URL}/cart/userCart/${this.props.user.id}`)
                .then((res) => {
                    console.log(res);
                    this.setState({ cart: res.data });
                    let checkItems = this.state.cart.findIndex((val) => {
                        return (
                            val.product.id == this.state.productData.id
                        )
                    })
                    if (checkItems == -1) {
                        Axios.post(
                            `${API_URL}/cart/addToCart/${this.props.user.id}/${this.state.productData.id}`,
                            {
                                quantity: 1,
                            }
                        )
                            .then((res) => {
                                console.log(res.data);
                                swal("Add to cart", "New item has been added to your cart", "success");
                                this.props.itemInCart(this.props.user.id);
                                this.getProductData()
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        Axios.put(`${API_URL}/cart/addQuantity/${this.state.cart[checkItems].id}/${this.state.productData.id}`)
                            .then((res) => {
                                console.log(res)
                                swal("Add to cart", "Quantity item has been added to your cart", "success")
                                this.props.itemInCart(this.props.user.id);
                                this.getProductData()
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }
                });
        }
    };

    getProductData = () => {
        Axios.get(`${API_URL}/products/getProductCard/${this.props.match.params.productId}`)
            .then(res => {
                this.setState({ productData: res.data })
            })

            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        this.getProductData()
    }

    render() {
        const { image, productName, price, description, category, stockUser } = this.state.productData

        return (
            <div>
                <div className="container">
                    <div className="row py-4">
                        <div className="col-6 text-center">
                            <img style={{ width: "100%", objectFit: "contain", height: "400px" }}
                                src={image}
                                alt=""
                            />
                        </div>

                        <div className="col-6 d-flex flex-column justify-content-center">

                            <h3>{productName}</h3>

                            <h5> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(price)}</h5>
                            <div> Genres :
                                {
                                    category.map((val, idx) => {
                                        if (idx == 0) {
                                            return (
                                                <span style={{ fontWeight: "normal" }}> {val.categoryName} </span>
                                            )
                                        } else {
                                            return (
                                                <span style={{ fontWeight: "normal" }}>, {val.categoryName} </span>
                                            )
                                        }
                                    })
                                }
                            </div>

                            <p className="mt-2"> Avability : {stockUser} Books </p>
                            <p className="mt-4">{description}</p>

                            <div className="d-flex flex-row mt-4">

                                {stockUser <= 1 ? null :
                                    <ButtonUI
                                        onClick={this.addToCartHandler}
                                    >Add to Cart </ButtonUI>
                                }

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

const mapDispatchToProps = {
    itemInCart
};


export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)