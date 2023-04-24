import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Sidebar(props) {
  const history = useHistory();

  return (
    <>
      <div className="left-side-menu">
        <div className="h-100" data-simplebar="">
          {/* User box */}
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
                Nowak Helme
              </a>
              <div className="dropdown-menu user-pro-dropdown">
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-user me-1" />
                  <span>My Account</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-settings me-1" />
                  <span>Settings</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-lock me-1" />
                  <span>Lock Screen</span>
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-log-out me-1" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
            <p className="text-muted left-user-info">Admin Head</p>
            <ul className="list-inline">
              <li className="list-inline-item">
                <a href={false} className="text-muted left-user-info">
                  <i className="mdi mdi-cog" />
                </a>
              </li>
              <li className="list-inline-item">
                <a href={false}>
                  <i className="mdi mdi-power" />
                </a>
              </li>
            </ul>
          </div>
          {/*- Sidemenu */}
          <div id="sidebar-menu">
            <ul id="side-menu">
              {/* <li className="menu-title">Navigation</li> */}
              <li>
                <a href="index.html">
                  <i className="mdi mdi-view-dashboard-outline" />
                  <span className="badge bg-success rounded-pill float-end">
                    9+
                  </span>
                  <span> Dashboard </span>
                </a>
              </li>
              {/* <li className="menu-title mt-2">Apps</li> */}
              <li>
                <a
                  onClick={() =>
                    history.push({
                      pathname: "/topbar",
                    })
                  }
                >
                  <i className="mdi mdi-office-building-outline" />
                  <span> Company Configuration </span>
                </a>
              </li>
              {/* <li>
                <a href="apps-chat.html">
                  <i className="mdi mdi-forum-outline" />
                  <span> Chat </span>
                </a>
              </li> */}
              <li>
                <a href="#email" data-bs-toggle="collapse">
                  <i className="fe-user" />
                  <span> User Management </span>
                  <span className="menu-arrow" />
                </a>
                <div className="collapse" id="email">
                  <ul className="nav-second-level">
                    <li>
                      <a href={false}>Users</a>
                    </li>
                    <li>
                      <a href={false}>Roles</a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a href={false}>
                  <i className="mdi mdi-star" />
                  <span> Customers </span>
                  {/* <span className="menu-arrow" /> */}
                </a>
                {/* <a href="#sidebarTasks" data-bs-toggle="collapse">
                  <i className="mdi mdi-star" />
                  <span> Customers </span>
                  <span className="menu-arrow" />
                </a> */}
                {/* <div className="collapse" id="sidebarTasks">
                  <ul className="nav-second-level">
                    <li>
                      <a href={false}>Kanban Board</a>
                    </li>
                    <li>
                      <a href={false}>Details</a>
                    </li>
                  </ul>
                </div> */}
              </li>
              <li>
                <a href={false}>
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
                  <ul className="nav-second-level">
                    <li>
                      <a href={false}>Team</a>
                    </li>
                    <li>
                      <a href={false}>Tasks Type</a>
                    </li>
                    <li>
                      <a href={false}>Task Priority</a>
                    </li>
                    <li>
                      <a href={false}>Disposition</a>
                    </li>
                    <li>
                      <a href={false}>Customer fields</a>
                    </li>
                    <li>
                      <a href={false}>Customer Priority</a>
                    </li>
                  </ul>
                </div>
              </li>
              {/* <li className="menu-title mt-2">Custom</li> */}
              <li>
                <a href={false}>
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
                  <ul className="nav-second-level">
                    <li>
                      <a href={false}>Attendance report</a>
                    </li>
                    <li>
                      <a href={false}>Call report</a>
                    </li>
                    <li>
                      <a href={false}>Tasks report</a>
                    </li>
                    <li>
                      <a href={false}>Team report</a>
                    </li>
                    <li>
                      <a href={false}>Briefing report</a>
                    </li>
                    {/* <li>
                      <a href="auth-logout.html">Logout</a>
                    </li> */}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          {/* End Sidebar */}
          <div className="clearfix" />
        </div>
        {/* Sidebar -left */}
      </div>
    </>
  );
}
