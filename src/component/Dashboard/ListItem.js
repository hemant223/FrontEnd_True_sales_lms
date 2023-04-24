import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ListItem(props) {
  const dispatch = useDispatch();
  var userData = "";
  const [getName, setName] = useState("");

  useEffect(() => {
    userData = JSON.parse(localStorage.getItem("user"));
    chkToken();
  }, []);

  const chkToken = async () => {
    let userData = JSON.parse(localStorage.getItem("user"));
    setName(userData.name);
    const token = localStorage.getItem("token");
    if (!token) {
      props.history.replace({ pathname: "/AdminLogin" });
    }
  };

  const handleClick = (option) => {
    props.handleDashComponent(option);
  };

  const addTitle = (txt) => {
    try {
      dispatch({ type: "HEADERTITLE", payload: txt });
    } catch (err) {
      console.log("Catch ERROR IN LI", err);
    }
  };

  return (
    <>
      <div className="left-side-menu">
        <div className="h-100" data-simplebar="">
          <div className="user-box text-center">
            <img
              src="images/users/user-1.jpg"
              alt="user-1"
              title="Mat Helme"
              className="rounded-circle img-thumbnail avatar-lg"
            />
            <div className="dropdown">
              <a
                href="#"
                className="user-name dropdown-toggle h5 mt-2 mb-1 d-block"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {getName}
              </a>
              <div className="text-muted">
                <span>Admin</span>
              </div>
            </div>
          </div>
          {/*- Sidemenu */}
          <div id="sidebar-menu">
            <ul id="side-menu">
              <li>
                <a
                  onClick={() => {
                    addTitle("Dashboard");
                    handleClick(1);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-view-dashboard-outline" />
                  <span> Dashboard </span>
                </a>
              </li>

              {/* <li>
                <a
                  onClick={() => {
                    addTitle("Company Configuration");
                    handleClick(2);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-office-building-outline" />
                  <span> Company Configuration </span>
                </a>
              </li> */}

              <li>
                <a href="#email" data-bs-toggle="collapse">
                  <i className="fe-user" />
                  <span> User Management </span>
                  <span className="menu-arrow" />
                </a>
                <div className="collapse" id="email">
                  <ul
                    className="nav-second-level"
                    style={{ cursor: "pointer" }}
                  >
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Users");
                          handleClick(90.5);
                        }}
                      >
                        Users
                      </a>
                    </li>


                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Roles");
                          handleClick(4);
                        }}
                      >
                        Roles
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Company");
                          handleClick(4.2);
                        }}
                      >
                        Company
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Break");
                          handleClick(4.3);
                        }}
                      >
                        Break
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Sf Intregration");
                          handleClick(4.4);
                        }}
                      >
                        Sf Intregration
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Priority");
                          handleClick(70.1);
                        }}
                      >
                       Priority
                      </a>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <a
                  href={false}
                  onClick={() => {
                    addTitle("Customers");
                    handleClick(5);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-star" />
                  <span> Customers </span>
                </a>
              </li>
              
              <li>
                <a
                  href={false}
                  onClick={() => {
                    addTitle("Tasks ");
                    handleClick(6);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-format-list-bulleted" />
                  <span> Tasks </span>
                </a>
              </li>
              <li>
                <a href="#contacts" data-bs-toggle="collapse">
                  <i className="mdi mdi-receipt" />
                  <span> Master Management </span>
                  <span className="menu-arrow" />
                </a>
                <div className="collapse" id="contacts">
                  <ul
                    className="nav-second-level"
                    style={{ cursor: "pointer" }}
                  >
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Team");
                          handleClick(7);
                        }}
                      >
                        Team
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Tasks Type");
                          handleClick(8);
                        }}
                      >
                        Tasks Type
                      </a>
                    </li>

                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Task Priority");
                          handleClick(9);
                        }}
                      >
                        Task Priority
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Claims");
                          handleClick(80.1);
                        }}
                      >
                        Claims
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Task Status");
                          handleClick(80.2);
                        }}
                      >
                        Task Status
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Roles Claims");
                          handleClick(90.1);
                        }}
                      >
                       Roles Claims
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Whatsapp");
                          handleClick(90.2);
                        }}
                      >
                     Whatsapp
                      </a>
                    </li>

                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Disposition");
                          handleClick(10);
                        }}
                      >
                        Disposition
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle(" Customer Priority");
                          handleClick(12);
                        }}
                      >
                        Customer Priority
                      </a>
                    </li>

                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Templates");
                          handleClick(19);
                        }}
                      >
                        Templates
                      </a>
                    </li>

                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Abandoned Mobiles");
                          handleClick(20);
                        }}
                      >
                        Abandoned Mobiles
                      </a>
                    </li>

                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Break Types");
                          handleClick(21);
                        }}
                      >
                        Break Types
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a
                  href={false}
                  onClick={() => {
                    addTitle("Briefing");
                    handleClick(13);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-track-light" />
                  <span> Briefing </span>
                </a>
              </li>
              <li>
                <a href="#sidebarAuth" data-bs-toggle="collapse">
                  <i className="mdi mdi-clipboard-list-outline" />
                  <span> Reports </span>
                  <span className="menu-arrow" />
                </a>
                <div className="collapse" id="sidebarAuth">
                  <ul
                    className="nav-second-level"
                    style={{ cursor: "pointer" }}
                  >
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Attendance report");
                          handleClick(14);
                        }}
                      >
                        Attendance report
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Call report");
                          handleClick(15);
                        }}
                      >
                        Call report
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Tasks report");
                          handleClick(16);
                        }}
                      >
                        Tasks report
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Team report");
                          handleClick(17);
                        }}
                      >
                        Team report
                      </a>
                    </li>
                    <li>
                      <a
                        href={false}
                        onClick={() => {
                          addTitle("Briefing report");
                          handleClick(18);
                        }}
                      >
                        Briefing report
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className="clearfix" />
        </div>
      </div>
    </>
  );
}
