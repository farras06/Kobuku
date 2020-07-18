import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";
import { userKeepLogin, cookieChecker } from "../src/redux/actions/index"

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import AuthScreen from "./views/screens/Auth/AuthScreen";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import Cart from "./views/screens/Cart/Cart";
import AdminDashboard from "../src/views/screens/AdminDashboard/AdminDashboard";
import WishList from "../src/views/screens/WishList/WishList"
import AdminMember from "./views/screens/AdminMember/AdminMember";
import AdminPayment from "./views/screens/AdminPayment/AdminPayment";
import History from "./views/screens/History/History";
import NotFound from "./views/screens/Notfound/NotFound";
import Report from "./views/screens/Report/Report";
import EditProfile from "./views/screens/EditProfile/EditProfile";
import ForgetPassword from "./views/screens/ForgetPassword/ForgetPassword";
import Footer from "./views/components/Footer/Footer"

const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      let cookieResult = cookieObj.get("authData", { path: "/" })
      if (cookieResult) {
        this.props.keepLogin(cookieResult);
      } else {
        this.props.cookieChecker();
      }
    }, 2000);
  }

  renderAdminRoutes = () => {
    if (this.props.user.role === "admin") {
      console.log(this.props.user)
      return (
        <>
          <Route exact path="/admin/dashboard" component={AdminDashboard} />
          <Route exact path="/admin/member" component={AdminMember} />
          <Route exact path="/admin/payment" component={AdminPayment} />
          <Route exact path="/admin/report" component={Report} />
        </>
      )
    } else {
      return <Redirect to="/notfound" />
    }
  };

  render() {
    console.log(this.props.user.cookieChecked)
    console.log(this.props.user.username)
    if (this.props.user.cookieChecked) {
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreen} />
            <Route exact path="/product/:productId" component={ProductDetails} />
            <Route exact path="/wishlist" component={WishList} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/history" component={History} />
            <Route exact path="/notfound" component={NotFound} />
            <Route exact path="/editprofile" component={EditProfile} />
            <Route exact path="/users/forgetPassword/:username/:verify" component={ForgetPassword} />

            {this.renderAdminRoutes()}
          </Switch>
          <div style={{ height: "10px" }}></div>
          <Footer />
        </>
      );
    } else {
      return <div>Loading ...</div>;
    }


  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));


