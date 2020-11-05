import React from 'react'
import './NewNavbar.scss'
import logo from '../assets/images/logo1.png'
import logotext from '../assets/images/logotext.png'
import { useDispatch, useSelector } from "react-redux";
import Avatar_01 from '../assets/img/new-img/user.jpg'
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css'
import { numberWithCommas, substringText, formatCurrency } from "../utils"

function NewNavbar({isAuthenticated, authUser, categoriesArray, logOutUser, totalPrice, exchange, currency: totalCurrency,handleBookClick}) {
    const dispatch = useDispatch();
    const currency = useSelector((state) => state.paymentType.currency);
    const changeCurrency = (curr) => {
        dispatch({
        type: "CHANGE_CURRENCY",
        payload: curr,
        });
    };

    let authenticated = false;
    authenticated = !(
        isAuthenticated === false ||
        isAuthenticated === undefined ||
        isAuthenticated === null
    );

    let user = authUser || "";
    let categories = categoriesArray || [];

    return (
        <div className="header"> 
            <nav class=" navbar navbar-expand-lg header">
                <div className="col-md-2 p-0">
                <div className="logo">
          <div
            className="logoimg"
            style={{ marginRight: "10px", marginLeft: "0px" }}
            onClick="window.location.reload()"
          >
            <Link to="/">
              <img src={logo} alt="" width={40} height={40} />
            </Link>
          </div>
          <div className="logotext" onClick="window.location.reload()">
            <Link to="/">
              <img src={logotext} alt="" width={130} height={30} />
            </Link>
          </div>
        </div>
                </div>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent-555"
                    aria-controls="navbarSupportedContent-555" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse " id="navbarSupportedContent-555">
                    <a id="toggle_btn">
                        <i class="fe fe-text-align-left"></i>
                    </a>
                    {/* <div class="top-nav-search">
            <form action="">
              <input
                type="text"
                class="form-control"
                placeholder="Search here"
              />
              <button
                class="btn"
                type="submit"
                style={{ pointerEvents: "none" }}
              >
                <i class="fe fe-search"></i>
              </button>
            </form>
          </div> */}

                    <ul class="navbar-nav  ml-auto">
                  
{/*                    
                    <li class="nav-ite pd-top">
                     <div style={{paddingTop: "10px"}}
                     onClick={handleBookClick}
                    //  style={{color: totalPrice === 0? 'red' : 'green'}}
                     >
                          {''}                                                    
                          {formatCurrency(
                                                    totalPrice || 0,
                                                    exchange,
                                                    totalCurrency
                                                    )}</div>
                        </li> */}
                        <li class="nav-it avatar dropdown ">
                            <a class="nav-link dropdown-toggle currency" id="navbarDropdownMenuLink-55" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                               
                                <div >
                                {`${currency}`}
                                </div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-lg-right dropdown-secondary ast"
                            aria-labelledby="navbarDropdownMenuLink-55">
                            <a class="dropdown-item" onClick={() => changeCurrency("USD")}>USD ($)</a>
                            <a class="dropdown-item" onClick={() => changeCurrency("GBP")}>Pounds (£)</a>
                            <a class="dropdown-item" onClick={() => changeCurrency("EUR")}>Euro (€)</a>
                            <a class="dropdown-item" onClick={() => changeCurrency("MYR")}>Ringgit (RM)</a>
                            <a class="dropdown-item" onClick={() => changeCurrency("NGN")}>Naira (₦)</a>
                            </div>
                        </li>

                        <li class="nav-item pd-top">
                            <a class="nav-link waves-effect waves-light">
                                <i class="fas fa-th"></i>
                            </a>
                        </li>
                        
                        <li class="nav-item notifi pd-top">
                            <a class="nav-link waves-effect waves-light">
                                <i class="fe fe-bell"></i>
                                {/* <span>3</span> */}
                            </a>
                        </li>
                        <li class="nav-item avatar dropdown">
                            <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-55" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                                <img className="rounded-circle " src={Avatar_01} width={30} alt="Ryan Taylor" />
                                <i className="fa fa-angle-down mx-2"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
                            aria-labelledby="navbarDropdownMenuLink-55 text-center justify-content-center">
                                <a class="dropdown-item" href
                                ="#">
                                    <img className="rounded-circle" src={Avatar_01} width={50} alt="Ryan Taylor" />
                                    <h4>{user.displayName || "ACCOUNT"}</h4>
                                </a>
                                {/* <Link to="/profile">
                                    MY ACCOUNT
                                </Link> */}
                                <a class="dropdown-item" onClick={logOutUser}>Log out</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav> 
        </div>
    )
}



const mapStateToProps = ({ mediaplanning, paymentType }) => {
    const { currency, exchange } = paymentType;
    const {
        totalPrice,
      } = mediaplanning;

    return {
        totalPrice,
        exchange,
        currency,
        
    };
};

export default connect(
    mapStateToProps,
    {
       
})(NewNavbar);
