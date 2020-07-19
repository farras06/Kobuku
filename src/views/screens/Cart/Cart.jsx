import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import { Table, Alert } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";


import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Link } from "react-router-dom";
import { itemInCart } from "../../../redux/actions/"
import swal from 'sweetalert'

class Cart extends React.Component {

  state = {
    cartData: [],
    checkOutData: [],
    purchaseDate: new Date,
    isCheckOut: false,
    totalPrice: 0,
    deliveryMethod: 0,
    ItemsPrice: 0
  };

  inputHandler = (e, field) => {
    this.setState({ [field]: e.target.value })
  }

  getCartData = () => {
    Axios.get(`${API_URL}/cart/userCart/${this.props.user.id}`)
      .then((res) => {
        console.log(res.data);
        this.setState({ cartData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  renderCartData = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id, stockUser } = val;
      //const { productName, image, price} = product;
      return (
        <tr>
          <td>{idx + 1}</td>
          <td>{product.productName}</td>
          <td>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(product.price)}</td>
          <td>{quantity}</td>
          <td>
            {" "}
            <img
              src={product.image}
              alt=""
              style={{ width: "100px", height: "200px", objectFit: "contain" }}
            />{" "}
          </td>

          <tr>
            <td>
              <ButtonUI
                type="outlined"
                onClick={() => this.deleteCartHandler(id)}
              >
                Delete Item
            </ButtonUI>
            </td>

            {product.stockUser <= 1 ? null :
              <td>
                <FontAwesomeIcon
                  icon={faPlus}
                  type="outlined"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.addQuantityHandler(id, product.id)}
                >
                </FontAwesomeIcon>
              </td>
            }

            {quantity <= 1 ? null :
              <td>
                <FontAwesomeIcon
                  icon={faMinus}
                  style={{ cursor: "pointer" }}
                  type="outlined"
                  onClick={() => this.reduceQuantityHandler(id, product.id)}
                >
                </FontAwesomeIcon>
              </td>

            }

          </tr>
        </tr>
      );
    });
  };

  addQuantityHandler = (id, productId) => {
    Axios.put(`${API_URL}/cart/addQuantity/${id}/${productId}`)
      .then((res) => {
        console.log(res.data)
        this.props.itemInCart(this.props.user.id);
        swal("Succes!", "Item Added to Your Cart", "success")
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  reduceQuantityHandler = (id, productId) => {
    Axios.put(`${API_URL}/cart/reduceQuantity/${id}/${productId}`)
      .then((res) => {
        console.log(res.data)
        this.props.itemInCart(this.props.user.id);
        swal("Success!", "Item Reduce From Your Cart", "success")
        this.getCartData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  deleteCartHandler = (id) => {
    Axios.delete(`${API_URL}/cart/deleteCart/${id}`)
      .then((res) => {
        console.log(res)
        swal("Success!", "Items Remove From Your Cart 😔😔", "success")
        this.getCartData();
      })
      .catch((err) => {
        console.log(err)
      })
  }

  componentDidMount() {
    this.getCartData();
  }

  checkOutHandler = () => {
    let itemPrice = 0
    this.setState({ isCheckOut: true })
    let delivery = parseInt(this.state.deliveryMethod)
    this.state.cartData.map(val => {
      itemPrice += (val.product.price * val.quantity)
    })

    this.setState({
      totalPrice: itemPrice + delivery,
      ItemsPrice: itemPrice
    })
    console.log(this.state.totalPrice)
  }

  checkOutDisplay = () => {
    return (
      <div className="container py-4">
        <Table>
          <thead>
            <tr>
              <td>NO</td>
              <td>Product</td>
              <td>Price</td>
              <td>Quantity</td>
              <td>sub Total</td>
            </tr>
          </thead>
          {this.state.cartData.map((val, idx) => {
            return (
              <tbody>
                <tr>
                  <td> {idx + 1} </td>
                  <td> {val.product.productName} </td>
                  <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.product.price)} </td>
                  <td> {val.quantity} </td>
                  <td> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(val.quantity * val.product.price)} </td>
                </tr>
              </tbody>
            )
          })}
          <tfoot>
            <tr>
              <td> Items Price  </td>
              <td className="ml-4"> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(this.state.ItemsPrice)} </td>
            </tr>
            <tr>
              <td> Delivery Price   </td>
              <td className="ml-4"> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(this.state.deliveryMethod)} </td>
            </tr>
            <tr>
              <td> Total Price   </td>
              <td className="ml-4"> {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(this.state.totalPrice)} </td>
            </tr>
          </tfoot>
        </Table>

        <ButtonUI type="outlined" onClick={() => { this.confirmHandler() }}> Confirm </ButtonUI>
      </div>
    )
  }

  confirmHandler = () => {

    Axios.get(`${API_URL}/cart/userCart/${this.props.user.id}`)
      .then(res => {
        console.log(res.data)
        res.data.map((val) => {
          Axios.delete(`${API_URL}/cart/deleteCartUserTransaction/${val.id}`)
            .then(res => {
              console.log(res)
              this.props.itemInCart(this.props.user.id);
            })

            .catch(err => {
              console.log(err)
            })
        })

        Axios.post(`${API_URL}/transaction/addTransaction/${this.props.user.id}`, {
          totalPrice: this.state.totalPrice,
          status: "pending",
          transfer: "",
          purchaseDate: this.state.purchaseDate.toLocaleDateString(),
          confirmDate: "",
          delivery: this.state.deliveryMethod,
        })
          .then((res) => {
            this.state.cartData.map(val => {
              Axios.post(`${API_URL}/transactionDetail/addTransactionDetail/${res.data.id}/${val.product.id}`, {
                price: val.product.price,
                totalPriceProduct: val.product.price * val.quantity,
                quantity: val.quantity
              })
                .then(res => {
                  console.log(res)
                })
                .catch(err => {
                  console.log(err)
                })
            })
            swal("Success!", "Go to Payment to Complete Your Transaction", "success")
            this.setState({ cartData: '' })
          })
      })

      .catch(err => {
        console.log(err)
      })
  }

  checkboxhandler = (e, idx) => {
    const { checked } = e.target

    if (checked) {
      this.setState({ checkOutData: [...this.state.checkOutData, idx] })
    } else {
      this.setState({ checkOutData: [...this.state.checkOutData.filter((val) => val !== idx)] })
    }
  }

  render() {

    return (
      <div className="container py-4">
        {this.state.cartData.length > 0 ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{this.renderCartData()}</tbody>

              <div className="mt-6">
                <p>Choose Delivery Option :</p>
                <select
                  value={this.state.deliveryMethod}
                  onChange={(e) => this.inputHandler(e, "deliveryMethod")}
                  className="custom-text-input h-100 pl-3"
                >
                  <option value="" disabled="disabled">payment method</option>
                  <option value="100000">Instant</option>
                  <option value="50000">Same Day</option>
                  <option value="20000">Express</option>
                  <option value="0">Economy</option>
                </select>
              </div>
            </Table>
            <ButtonUI type="outlined" onClick={this.checkOutHandler}> Check Out </ButtonUI>

            {
              this.state.isCheckOut ? (this.checkOutDisplay()) : null
            }
          </>
        ) : (
            <Alert>
              Your cart is empty! <Link to="/">Go shopping</Link>
            </Alert>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

