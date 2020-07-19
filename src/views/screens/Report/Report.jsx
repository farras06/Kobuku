import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { Bar } from "react-chartjs-2"
import { Table } from "reactstrap"
import TextField from "../../components/TextField/TextField"


class Report extends React.Component {

    state = {
        reportData: {
            labels: [],
            datasets: [
                {
                    data: []
                }
            ]
        },
        search: {
            categoryName: 'All',
            minPrice: 0,
            maxPrice: 10000000000000,
            productName: '',
            orderBy: 'sold',
            sortBy: 'asc'
        },
        categoryList: [],
    }

    componentDidMount() {
        this.getReportData(this.state.search.categoryName)
        this.getCategory()
    }

    inputHandler = (e, field, form) => {
        let { value } = e.target;
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        });
    };

    getReportData = (val) => {
        console.log(this.state.search)
        this.setState({
            reportData: {
                labels: [],
                datasets: [
                    {
                        label: 'Sold',
                        backgroundColor: `rgba(75,192,192,1)`,
                        borderColor: 'rgba(255, 99, 132,1)',
                        borderWidth: 5,
                        data: []
                    }
                ]
            }
        })
        if (val == "All") {
            Axios.get(`${API_URL}/products/${this.state.search.minPrice}/${this.state.search.maxPrice}/${this.state.search.orderBy}/${this.state.search.sortBy}/?productName=${this.state.search.productName}`)
                .then((res) => {
                    res.data.content.map((value, idx) => {
                        this.setState({
                            reportData: {
                                labels: [...this.state.reportData.labels, value.productName],
                                datasets: [
                                    {
                                        label: 'Sold',
                                        backgroundColor: `rgba(75,192,192,1)`,
                                        borderColor: 'rgba(255, 99, 132,1)',
                                        borderWidth: 5,
                                        data: [...this.state.reportData.datasets[0].data, value.sold]
                                    }
                                ]
                            }
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                })

        } else {

            Axios.get(`${API_URL}/products/${this.state.search.minPrice}/category/${this.state.search.maxPrice}/${this.state.search.orderBy}/${this.state.search.sortBy}/?productName=${this.state.search.productName}&categoryName=${val}`)
                .then((res) => {
                    res.data.content.map((value, idx) => {
                        this.setState({
                            reportData: {
                                labels: [...this.state.reportData.labels, value.productName],
                                datasets: [
                                    {
                                        label: 'Sold',
                                        backgroundColor: `rgba(75,192,192,1)`,
                                        borderColor: 'rgba(255, 99, 132,1)',
                                        borderWidth: 5,
                                        data: [...this.state.reportData.datasets[0].data, value.sold]
                                    }
                                ]
                            }
                        })
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

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
                <option value={val.categoryName}>{val.categoryName}</option>
            )
        })
    }

    renderChart = () => {
        return (
            <Bar
                data={this.state.reportData}
                options={{
                    title: {
                        display: true,
                        text: 'Sold',
                        fontSize: 20,
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    },

                }}
            />
        )
    }






    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-4 justify-content-center m-2"
                        style={{ borderRight: "1px solid black" }}
                    >
                        <h3
                            style={{ textAlign: "center" }}
                        >
                            Filter The Report</h3>

                        <div className="mt-4">
                            <TextField
                                value={this.state.search.productName}
                                onChange={(e) => this.inputHandler(e, "productName", "search")}
                                onKeyUp={() => { this.getReportData(this.state.search.categoryName) }}
                                type="text"
                                placeholder="Seacrh by Book title"
                            >
                            </TextField>
                        </div>

                        <div className="mt-4">
                            <select className="justify-item-center form-control"
                                value={this.state.search.categoryName}
                                onClick={(e) => { this.getReportData(this.state.search.categoryName) }}
                                onChange={(e) => this.inputHandler(e, "categoryName", "search")} >
                                <option value="" disabled> Select Book Category</option>
                                <option value="All"> All Categories</option>
                                {this.renderCategoryName()}
                            </select>
                        </div>

                        <div className="mt-4">
                            <select
                                className="justify-item-center form-control"
                                value={this.state.search.sortBy}
                                onClick={(e) => { this.getReportData(this.state.search.categoryName) }}
                                onChange={(e) => this.inputHandler(e, "sortBy", "search")} >
                                <option value="asc"> A-Z </option>
                                <option value="desc"> Z-A </option>
                            </select>
                        </div>
                    </div>

                    <div className="col-7">
                        {this.renderChart()}

                    </div>
                </div>


            </div>
        )
    }
}

export default Report