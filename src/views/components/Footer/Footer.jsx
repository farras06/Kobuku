import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import ReactDOM from 'react-dom';
import { SocialMediaIconsReact } from 'social-media-icons-react';

class Footer extends React.Component {
    render() {
        return (
            <MDBFooter color="unique-color-dark" className="page-footer font-small pt-0"
                style={{ backgroundColor: "#fcd4c4" }}>

                <div style={{ backgroundColor: "#ffab91" }}>
                    <MDBContainer fluid className="text-center text-md-left">
                        <MDBRow className="py-4 d-flex align-items-center">
                            <MDBCol md="6" lg="5" className="text-center text-md-left mb-4 mb-md-0">
                                <h6 className="mb-0 white-text">
                                    Kobuku...  Reader Always Reading !!
                                </h6>
                            </MDBCol>
                            <MDBCol md="6" lg="7" className="text-center text-md-right">
                                <a className="fb-ic ml-0">
                                    <i className="fab fa-facebook-f white-text mr-lg-4"> </i>
                                </a>
                                <a className="tw-ic">
                                    <i className="fab fa-twitter white-text mr-lg-4"> </i>
                                </a>
                                <a className="gplus-ic">
                                    <i className="fab fa-google-plus-g white-text mr-lg-4"> </i>
                                </a>
                                <a className="li-ic">
                                    <i className="fab fa-linkedin-in white-text mr-lg-4"> </i>
                                </a>
                                <a className="ins-ic">
                                    <i className="fab fa-instagram white-text mr-lg-4"> </i>
                                </a>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>
                <MDBContainer className="mt-5 mb-4 text-center text-md-left">
                    <MDBRow className="mt-3">
                        <MDBCol md="3" lg="4" xl="3" className="mb-4">
                            <h6 className="text-uppercase font-weight-bold">
                                <strong>Kobuku</strong>
                            </h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px" }} />
                            <p>
                                Kobuku is The world's most international online bookstore offering many kind of books. our shop also come with alot of advantages, remember our motto "Reader always Reading"
                    </p>
                        </MDBCol>
                        <MDBCol md="2" lg="2" xl="2" className="mb-4">
                            <h6 className="text-uppercase font-weight-bold">
                                <strong>Our Advantages</strong>
                            </h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px" }} />
                            <p>
                                <a>Fast Shipping</a>
                            </p>
                            <p>
                                <a>100% Refund</a>
                            </p>
                            <p>
                                <a>24/7 Support</a>
                            </p>
                        </MDBCol>
                        <MDBCol md="3" lg="2" xl="2" className="mb-4">
                            <h6 className="text-uppercase font-weight-bold">
                                <strong>Useful links</strong>
                            </h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px" }} />
                            <p>
                                <a href="#!">Your Account</a>
                            </p>
                            <p>
                                <a href="#!">Become an Affiliate</a>
                            </p>
                            <p>
                                <a href="#!">Frequently Asked Question</a>
                            </p>
                            <p>
                                <a href="#!">Help</a>
                            </p>
                        </MDBCol>
                        <MDBCol md="4" lg="3" xl="3" className="mb-4">
                            <h6 className="text-uppercase font-weight-bold">
                                <strong>Contact</strong>
                            </h6>
                            <hr className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto" style={{ width: "60px" }} />
                            <p>
                                <i className="fa fa-home mr-3" /> Jakarta ,Indonesia
                            </p>
                            <p>
                                <i className="fa fa-envelope mr-3" /> adminganteng@kobuku.com
                            </p>
                            <p>
                                <i className="fa fa-phone mr-3" /> + 01 234 567 88
                            </p>
                            <p>
                                <i className="fa fa-print mr-3" /> + 01 234 567 89
                            </p>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright: <a href="https://kobukubuku.com"> kobukubuku.com </a>
                    </MDBContainer>
                </div>
            </MDBFooter>
        );
    }
}

export default Footer;