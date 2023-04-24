import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { getDataAxios } from "../../services/FetchNodeServices";
import TeamShows from "../ManagerPenalPages/TeamsShow/TeamShows";
import { ServerURL } from "../../services/FetchNodeServices";
import { useDispatch } from "react-redux";

export default function ManagerListItem(props) {
  console.log("props in manager ListItem", props);
  let tempScopes = JSON.parse(localStorage.getItem("scopes"));
  let Rolename = JSON.parse(localStorage.getItem("rolename"));
  const [getName, setName] = useState("");
  const [getPicture, setPicture] = useState("");
  const [getTeamsData, setTeamsData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    chkToken();
    fetchTeamsName();
  }, []);

  const fetchTeamsName = async () => {
    let userData = JSON.parse(localStorage.getItem("user"));
    setName(userData.name);
    setPicture(userData.user_picture);
    let responseResult = await getDataAxios(
      `team/teamsShowForManagerPenal/${userData.company_id}/${userData.id}`
    );
    console.log("responseResult of teams Data", responseResult.result);
    setTeamsData(responseResult.result);
  };

  const chkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.history.replace({ pathname: "/LoginMobile" });
      // setLoading(false);
    }
  };

  const handleLogout = (opt) => {
    localStorage.clear();
    window.location.reload();
  };

  const showTeamsName = () => {
    return getTeamsData.map(function (item, key) {
      return (
        <ul className="nav-second-level" style={{ cursor: "pointer" }}>
          <li>
            {/* <a href={false} onClick={() => handleClick(0)}> */}
            <a
              href={false}
              // onClick={() => handleClick(38)}
              onClick={() => {
                addTitle("Team"); props.handleDashComponent(
                  "",
                  <TeamShows
                    item={item}
                    handleDashComponent={props.handleDashComponent}
                  />,
                  localStorage.setItem("page", 5)
                )
              }}
            >
              {item.team_name}
            </a>
          </li>
        </ul>
      );
    });
  };

  const handleClick = (option) => {
    dispatch({ type: "REMOVE_ITEM" });
    props.handleDashComponent(option);
  };

  const addTitle = (txt) => {
    try {
      // alert(txt) 
      dispatch({ type: 'HEADERTITLE', payload: txt });

    } catch (err) {
      console.log("Catch ERROR IN LI", err)
    }
  }


  return (
    <>
      <div className="left-side-menu">
        <div className="h-100" data-simplebar="">
          {/* User box */}
          <div className="user-box text-center">
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
            <div className="dropdown">
              <a
                href="#"
                className="user-name dropdown-toggle h5 mt-2 mb-1 d-block"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* Nowak Helme */}
                {getName}
              </a>
              {tempScopes.includes("can_login_auditor_penal") == true ? (
                <div className="text-muted">
                  <span>{Rolename[0]}</span>
                </div>
              ) : (
                <div className="text-muted">
                  <span>{Rolename[0]}</span>
                </div>
              )}

              <div className="dropdown-menu user-pro-dropdown">
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                >
                  <i className="fe-user me-1" />
                </a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                ></a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                ></a>
                {/* item*/}
                <a
                  href="javascript:void(0);"
                  className="dropdown-item notify-item"
                ></a>
              </div>
            </div>
            <ul className="list-inline">
              <li className="list-inline-item">
                <a href={false} className="text-muted left-user-info">
                  {/* <i className="mdi mdi-cog" /> */}
                </a>
              </li>
              <li className="list-inline-item">
                <a href={false}>{/* <i className="mdi mdi-power" /> */}</a>
              </li>
            </ul>
          </div>
          {/*- Sidemenu */}
          <div id="sidebar-menu">
            <ul id="side-menu">
              <li>
                <a onClick={() => { addTitle("Dashboard"); handleClick(1) }} style={{ cursor: "pointer" }}>
                  <i className="mdi mdi-view-dashboard-outline" />
                  <span> Dashboard </span>
                </a>
              </li>
              {tempScopes.includes("can_login_auditor_penal") == true ? null : (
                <li>
                  <a href="#email" data-bs-toggle="collapse">
                    <i className="fe-user" />
                    <span> Team </span>
                    <span className="menu-arrow" />
                  </a>
                  <div className="collapse" id="email">
                    {showTeamsName()}
                  </div>
                </li>
              )}
              {tempScopes.includes("can_login_auditor_penal") == true ? (
                <li>
                  <a
                    href={false}
                    onClick={() => { addTitle("Users"); handleClick(3) }}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fe-user" />
                    <span> Users </span>
                  </a>
                </li>
              ) : null}

              <li>
                <a
                  href={false}
                  onClick={() => { addTitle("Customers"); handleClick(5) }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-star" />
                  <span> Customers </span>
                </a>
              </li>
              <li>
                <a
                  href={false}
                  onClick={() => { addTitle("Tasks"); handleClick(6) }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-format-list-bulleted" />
                  <span> Tasks </span>
                </a>
              </li>

              {tempScopes.includes("can_login_auditor_penal") == true ? null : (
                <li>
                  <a
                    href={false}
                    onClick={() => { addTitle("Briefing"); handleClick(13) }}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="mdi mdi-track-light" />
                    <span> Briefing </span>
                  </a>
                </li>
              )}

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
                      <a href={false} onClick={() => { addTitle("Attendance report"); handleClick(14) }}>
                        Attendance report
                      </a>
                    </li>
                    <li>
                      <a href={false} onClick={() => { addTitle("Call report"); handleClick(15) }}>
                        Call report
                      </a>
                    </li>
                    <li>
                      <a href={false} onClick={() => { addTitle("Task report"); handleClick(16) }}>
                        Tasks report
                      </a>
                    </li>
                    <li>
                      <a href={false} onClick={() => { addTitle("Team report"); handleClick(17) }}>
                        Team report
                      </a>
                    </li>
                    {tempScopes.includes("can_login_auditor_penal") ==
                      true ? null : (
                      <li>
                        <a href={false} onClick={() => { addTitle("Briefing report"); handleClick(18) }}>
                          Briefing report
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </li>

              <li>
                <a
                  href={false}
                  onClick={() => { addTitle("Logout"); handleLogout(19) }}
                  style={{ cursor: "pointer" }}
                >
                  <i className="mdi mdi-track-light" />
                  <span> Logout </span>
                </a>
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
