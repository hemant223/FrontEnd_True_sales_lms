import React, { useState, useEffect } from "react";
import { ServerURL } from "../../services/FetchNodeServices";
import { useSelector } from "react-redux";

export default function Topbar(props) {
  // console.log("Props in Topbaar", props);
  const hTitle = useSelector((state) => state.hName.tn);
  const [getName, setName] = useState("");
  const [getPicture, setPicture] = useState("");
  var userData = "";

  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    chkToken();
  }, [props]);

  const chkToken = async () => {
    userData = JSON.parse(localStorage.getItem("user"));
    setPicture(userData.user_picture);
    setName(userData.name);
    const token = localStorage.getItem("token");
    if (!token) {
      props.history.replace({ pathname: "/AdminLogin" });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {/* Topbar Start */}
      <div className="navbar-custom">
        <ul className="list-unstyled topnav-menu float-end mb-0">
          <li className="d-none d-lg-block">
            <form className="app-search">
              <div className="app-search-box">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    id="top-search"
                  />
                  <button className="btn input-group-text">
                    <i className="fe-search" />
                  </button>
                </div>
              </div>
            </form>
          </li>
          <li className="dropdown notification-list topbar-dropdown">
            <a
              className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              {getPicture == null ? (
                <img
                  src="assets/images/users/user-1.jpg"
                  alt="image"
                  class="img-fluid avatar-sm rounded-circle"
                />
              ) : (
                <img
                  src={`${ServerURL}/images/${getPicture}`}
                  alt="image"
                  class="img-fluid avatar-sm rounded-circle"
                />
              )}
              <span className="pro-user-name ms-1">
                {getName}
                <i className="mdi mdi-chevron-down" />
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
              <div className="dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome !</h6>
              </div>
              {/* item*/}
              <div className="dropdown-divider" />
              {/* item*/}
              <a
                href={false}
                className="dropdown-item notify-item"
                style={{ cursor: "pointer" }}
              >
                <i className="fe-log-out" />
                <span onClick={() => handleLogout(19)}>Logout</span>
              </a>
            </div>
          </li>
        </ul>
        {/* LOGO */}
        <div className="logo-box">
          <a href="index.html" className="logo logo-dark text-center">
            <span className="logo-lg">
              <img src="images/Off_Logo.png" alt="" height={26} />
            </span>
          </a>
        </div>
        <ul className="list-unstyled topnav-menu topnav-menu-left mb-0">
          <li>
            <button className="button-menu-mobile disable-btn waves-effect">
              <i className="fe-menu" />
            </button>
          </li>
          <li>
            <h4 className="page-title-main">{hTitle}</h4>
          </li>
        </ul>
        <div className="clearfix" />
      </div>
    </>
  );
}
