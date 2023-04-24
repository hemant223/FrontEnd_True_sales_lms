import React, { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { getDataAxios } from "../../services/FetchNodeServices";
import TopbarFilter from "./TopbarFilter";
import { ServerURL } from "../../services/FetchNodeServices";
import { useSelector } from "react-redux";

export default function TopbarManager(props) {
  const hTitle = useSelector((state) => state.hName.tn);
  console.log("Props in Topbaar", props);
  // const history = useHistory();
  var userData = "";
  var pageData = "";
  const [getName, setName] = useState("");
  const [getPicture, setPicture] = useState("");
  const [getPageData, setPageData] = useState("");

  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    chkToken();
    pageFunc();
  }, [props]);

  const pageFunc = async () => {
    userData = JSON.parse(localStorage.getItem("user"));
    setPicture(userData.user_picture);
    setName(userData.name);
    setPageData(localStorage.getItem("page"));
  };
  const chkToken = async () => {
    // alert(pageData);
    const token = localStorage.getItem("token");
    if (!token) {
      props.history.replace({ pathname: "/AdminLogin" });
      // setLoading(false);
    }
  };

  const handleMovePage = () => {
    props.handleDashComponent(37);
  };

  const handleLogout = (opt) => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      {/* Topbar Start */}
      <div className="navbar-custom">
        <ul className="list-unstyled topnav-menu float-end mb-0">
          {/* Filter in Topbar */}
          {getPageData <= 1 ? <TopbarFilter /> : null}
          <li className="d-none d-lg-block">
            <form className="app-search">
              <div className="app-search-box">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    id="top-search"
                  // onClick={() => handleMovePage()}
                  />
                  <button className="btn input-group-text">
                    <i className="fe-search" />
                  </button>
                </div>
                <div className="dropdown-menu dropdown-lg" id="search-dropdown">
                  {/* item*/}
                  <div className="dropdown-header noti-title">
                    <h5 className="text-overflow mb-2">Found 22 results</h5>
                  </div>
                  {/* item*/}
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <i className="fe-home me-1" />
                    <span>Analytics Report</span>
                  </a>
                  {/* item*/}
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <i className="fe-aperture me-1" />
                    <span>How can I help you?</span>
                  </a>
                  {/* item*/}
                  <a
                    href="javascript:void(0);"
                    className="dropdown-item notify-item"
                  >
                    <i className="fe-settings me-1" />
                    <span>User profile settings</span>
                  </a>
                  {/* item*/}
                  <div className="dropdown-header noti-title">
                    <h6 className="text-overflow mb-2 text-uppercase">Users</h6>
                  </div>
                  <div className="notification-list">
                    {/* item*/}
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item notify-item"
                    >
                      <div className="d-flex align-items-start">
                        <img
                          className="d-flex me-2 rounded-circle"
                          src="assets/images/users/user-2.jpg"
                          alt="Generic placeholder image"
                          height={32}
                        />
                        <div className="w-100">
                          <h5 className="m-0 font-14">Erwin E. Brown</h5>
                          <span className="font-12 mb-0">UI Designer</span>
                        </div>
                      </div>
                    </a>
                    {/* item*/}
                    <a
                      href="javascript:void(0);"
                      className="dropdown-item notify-item"
                    >
                      <div className="d-flex align-items-start">
                        <img
                          className="d-flex me-2 rounded-circle"
                          src="assets/images/users/user-5.jpg"
                          alt="Generic placeholder image"
                          height={32}
                        />
                        <div className="w-100">
                          <h5 className="m-0 font-14">Jacob Deo</h5>
                          <span className="font-12 mb-0">Developer</span>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </li>
          <li className="dropdown d-inline-block d-lg-none">
            <a
              className="nav-link dropdown-toggle arrow-none waves-effect waves-light"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <i className="fe-search noti-icon" />
            </a>
            <div className="dropdown-menu dropdown-lg dropdown-menu-end p-0">
              <form className="p-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search ..."
                  aria-label="Recipient's username"
                />
              </form>
            </div>
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
                {/* Nowak  */}
                {getName}
                <i className="mdi mdi-chevron-down" />
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
              {/* item*/}
              <div className="dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome !</h6>
              </div>
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
            {/* <span className="logo-sm">
              <img src="assets/images/logo-sm.png" alt="" height={22} />
            </span> */}
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
      {/* end Topbar */}
    </>
  );
}
