import React from "react";
import "./ProductCard.css";
import ButtonUI from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

interface ProductCardData {
  id?: number;
  productName?: string;
  price?: number;
  review?: number;
  image?: string;
  category?: [];
  stockUser?: number
}

type ProductCardProps = {
  data?: ProductCardData;
  className?: string;
};

class ProductCard extends React.Component<ProductCardProps> {
  render() {
    const { id, productName, price, category, image } = this.props.data;

    return (
      <div className={`product-card d-inline-block ${this.props.className}`}>
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={this.props.data.productName}
            style={{ width: "224px", height: "250px", objectFit: "contain" }}
          />
        </Link>
        <div>
          <p className="mt-3">{productName}</p>
          <h5 style={{ fontWeight: "bolder" }}>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(price)}
          </h5>

        </div>
        <div className="d-flex flex-row align-items-center justify-content-between mt-2">

        </div>
      </div>
    );
  }
}

export default ProductCard;
