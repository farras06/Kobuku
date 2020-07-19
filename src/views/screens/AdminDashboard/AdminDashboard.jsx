import React from "react";
import "./AdminDashboard.css";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { API_URL } from "../../../constants/API";

import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";

import swal from "sweetalert";

class AdminDashboard extends React.Component {
    state = {
        productList: [],
        categoryList: [],
        createForm: {
            productName: "",
            price: 0,
            image: "",
            description: "",
            stockStorage: 0,
            category: []
        },
        editForm: {
            id: 0,
            productName: "",
            price: 0,
            category: [],
            image: "",
            description: "",
            stockStorage: 0,
        },

        editCategoryForm: {
            id: 0,
            categoryName: ''
        },

        addCategoryForm: {
            categoryName: ''
        },

        addProductToCategory: {
            categoryName: 0,
            productName: 0,
        },

        activeProducts: [],
        modalOpenProduct: false,
        modalOpenCategory: false,
    };

    getProductList = () => {
        Axios.get(`${API_URL}/products/getProduct`)
            .then((res) => {
                this.setState({ productList: res.data });
                // console.log(this.state.productList)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    getCategory = () => {
        Axios.get(`${API_URL}/category/getCategory`)
            .then((res) => {
                this.setState({ categoryList: res.data });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    renderCategoryName = () => {
        return this.state.categoryList.map((val) => {
            return (
                <option value={val.id}>{val.categoryName}</option>
            )
        })
    }

    renderProductName = () => {
        return this.state.productList.map((val) => {
            return (
                <option value={val.id}> {val.productName}</option>
            )
        })
    }

    renderCategoryList = () => {
        return this.state.categoryList.map((val, idx) => {
            const { id, categoryName } = val
            return (
                <>
                    <tr>
                        <td> {id} </td>
                        <td> {categoryName} </td>
                        <td>
                            <ButtonUI
                                onClick={(_) => this.editCategoryBtnHandler(idx)}
                                type="contained"
                            >
                                Edit
                                    </ButtonUI>
                        </td>
                        <td>
                            <ButtonUI
                                onClick={(_) => this.deleteCategoryHandler(val.id)}
                                type="contained"
                            >
                                Delete
                                    </ButtonUI>
                        </td>
                    </tr>
                </>
            )
        })
    }

    renderProductList = () => {
        return this.state.productList.map((val, idx) => {
            const { id, productName, price, category, image, description, stockStorage } = val;
            return (
                <>
                    <tr
                        onClick={() => {
                            if (this.state.activeProducts.includes(idx)) {
                                this.setState({
                                    activeProducts: [
                                        ...this.state.activeProducts.filter((item) => item !== idx),
                                    ],
                                });
                            } else {
                                this.setState({
                                    activeProducts: [...this.state.activeProducts, idx],
                                });
                            }
                        }}
                    >
                        <td> {idx + 1} </td>
                        <td> {productName} </td>
                        <td>
                            {" "}
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(price)}{" "}
                        </td>
                        <td> {stockStorage} </td>
                    </tr>
                    <tr
                        className={`collapse-item ${
                            this.state.activeProducts.includes(idx) ? "active" : null
                            }`}
                    >
                        <td className="" colSpan={3}>
                            <div className="d-flex justify-content-around align-items-center">
                                <div className="d-flex">
                                    <img src={image} alt="" />
                                    <div className="d-flex flex-column ml-4 justify-content-center">
                                        <h5>{productName}</h5>
                                        <h5>ID : {id}</h5>
                                        <h6 className="mt-2">
                                            Category:
                                        {
                                                category.map((val, idx) => {
                                                    return (
                                                        <div className="row mt-2">
                                                            <h6 className="ml-3 mr-4">
                                                                <span style={{ fontWeight: "normal", marginRight: "10px" }}> {val.categoryName}</span>
                                                                <FontAwesomeIcon
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={(_) => this.deleteCategoriesFromProduct(id, val.id)}
                                                                    icon={faTimes}
                                                                >
                                                                </FontAwesomeIcon>
                                                            </h6>

                                                        </div>
                                                    )
                                                })
                                            }
                                        </h6>

                                        <h6>
                                            Price:
                                            <span style={{ fontWeight: "normal" }}>
                                                {" "}
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(price)}
                                            </span>
                                        </h6>
                                        <h6>
                                            Description:
                                            <span style={{ fontWeight: "normal" }}> {description}</span>
                                        </h6>
                                    </div>
                                </div>

                                <div className="d-flex flex-column align-items-center">
                                    <ButtonUI
                                        onClick={(_) => this.editBtnHandler(idx)}
                                        type="contained"
                                    >
                                        Edit
                                    </ButtonUI>

                                    <ButtonUI className="mt-3" type="textual"
                                        onClick={() => this.deleteProductsHandler(id)}
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

    deleteCategoriesFromProduct = (productId, categoryId) => {
        Axios.delete(`${API_URL}/products//${productId}/deleteCategories/${categoryId}`)
            .then((res) => {
                this.getProductList();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    createCategoryHandler = () => {
        Axios.post(`${API_URL}/category/addCategory`, this.state.addCategoryForm)
            .then((res) => {
                console.log(res)
                swal("Success!", "Your New Category has Been Added", "success");
                this.setState({
                    addCategoryForm: {
                        categoryName: ''
                    }
                })
                this.getCategory();
            })
            .catch((err) => {
                console.log(err)
                swal("Error!", "Your Category Has been Removed", "error");
            })
    }

    createProductHandler = () => {
        console.log(this.state.createForm)
        Axios.post(`${API_URL}/products/addProduct`, this.state.createForm)
            .then((res) => {
                console.log(res)
                swal("Success!", "Your New Product has been Added", "success");
                this.setState({
                    createForm: {
                        productName: "",
                        price: 0,
                        stockStorage: 0,
                        image: "",
                        description: "",
                    },
                });
                this.getProductList();
            })
            .catch((err) => {
                console.log(err)
                swal("Error!", "Your New Product Could not be Created", "error");
            });
    };

    editBtnHandler = (idx) => {
        this.setState({
            editForm: {
                ...this.state.productList[idx],
            },
            modalOpenProduct: true,
        });
    };

    editCategoryBtnHandler = (idx) => {
        this.setState({
            editCategoryForm: {
                ...this.state.categoryList[idx],
            },
            modalOpenCategory: true,
        });
    };

    editProductHandler = () => {
        Axios.put(`${API_URL}/products/editProduct/${this.state.editForm.id}`, this.state.editForm)
            .then((res) => {
                swal("Success!", "Your Product has been Edited", "success");
                this.setState({ modalOpenProduct: false });
                this.getProductList();
            })
            .catch((err) => {
                swal("Error!", "Your Product could not be Edited", "error");
                console.log(err);
            });
    };

    editCategoryHandler = () => {
        console.log(this.state.editCategoryForm)
        Axios.put(`${API_URL}/category/editCategory/${this.state.editCategoryForm.id}`, this.state.editCategoryForm)
            .then((res) => {
                console.log(res)
                swal("Success!", "Your category has been edited", "success");
                this.setState({ modalOpenCategory: false });
                this.getProductList();
                this.getCategory()
            })
            .catch((err) => {
                swal("Error!", "Your category could not be edited", "error");
                console.log(err);
            });
    };

    deleteProductsHandler = (id) => {
        Axios.delete(`${API_URL}/products/deleteProduct/${id}`)
            .then((res) => {
                this.getProductList();
                swal("Success!", "Your Product has been Removed", "success")
            })
            .catch((err) => {
                console.log(err);
                swal("Erorr!", "Fail to Remove the Product", "error")
            });
    };

    deleteCategoryHandler = (id) => {
        console.log(id)
        Axios.delete(`${API_URL}/category/${id}`)
            .then((res) => {
                this.getProductList();
                this.getCategory()
                swal("Success!", "Your Category has been Removed", "success")
            })
            .catch((err) => {
                console.log(err);
                swal("Erorr!", "Fail to Remove the Category", "error")
            });
    };

    toggleModal = () => {
        this.setState({ modalOpenProduct: !this.state.modalOpenProduct });
    };

    toggleModalCategory = () => {
        this.setState({ modalOpenCategory: !this.state.modalOpenCategory })
    }

    componentDidMount() {
        this.getProductList();
        this.getCategory()
    }

    addProductToCategoryHandler = () => {
        console.log(this.state.addProductToCategory)
        const { productName, categoryName } = this.state.addProductToCategory
        Axios.put(`${API_URL}/products/${productName}/category/${categoryName}`)
            .then((res) => {
                console.log(res)
                this.getProductList();
                swal("Success!", "Your Category has been Added to the Product", "success")

            })
            .catch((err) => {
                console.log(err);
                swal("Erorr!", "Fail to Added Category to the Product", "error")
            });
    }

    render() {
        return (
            <div className="container py-4">
                <div className="dashboard">
                    <caption className="p-3">
                        <h2>Products</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Storage  </th>
                            </tr>
                        </thead>
                        <tbody>{this.renderProductList()}</tbody>
                    </table>
                </div>

                <div className="dashboard">
                    <caption className="p-3">
                        <h2>Category List</h2>
                    </caption>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Edit Category</th>
                                <th>Delete Category</th>
                            </tr>
                        </thead>
                        <tbody>{this.renderCategoryList()}</tbody>
                    </table>
                </div>
                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add Product</h2>
                    </caption>
                    <div className="row">
                        <div className="col-8">
                            <TextField
                                value={this.state.createForm.productName}
                                placeholder="Product Name"
                                onChange={(e) => this.inputHandler(e, "productName", "createForm")}
                            />
                        </div>
                        <div className="col-4">
                            <TextField
                                value={this.state.createForm.price}
                                placeholder="Price"
                                onChange={(e) => this.inputHandler(e, "price", "createForm")}
                            />
                        </div>
                        <div className="col-12 mt-3">
                            <textarea
                                value={this.state.createForm.description}
                                onChange={(e) => this.inputHandler(e, "description", "createForm")}
                                style={{ resize: "none" }}
                                placeholder="Description"
                                className="custom-text-input"
                            ></textarea>
                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createForm.image}
                                placeholder="Image Source"
                                onChange={(e) => this.inputHandler(e, "image", "createForm")}
                            />
                        </div>
                        <div className="col-6 mt-3">
                            <TextField
                                value={this.state.createForm.stockStorage}
                                placeholder="Quantity"
                                onChange={(e) => this.inputHandler(e, "stockStorage", "createForm")}
                            />
                        </div>

                        <div className="col-3 mt-3">
                            <ButtonUI onClick={this.createProductHandler} type="contained">
                                Create Product
                            </ButtonUI>
                        </div>

                    </div>
                </div>

                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add Category </h2>
                    </caption>
                    <div className="row">
                        <div className="col-8">
                            <TextField
                                value={this.state.addCategoryForm.categoryName}
                                placeholder="Category"
                                onChange={(e) => this.inputHandler(e, "categoryName", "addCategoryForm")}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <ButtonUI onClick={this.createCategoryHandler} type="contained">
                            Add Catrgory
                            </ButtonUI>
                    </div>
                </div>

                <div className="dashboard-form-container p-4">
                    <caption className="mb-4 mt-2">
                        <h2>Add Product to Category </h2>
                    </caption>
                    <div className="row" >
                        <div className="col-6">
                            <select
                                className="form-control"
                                value={this.state.addProductToCategory.categoryName}
                                onChange={(e) => this.inputHandler(e, "categoryName", "addProductToCategory")} >
                                <option value="">Select Category</option>
                                {this.renderCategoryName()}
                            </select>
                        </div>
                        <div className="col-6">
                            <select
                                className="form-control"
                                value={this.state.addProductToCategory.productName}
                                onChange={(e) => this.inputHandler(e, "productName", "addProductToCategory")} >
                                <option value=""> Select Book title</option>
                                {this.renderProductName()}
                            </select>


                        </div>
                    </div>

                    <div className="mt-3 ">
                        <ButtonUI onClick={this.addProductToCategoryHandler} type="contained">
                            Add Product to Category
                            </ButtonUI>
                    </div>
                </div>

                <Modal
                    toggle={this.toggleModal}
                    isOpen={this.state.modalOpenProduct}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModal}>
                        <caption>
                            <h3>Edit Product</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editForm.productName}
                                    placeholder="Product Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "productName", "editForm")
                                    }
                                />
                            </div>
                            <div className="col-4">
                                <TextField
                                    value={this.state.editForm.price}
                                    placeholder="Price"
                                    onChange={(e) => this.inputHandler(e, "price", "editForm")}
                                />
                            </div>
                            <div className="col-12 mt-3">
                                <textarea
                                    value={this.state.editForm.description}
                                    onChange={(e) => this.inputHandler(e, "description", "editForm")}
                                    style={{ resize: "none" }}
                                    placeholder="description"
                                    className="custom-text-input"
                                ></textarea>
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editForm.image}
                                    placeholder="Image Source"
                                    onChange={(e) => this.inputHandler(e, "image", "editForm")}
                                />
                            </div>
                            <div className="col-6 mt-3">
                                <TextField
                                    value={this.state.editForm.stockStorage}
                                    placeholder="Quantity"
                                    onChange={(e) => this.inputHandler(e, "stockStorage", "editForm")}
                                />
                            </div>
                            <div className="col-12 text-center my-3">
                                <img src={this.state.editForm.image} alt="" />
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
                                    onClick={this.editProductHandler}
                                    type="contained"
                                >
                                    Save
                                </ButtonUI>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>

                <Modal
                    toggle={this.toggleModalCategory}
                    isOpen={this.state.modalOpenCategory}
                    className="edit-modal"
                >
                    <ModalHeader toggle={this.toggleModalCategory}>
                        <caption>
                            <h3>Edit Category</h3>
                        </caption>
                    </ModalHeader>
                    <ModalBody>
                        <div className="row">
                            <div className="col-8">
                                <TextField
                                    value={this.state.editCategoryForm.categoryName}
                                    placeholder="Category Name"
                                    onChange={(e) =>
                                        this.inputHandler(e, "categoryName", "editCategoryForm")
                                    }
                                />
                            </div>
                            <div className="col-5 mt-3 offset-1">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.toggleModalCategory}
                                    type="outlined"
                                >
                                    Cancel
                                </ButtonUI>
                            </div>
                            <div className="col-5 mt-3">
                                <ButtonUI
                                    className="w-100"
                                    onClick={this.editCategoryHandler}
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
export default AdminDashboard;