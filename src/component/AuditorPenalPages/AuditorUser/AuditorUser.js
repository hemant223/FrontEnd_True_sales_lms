import React, { useState, useEffect } from "react";
import {
  getDataAxios,
  postDataAndImage,
  postDataAxios,
  ServerURL,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment/moment";
import AuditorViewUser from "../AuditorViewUser/AuditorViewUser";
import swal from "sweetalert";
import { CSVLink } from "react-csv";
import { PaginationItem } from "@mui/material";
import io from "socket.io-client";
// var socket = io.connect("http://localhost:8002");
// var socket = io.connect("http://164.52.195.173:8002");
var socket = io.connect("https://socketio.truesales.in");
// var socket = io.connect("https://socketio.truesales.in");

const excelFormat = [
  "xlsx",
  "xlsm",
  "xlsb",
  "xltx",
  "xltm",
  "xls",
  "xlt",
  "xml",
  "xlam",
  "xla",
  "xlw",
  "xlr",
  "csv",
  "xls",
];

export default function AuditorUser(props) {
  const [getAllUsers, setAllUsers] = useState([]);
  const [getAllUsersExcelDownload, setAllUsersExcelDownload] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getTempTableData, setTempTableData] = useState([]);
  const [UploadExcel, setUploadExcel] = useState(false);
  const [getUserExcel, setUserExcel] = useState("");
  const [getLoading, setLoading] = useState(true);
  const [getRefresh, setRefresh] = useState(false);
  const [FilterTeam, setFilterTeam] = useState([]);

  useEffect(() => {
    socket.on("displaycalllive", (data) => {
      setRefresh(!getRefresh);
    });
    socket.on("displaywrapping", (data) => {
      setRefresh(!getRefresh);
    });
    socket.on("displayIdle", (data) => {
      setRefresh(!getRefresh);
    });
  }, [getRefresh]);

  useEffect(() => {
    fetchAllUsers();
    fetchTeams();
    // fetchAllUsersExcelDownload();
  }, []);

  const fetchTeamsUser = async (teamId) => {
    try {
      setLoading(true);
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      let responseAuditorTeam = await getDataAxios(
        `usersR/AuditorTeamsUser/${userCompanyId.company_id}/${teamId}`
      );
      // console.log("responseAuditorTeam", responseAuditorTeam);
      if (responseAuditorTeam.status == true) {
        swal({
          title: `${responseAuditorTeam.dataResult[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setLoading(false);
          setAllUsers(responseAuditorTeam.dataResult[0]);
          setTempTableData(responseAuditorTeam.dataResult[0]);
          setAllUsersExcelDownload(responseAuditorTeam.dataExcel[0]);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTeams = async () => {
    try {
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      let response = await getDataAxios(
        `team/teamsDisplay/${userCompanyId.company_id}`
      );
      // console.log("ddddddddddddddddddddddddddddddddddddd", response);
      if (response.status == true) {
        setFilterTeam(response.data);
      } else {
        swal({
          title: `Something went wrong in team fetch.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleClose = () => {
    setUserExcel("");
    setUploadExcel(false);
  };

  const handleExcelSubmit = async () => {
    try {
      setLoading(true);
      var temp = getUserExcel.name.split(".")[1];
      if (excelFormat.includes(temp)) {
        let formData = new FormData();
        formData.append("userExcel", getUserExcel);
        const config = { headers: { "content-type": "multipart/form-data" } };
        let excelResponse = await postDataAndImage(
          `usersR/UploadExcel`,
          formData,
          config
        );
        if (excelResponse.status) {
          swal({
            title: `${excelResponse.message}`,
            icon: "success",
            button: "ok",
          }).then(() => {
            window.location.reload();
            setUploadExcel(false);
            setLoading(false);
          });
        } else {
          swal({
            title: `Something went wrong`,
            icon: "error",
            button: "ok",
          }).then(() => {
            setLoading(false);
            setUploadExcel(false);
          });
        }
      } else {
        swal({
          title: `Please select file in excel format`,
          icon: "warning",
          button: "ok",
        }).then(() => {
          // window.location.reload();
          setLoading(false);
          setUploadExcel(false);
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleLast3MonthFilter = async () => {
    try {
      setLoading(true);
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      const startDateofLast3Months = moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD hh:mm");
      const endDateofLast3Months = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startDateofLast3Months,
        endDate: endDateofLast3Months,
      };
      let response = await postDataAxios(
        `usersR/UserFilter/${userCompanyId.company_id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllUsers(response.resultt[0]);
          setAllUsersExcelDownload(response.ExcelData[0]);
          setLoading(false);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleLastMonthFilter = async () => {
    try {
      setLoading(true);
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      const startDateofLastMonth = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD hh:mm");
      const endDateofLastMonth = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startDateofLastMonth,
        endDate: endDateofLastMonth,
      };
      let response = await postDataAxios(
        `usersR/UserFilter/${userCompanyId.company_id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllUsers(response.resultt[0]);
          setAllUsersExcelDownload(response.ExcelData[0]);
          setLoading(false);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD hh:mm");
      const currentOfMonth = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let response = await postDataAxios(
        `usersR/UserFilter/${userCompanyId.company_id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllUsers(response.resultt[0]);
          setAllUsersExcelDownload(response.ExcelData[0]);
          setLoading(false);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      var result = await getDataAxios(
        `usersR/displayAll/${userCompanyId.company_id}`
      );
      if (result.status) {
        setAllUsers(result.Data[0]);
        setTempTableData(result.Data[0]);
        setAllUsersExcelDownload(result.ExcelData[0]);
        setLoading(false);
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchAllUsersExcelDownload = async () => {
    let userCompanyId = JSON.parse(localStorage.getItem("user"));
    var result = await getDataAxios(
      `usersR/DisplayAllExcelDownload/${userCompanyId.company_id}`
    );
    if (result.status) {
      setAllUsersExcelDownload(result.result);
    } else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }
  };

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      if (
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setAllUsers(searchArr);
  };

  const handleExcel = (e) => {
    setUploadExcel(true);
    setUserExcel(e.target.files[0]);
  };

  const sortTable = (n) => {
    let table,
      rows,
      switching,
      i,
      x,
      y,
      willSwitch,
      directory,
      switchCount = 0;
    table = document.getElementById("productTable");
    switching = true;
    directory = "ascending";

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        willSwitch = false;

        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];

        if (directory === "ascending") {
          if (n === 0) {
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
              willSwitch = true;
              break;
            }
          } else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            willSwitch = true;
            break;
          }
        } else if (directory === "descending") {
          if (n === 0) {
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
              willSwitch = true;
              break;
            }
          } else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            willSwitch = true;
            break;
          }
        }
      }
      if (willSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;

        switchCount++;
      } else {
        if (switchCount === 0 && directory === "ascending") {
          directory = "descending";
          switching = true;
        }
      }
    }
  };

  const showEntry = (value) => {
    setEntryEnd(
      entryStart + value > getAllUsers.length
        ? getAllUsers.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getAllUsers.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getAllUsers.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleViewPage = (item) => {
    props.handleDashComponent(
      "",
      <AuditorViewUser
        item={item}
        handleDashComponent={props.handleDashComponent}
      />
    );
  };

  const showEmployee = (i) => {
    let id = "";
    let user_picture = "";
    let name = "";
    let rolename = "";
    let teamname = "";
    let email = "";
    let mobile = "";
    let created_at = "";
    let status = "";
    let callLiveStatus = "";
    try {
      id = getAllUsers[i].id;
      user_picture = getAllUsers[i].user_picture;
      name = getAllUsers[i].name;
      rolename = getAllUsers[i].RoleName;
      teamname = getAllUsers[i].TeamName;
      email = getAllUsers[i].email;
      mobile = getAllUsers[i].mobile;
      created_at = moment(getAllUsers[i].created_at).format("DD/MM/YYYY");
      status = getAllUsers[i].status;
      callLiveStatus = getAllUsers[i].CallLiveStatus;
    } catch (e) {
      id = "";
      user_picture = "";
      name = "";
      rolename = "";
      teamname = "";
      email = "";
      mobile = "";
      created_at = "";
      status = "";
      callLiveStatus = "";
    }
    return (
      <tr>
        <td>{id}</td>
        <td width="200">
          {user_picture == null ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: 120,
              }}
            >
              <div class="position-relative">
                <img
                  src="assets/images/users/user-7.jpg"
                  alt="image"
                  class="img-fluid avatar-sm rounded-circle"
                />
                {callLiveStatus == "On call" ? (
                  <span
                    class="position-absolute top-10 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                    title="On Call"
                    tabindex="0"
                    data-plugin="tippy"
                    data-tippy-placement="top"
                  ></span>
                ) : callLiveStatus == "Wrapping up" ? (
                  <span
                    class="position-absolute top-10 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                    title="Wrapping up"
                    tabindex="0"
                    data-plugin="tippy"
                    data-tippy-placement="top"
                  ></span>
                ) : (
                  <span
                    class="position-absolute top-10 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                    title="Idle"
                    tabindex="0"
                    data-plugin="tippy"
                    data-tippy-placement="top"
                  ></span>
                )}
              </div>
              <span style={{ marginLeft: 10 }}>{name}</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: 120,
              }}
            >
              <div class="position-relative">
                <img
                  src={`${ServerURL}/images/${user_picture}`}
                  alt="image"
                  class="img-fluid avatar-sm rounded-circle"
                />{" "}
                {callLiveStatus == "On call" ? (
                  <span
                    class="position-absolute top-10 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
                    title="On Call"
                    tabindex="0"
                    data-plugin="tippy"
                    data-tippy-placement="top"
                  ></span>
                ) : callLiveStatus == "Wrapping up" ? (
                  <span
                    class="position-absolute top-10 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
                    title="Wrapping up"
                    tabindex="0"
                    data-plugin="tippy"
                    data-tippy-placement="top"
                  ></span>
                ) : (
                  <span
                    class="position-absolute top-10 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                    title="Idle"
                    tabindex="0"
                    data-plugin="tippy"
                    data-tippy-placement="top"
                  ></span>
                )}
              </div>
              <span style={{ marginLeft: 10 }}>{name}</span>{" "}
            </div>
          )}
        </td>
        <td> {rolename} </td>
        <td> {teamname}</td>
        <td> {email} </td>
        <td> {mobile} </td>
        <td> {created_at}</td>
        <td>
          {status == "Active" ? (
            <div style={{ fontWeight: 600, color: "#2e892e" }}> {status} </div>
          ) : (
            <div style={{ fontWeight: 600, color: "red" }}> {status} </div>
          )}
        </td>
        <td
          style={{
            display: "inline-block",
            width: "max-content",
            height: "65px",
            border: "none",
          }}
        >
          <button
            type="button"
            class="btn btn-primary btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleViewPage(getAllUsers[i])}
          >
            <i class="mdi mdi-eye"></i>
          </button>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getAllUsers.length
        ? (entNumber + 1) * entriesPerPage
        : getAllUsers.length
    );
    setPage(value);
  };

  const NextFun = () => {
    return <div>Next</div>;
  };
  function BackFun() {
    return <div>Previous</div>;
  }

  const handlePaging = () => {
    let totalPages = getAllUsers.length / entriesPerPage;
    let CheckFloatnumber =
      Number(totalPages) === totalPages && totalPages % 1 !== 0;

    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        count={parseInt(CheckFloatnumber == true ? totalPages + 1 : totalPages)}
        page={Page}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: BackFun, next: NextFun }}
            {...item}
          />
        )}
        onChange={handlePageNumber}
      />
    );
  };

  return (
    <>
      {getLoading ? (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "75vh",
          }}
        >
          <img src="/images/loader.gif" width="20%" />
        </div>
      ) : (
        <div class="container-fluid">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="c1ard">
                    <div class="card1-body">
                      <div class="grid-structure">
                        <div
                          class="row"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div class="col-6 col-md-9 form-label">
                            <div class="grid-cont1ainer">
                              <h5 class="mt-0">Users Management</h5>
                            </div>
                          </div>
                          <div
                            class="col-6 col-md-3"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <div class="grid-cont1ainer">
                              <div class="row ">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <div
                                    className="modal fade"
                                    id="centermodal"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                    style={{ display: "none" }}
                                  >
                                    <div className="modal-dialog modal-dialog-centered">
                                      <div className="modal-content">
                                        <div className="modal-header">
                                          <h4
                                            className="modal-title"
                                            id="myCenterModalLabel"
                                          >
                                            Import Users
                                          </h4>

                                          <CSVLink
                                            data={getAllUsersExcelDownload}
                                            filename={"User List.csv"}
                                          >
                                            <button
                                              type="button"
                                              className="btn btn-primary btn-xs"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            >
                                              Download sample file
                                            </button>
                                          </CSVLink>
                                        </div>

                                        <div className="modal-body">
                                          <div className="mb-3">
                                            <input
                                              type="file"
                                              id="contained-button-filepic"
                                              className="form-control"
                                              onChange={(event) =>
                                                handleExcel(event)
                                              }
                                            />
                                          </div>

                                          {UploadExcel ? (
                                            <button
                                              style={{
                                                background: "#4261F7",
                                                border: "1px solid #4261F7",
                                                color: "#fff",
                                              }}
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                              class="btn btn-primary btn-sm"
                                              onClick={(e) =>
                                                handleExcelSubmit(e)
                                              }
                                            >
                                              Import
                                            </button>
                                          ) : null}

                                          <button
                                            type="button"
                                            class="btn btn-info btn-sm"
                                            style={{ marginLeft: 12 }}
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                            onClick={() => handleClose()}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{ marginLeft: 10, borderRadius: 5 }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#centermodal"
                                  >
                                    <i class="mdi mdi-download"></i>
                                    Import
                                  </button>
                                  <div
                                    className="modal fade"
                                    id="scrollable-modal"
                                    tabIndex={-1}
                                    aria-labelledby="scrollableModalTitle"
                                    aria-hidden="true"
                                    style={{ display: "none" }}
                                  >
                                    <div
                                      className="modal-dialog modal-dialog-scrollable modal-sm"
                                      role="document"
                                    >
                                      <div className="modal-content">
                                        <div className="modal-body">
                                          {FilterTeam.map((e) => {
                                            return (
                                              <div>
                                                <div
                                                  onClick={() =>
                                                    fetchTeamsUser(e.id)
                                                  }
                                                  data-bs-dismiss="modal"
                                                >
                                                  <div
                                                    style={{
                                                      border: "1px solid black",
                                                      margin: 8,
                                                      textAlign: "center",
                                                      fontSize: 10,
                                                      borderRadius: 10,
                                                      cursor: "pointer",
                                                      height: 20,
                                                      backgroundColor: "grey",
                                                      color: "white",
                                                    }}
                                                  >
                                                    {e.team_name}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="row mt-2">
                          <div class="col-lg-10  form-label">
                            <div
                              class="row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div class="col-6 col-md-10">
                                <div class="row">
                                  <div
                                    style={{ fontSize: 13, fontWeight: 500 }}
                                  >
                                    Show &nbsp;
                                    <select
                                      style={{
                                        borderColor: "#a2a2a2",
                                        borderBox: "none",
                                        cursor: "pointer",
                                        background: "white",
                                        height: "30px",
                                        width: "70px",
                                        borderRadius: "5px",
                                        paddingLeft: "8px",
                                      }}
                                      onChange={(event) =>
                                        showEntry(parseInt(event.target.value))
                                      }
                                      className="select"
                                    >
                                      show entries
                                      <option value={10}>10</option>
                                      <option value={25}>25</option>
                                      <option value={50}>50</option>
                                      <option value={200}>200</option>
                                    </select>
                                    &nbsp;Entries
                                  </div>
                                </div>
                              </div>
                              <div
                                class="col-3 col-md-2"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  paddingRight: 0,
                                }}
                              >
                                <div class="row">
                                  <div className="dropdown float-end">
                                    <a
                                      href={false}
                                      className="dropdown-toggle arrow-none card-drop"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <button
                                        type="button"
                                        class="btn btn-info btn-sm"
                                        style={{ borderRadius: 5, height: 34 }}
                                      >
                                        <i class="mdi mdi-filter"></i> Filter
                                      </button>
                                    </a>
                                    <div
                                      className="dropdown-menu dropdown-menu-end"
                                      style={{ cursor: "pointer" }}
                                    >
                                      {/* item*/}
                                      <div
                                        href="javascript:void(0);"
                                        className="dropdown-item"
                                        onClick={() => handleFilter()}
                                      >
                                        Current month
                                      </div>
                                      {/* item*/}
                                      <div
                                        href="javascript:void(0);"
                                        className="dropdown-item"
                                        onClick={() => handleLastMonthFilter()}
                                      >
                                        Last month
                                      </div>
                                      {/* item*/}
                                      <div
                                        href="javascript:void(0);"
                                        className="dropdown-item"
                                        onClick={() => handleLast3MonthFilter()}
                                      >
                                        Last 3 month
                                      </div>

                                      <div
                                        href="javascript:void(0);"
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#scrollable-modal"
                                      >
                                        Teams
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            class="col-lg-2"
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <div class="col-12 col-md-12">
                              <div
                                class="grid-container"
                                style={{ padding: "0px 11px" }}
                              >
                                <div class="row">
                                  <div
                                    style={{
                                      border: "1px solid #dee2e6",
                                      borderRadius: 3,
                                      display: "flex",
                                      justifyContent: "space-between",
                                      padding: 0,
                                      margin: 0,
                                    }}
                                  >
                                    <div class="input-group input-group-merge">
                                      <input
                                        type="text"
                                        class="form-control"
                                        style={{
                                          zIndex: 0,
                                          height: "32px",
                                          border: "0px solid #fff",
                                        }}
                                        placeholder="Search"
                                        onChange={(e) => handleSearch(e)}
                                      />
                                      <div
                                        class="input-group-text"
                                        data-password="false"
                                      >
                                        {/* <span class="fas fa-search"></span> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="table" style={{ fontSize: 11.5 }}>
                        <table id="productTable" className="table table-hover">
                          <thead className="table">
                            <tr>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "7%",
                                }}
                                onClick={() => sortTable(1)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>ID</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "10%",
                                }}
                                onClick={() => sortTable(2)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Name</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "10%",
                                }}
                                onClick={() => sortTable(3)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Role</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "9%",
                                }}
                                onClick={() => sortTable(4)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Team</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "20%",
                                }}
                                onClick={() => sortTable(5)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Email</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "10%",
                                }}
                                onClick={() => sortTable(6)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Phone</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "10%",
                                }}
                                onClick={() => sortTable(7)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Created</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "10%",
                                }}
                                onClick={() => sortTable(8)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Status</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              <th style={{ width: "12%" }}>Actions</th>
                            </tr>
                          </thead>

                          <tbody style={{ fontSize: 13 }}>
                            {getEmployee().length == 0 ? (
                              <td colspan={7}>
                                <p
                                  style={{
                                    textAlign: "center",
                                  }}
                                >
                                  No user yet..!
                                </p>
                              </td>
                            ) : (
                              getEmployee()
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div
                      class="row"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div class="col-12 col-md-6">
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {!getAllUsers.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getAllUsers.length +
                              " entries"}
                        </div>
                      </div>
                      <div class="col-12 col-md-6">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {handlePaging()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
