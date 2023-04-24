import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import { PieChart } from "react-minimal-pie-chart";
import moment from "moment";
import { CSVLink } from "react-csv";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";

export default function AuditorAttendanceView(props) {
  // console.log("props in attendance View", props);

  const [Page, setPage] = useState(1);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [UserId, setUserId] = useState(props.getData.id);
  const [CompanyId, setCompany] = useState(props.getData.company_id);
  const [AttendanceData, setAttendanceData] = useState([]);
  const [AbsentData, setAbsentData] = useState([]);
  const [PresentData, setPresentData] = useState([]);
  const [ForceLogoutData, setForceLogoutData] = useState([]);
  const [TotalAttenData, setTotalAttenData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [getAttendanceDownloadData, setAttendanceDownloadData] = useState([]);
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAttendance();
  }, []);

  const fetchUserAttendance = async () => {
    try {
      let response = await getDataAxios(
        `attendence/display/${UserId}/${CompanyId}`
      );
      // console.log("response data full data", response);
      if (response.status == true) {
        setAttendanceData(response.result);
        setTempTableData(response.result);
        setAttendanceDownloadData(response.arr);
        setAbsentData(response.Absent[0]);
        setPresentData(response.Present[0]);
        setForceLogoutData(response.ForceLogout[0]);
        setTotalAttenData(response.TotalAtten[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch auditor attendance view", error);
    }
  };

  const fetchUserAttendanceGraph = async () => {
    let response = await getDataAxios(
      `attendence/graphDisplay/${UserId}/${CompanyId}`
    );
    // console.log("fetchUserAttendanceGraph -----------> ", response);
    if (response.status == true) {
      setAbsentData(response.Absent[0]);
      setPresentData(response.Present[0]);
      setForceLogoutData(response.ForceLogout[0]);
      setTotalAttenData(response.TotalAtten[0]);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      var tempDate = moment(item.date).format("DD/MM/YYYY");
      if (
        (tempDate && tempDate.includes(e.target.value)) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setAttendanceData(searchArr);
  };

  const handleFilter = async () => {
    try {
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const currentOfMonth = moment().format("YYYY-MM-DD");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let GraphFilterResponse = await postDataAxios(
        `attendence/FilterGraphDisplay/${UserId}/${CompanyId}`,
        body
      );
      if (GraphFilterResponse.status == true) {
        swal({
          title: `${GraphFilterResponse.Result1[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setForceLogoutData(GraphFilterResponse.FilterForcelogout[0]);
          setPresentData(GraphFilterResponse.FilterPresent[0]);
          setTotalAttenData(GraphFilterResponse.FilterTotalAtten[0]);
          setAttendanceData(GraphFilterResponse.Result1[0]);
          setTempTableData(GraphFilterResponse.Result1[0]);
          setAttendanceDownloadData(GraphFilterResponse.arr);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in filterattendance", error);
    }
  };

  const handleLastMonthFilter = async () => {
    try {
      const startDateofLastMonth = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const endDateofLastMonth = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
      let body = {
        startDate: startDateofLastMonth,
        endDate: endDateofLastMonth,
      };
      let GraphFilterResponse = await postDataAxios(
        `attendence/FilterGraphDisplay/${UserId}/${CompanyId}`,
        body
      );
      if (GraphFilterResponse.status == true) {
        swal({
          title: `${GraphFilterResponse.Result1[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setForceLogoutData(GraphFilterResponse.FilterForcelogout[0]);
          setPresentData(GraphFilterResponse.FilterPresent[0]);
          setTotalAttenData(GraphFilterResponse.FilterTotalAtten[0]);
          setAttendanceData(GraphFilterResponse.Result1[0]);
          setTempTableData(GraphFilterResponse.Result1[0]);
          setAttendanceDownloadData(GraphFilterResponse.arr);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in lastmonth", error);
    }
  };

  const handleLast3MonthFilter = async () => {
    try {
      const startDateofLast3Months = moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD");
      const endDateofLast3Months = moment().format("YYYY-MM-DD");
      let body = {
        startDate: startDateofLast3Months,
        endDate: endDateofLast3Months,
      };
      let GraphFilterResponse = await postDataAxios(
        `attendence/FilterGraphDisplay/${UserId}/${CompanyId}`,
        body
      );
      if (GraphFilterResponse.status == true) {
        swal({
          title: `${GraphFilterResponse.Result1[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setForceLogoutData(GraphFilterResponse.FilterForcelogout[0]);
          setPresentData(GraphFilterResponse.FilterPresent[0]);
          setTotalAttenData(GraphFilterResponse.FilterTotalAtten[0]);
          setAttendanceData(GraphFilterResponse.Result1[0]);
          setTempTableData(GraphFilterResponse.Result1[0]);
          setAttendanceDownloadData(GraphFilterResponse.arr);
        });
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in last3month", error);
    }
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
      entryStart + value > AttendanceData.length
        ? AttendanceData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (AttendanceData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < AttendanceData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let id = "";
    let date = "";
    let intime = "";
    let brk = "";
    let outtime = "";
    let Duration = "";
    let Astatus = "";
    let breakStartTime = "";
    let breakEndTime = "";
    let breakDate = "";
    let breakType = "";
    try {
      id = AttendanceData[i].id;
      date = moment(AttendanceData[i].date).format("DD/MM/YYYY");
      intime = moment(AttendanceData[i].in_time, ["HH:mm:ss"]).format(
        "hh:mm:ss a"
      );
      brk = moment
        .utc(AttendanceData[i].TotalBreakTime * 1000)
        .format("HH:mm:ss");
      outtime =
        AttendanceData[i].status == "Force logout" ||
        AttendanceData[i].status == "in"
          ? "-"
          : moment(AttendanceData[i].out_time, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            );
      Duration =
        AttendanceData[i].status == "Force logout" ||
        AttendanceData[i].status == "in"
          ? "-"
          : moment.utc(AttendanceData[i].duration * 1000).format("HH:mm:ss");
      Astatus = AttendanceData[i].status;
      breakStartTime =
        AttendanceData[i].BreakStartTime != null
          ? moment(AttendanceData[i].BreakStartTime, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            )
          : "-";
      breakEndTime =
        AttendanceData[i].BreakEndTime != null
          ? moment(AttendanceData[i].BreakEndTime, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            )
          : "-";
      breakDate =
        AttendanceData[i].BreakDate != null
          ? moment(AttendanceData[i].BreakDate).format("DD/MM/YYYY")
          : "-";
      breakType =
        AttendanceData[i].BreakType != null ? AttendanceData[i].BreakType : "-";
    } catch (error) {
      id = "";
      date = "";
      intime = "";
      brk = "";
      outtime = "";
      Duration = "";
      Astatus = "";
      breakStartTime = "";
      breakEndTime = "";
      breakDate = "";
      breakType = "";
    }

    return (
      <tr>
        <td>{id}</td>
        <td> {date} </td>
        <td> {intime} </td>
        <td> {brk}</td>
        <td> {outtime} </td>
        <td> {Duration} </td>
        <td>
          {Astatus == "out" ? (
            <span
              class="badge bg-success"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              Present
            </span>
          ) : Astatus == "Force logout" ? (
            <span
              class="badge bg-warning"
              style={{
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Force logout
            </span>
          ) : Astatus == "in" ? (
            <span
              class="badge bg-info"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              In
            </span>
          ) : (
            <div style={{ fontWeight: 600 }}>
              {" "}
              <span class="badge bg-danger">Absent</span>{" "}
            </div>
          )}
        </td>
        <td> {breakStartTime} </td>
        <td> {breakEndTime} </td>
        <td> {breakDate} </td>
        <td> {breakType} </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < AttendanceData.length
        ? (entNumber + 1) * entriesPerPage
        : AttendanceData.length
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
    let totalPages = AttendanceData.length / entriesPerPage;
    let CheckFloatnumber =
      Number(totalPages) === totalPages && totalPages % 1 !== 0;

    return (
      <>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          count={parseInt(
            CheckFloatnumber == true ? totalPages + 1 : totalPages
          )}
          page={Page}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: BackFun, next: NextFun }}
              {...item}
            />
          )}
          onChange={handlePageNumber}
        />
      </>
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
        <div class="container-fluid" style={{ padding: 0 }}>
          <div
            class="row"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div class="col-9 col-md-6">
              <h5 class="mt-0">Attendance Graph</h5>
              <div class="card border border-default p-2">
                <div class="grid-structure">
                  <div class="row" style={{}}>
                    <div
                      class="col-5 col-md-5 form-label"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <PieChart
                        style={{
                          width: "100%",
                          height: "100%",
                          fontSize: "12px",
                        }}
                        animate={true}
                        animationDuration={5000}
                        label={({ dataEntry }) =>
                          `${Math.round(
                            dataEntry.value != 0 ? dataEntry.value : null
                          )}%`
                        }
                        totalValue={100}
                        labelStyle={{ fontSize: 6, overflow: "hidden" }}
                        data={[
                          // {
                          //   title: "Absent",
                          //   value: AbsentData.length,
                          //   color: "#575fcf",
                          // },
                          {
                            title: "Force logout",
                            value:
                              ForceLogoutData.length != 0
                                ? parseInt(
                                    (ForceLogoutData.length /
                                      TotalAttenData.length) *
                                      100
                                  )
                                : "",
                            color: "#ffb848",
                          },
                          {
                            title: "Present",
                            value:
                              PresentData.length != 0
                                ? parseInt(
                                    (PresentData.length /
                                      TotalAttenData.length) *
                                      100
                                  )
                                : "",
                            color: "#10c469",
                          },
                        ]}
                      />
                    </div>

                    <div
                      class="col-7 col-md-7 form-label"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: 0,
                      }}
                    >
                      <ul class="list-group mb-0 user-list">
                        <li class="list-group-item">
                          {PresentData.length != 0 ? (
                            <a class="user-list-item">
                              <div class="user float-start me-1">
                                <i
                                  class="mdi mdi-circle"
                                  style={{
                                    color: "#10c469",
                                  }}
                                ></i>
                              </div>
                              <div
                                class="user-desc overflow-hidden"
                                style={{ display: "inline-flex" }}
                              >
                                <h5 class="fw-normal name mt-0 mb-1">
                                  Present
                                </h5>
                              </div>
                            </a>
                          ) : (
                            ""
                          )}
                        </li>
                        <li class="list-group-item">
                          {ForceLogoutData.length != 0 ? (
                            <a class="user-list-item">
                              <div class="user float-start me-1">
                                <i
                                  class="mdi mdi-circle"
                                  style={{ color: "#ffb848" }}
                                ></i>
                              </div>
                              <div
                                class="user-desc overflow-hidden"
                                style={{ display: "inline-flex" }}
                              >
                                <h5 class="fw-normal name mt-0 mb-1">
                                  Force logout
                                </h5>
                              </div>
                            </a>
                          ) : (
                            ""
                          )}
                        </li>
                        <li class="list-group-item">
                          {/* <a class="user-list-item">
                            <div class="user float-start me-1">
                              <i
                                class="mdi mdi-circle"
                                style={{ color: "#575fcf" }}
                              ></i>
                            </div>
                            <div
                              class="user-desc overflow-hidden"
                              style={{ display: "inline-flex" }}
                            >
                              <h5 class="name mt-0 mb-1">Absent</h5>
                            </div>
                          </a> */}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-3 col-md-6">
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="dropdown float-end">
                  <a
                    href="#"
                    className="dropdown-toggle arrow-none card-drop"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <button
                      type="button"
                      class="btn btn-primary btn-sm"
                      style={{ borderRadius: 5 }}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-100"></div>
          <div class="col-md-12">
            <div class="card border border-default">
              <div class="col">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-12">
                        <div class="grid-structure">
                          <div
                            class="row"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <div class="col-12 col-md-6 form-label">
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
                                          showEntry(
                                            parseInt(event.target.value)
                                          )
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
                              </div>
                            </div>
                            <div
                              class="col-12 col-md-6 form-label"
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginLeft: "inherit",
                              }}
                            >
                              <div
                                class="ro1w"
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <div class="col-6 col-md-5">
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
                                        <div
                                          class="input-group input-group-merge"
                                          style={{}}
                                        >
                                          <input
                                            type="text"
                                            class="form-control"
                                            style={{
                                              zIndex: 0,
                                              height: "32px",
                                              border: "0px solid #fff",
                                            }}
                                            onChange={(e) => handleSearch(e)}
                                            placeholder="Search"
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
                                <div
                                  class="col-6 col-md-4"
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    paddingRight: 0,
                                  }}
                                >
                                  <CSVLink
                                    data={getAttendanceDownloadData}
                                    filename={`${props.getData.name} attendance.csv`}
                                  >
                                    <button
                                      type="button"
                                      style={{
                                        width: 100,
                                        borderRadius: 5,
                                        height: 34,
                                      }}
                                      class="btn btn-info btn-sm"
                                    >
                                      <i class="mdi mdi-download"></i> Export
                                    </button>
                                  </CSVLink>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          className="table"
                          style={{ fontSize: 11.5, overflow: "hidden" }}
                        >
                          <table
                            id="productTable"
                            className="table table-hover"
                          >
                            <thead className="table">
                              <tr>
                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
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
                                    padding: "0px 15px 0px 0px",
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
                                    <div>Date</div>
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(3)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "110px",
                                    }}
                                  >
                                    {" "}
                                    <div>In Time</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(4)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "130px",
                                    }}
                                  >
                                    {" "}
                                    <div>Total Break Time</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(5)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "130px",
                                    }}
                                  >
                                    {" "}
                                    <div>Out Time</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(6)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "130px",
                                    }}
                                  >
                                    {" "}
                                    <div>Effective hours</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(7)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "150px",
                                    }}
                                  >
                                    {" "}
                                    <div>Attendance Status</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>

                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(8)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "130px",
                                    }}
                                  >
                                    {" "}
                                    <div>Break start time</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>

                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(9)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "130px",
                                    }}
                                  >
                                    {" "}
                                    <div>Break end time</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>

                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(10)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "130px",
                                    }}
                                  >
                                    {" "}
                                    <div>Break date</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>

                                <th
                                  style={{
                                    cursor: "pointer",
                                    padding: "0px 15px 0px 0px",
                                  }}
                                  onClick={() => sortTable(11)}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "110px",
                                    }}
                                  >
                                    {" "}
                                    <div>Break type</div>{" "}
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
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
                                    No attendance yet..!
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
                            {!AttendanceData.length
                              ? "[Nothing to show]"
                              : "Showing  " +
                                (entryStart + 1) +
                                " to " +
                                entryEnd +
                                " of " +
                                AttendanceData.length +
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
        </div>
      )}
    </>
  );
}
