import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import { CSVLink } from "react-csv";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";

export default function AttendanceReport(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getAttendanceReport, setAttendanceReport] = useState([]);
  const [getAttendanceReportExcelData, setAttendanceReportExcelData] = useState(
    []
  );
  const [getTempTableData, setTempTableData] = useState([]);
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceReportExcelData();
  }, []);

  const fetchAttendanceReportExcelData = async () => {
    try {
      let response = await getDataAxios(
        `attendence/AttendanceReportNewPenalDisplay/${CompanyId}`
      );
      if (response.status) {
        var arr = [];
        var tempResult = response.data;
        setLoading(false);
        tempResult.map((item) => {
          item["BreakDate"] =
            item.BreakDate != null
              ? moment(item.BreakDate).format("DD/MM/YYYY")
              : null;
          arr.push(item);
          setAttendanceReportExcelData(arr);
          setAttendanceReport(response.data);
          setTempTableData(response.data);
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      // var id = `${item.id}`;
      var tempDate = moment(item.date).format("DD/MM/YYYY");
      if (
        (item.UserName &&
          item.UserName.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (tempDate && tempDate.includes(e.target.value))
      ) {
        searchArr.push(item);
      }
    });
    setAttendanceReport(searchArr);
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
        `attendence/FilterAttendance/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.arr.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAttendanceReport(response.arr);
          setAttendanceReportExcelData(response.arr);
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
        `attendence/FilterAttendance/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.arr.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAttendanceReport(response.arr);
          setAttendanceReportExcelData(response.arr);
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
        `attendence/FilterAttendance/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.arr.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAttendanceReport(response.arr);
          setAttendanceReportExcelData(response.arr);
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
      entryStart + value > getAttendanceReport.length
        ? getAttendanceReport.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getAttendanceReport.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getAttendanceReport.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let name = "";
    let role = "";
    let teamname = "";
    let date = "";
    let in_time = "";
    let out_time = "";
    let totalbrk = "";
    let durations = "";
    let attenstatus = "";
    let breakStartTime = "";
    let breakEndTime = "";
    let breakDate = "";
    let breakType = "";
    try {
      name = getAttendanceReport[i].UserName;
      role = getAttendanceReport[i].RoleName;
      teamname = getAttendanceReport[i].TeamName;
      date = moment(getAttendanceReport[i].date).format("DD/MM/YYYY");
      in_time = getAttendanceReport[i].in_time;
      out_time = getAttendanceReport[i].out_time;
      totalbrk = getAttendanceReport[i].TotalBreak;
      durations = getAttendanceReport[i].Effectivehours;
      attenstatus = getAttendanceReport[i].Status;
      breakStartTime =
        getAttendanceReport[i].BreakStartTime != null
          ? moment(getAttendanceReport[i].BreakStartTime, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            )
          : "-";
      breakEndTime =
        getAttendanceReport[i].BreakEndTime != null
          ? moment(getAttendanceReport[i].BreakEndTime, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            )
          : "-";
      breakDate =
        getAttendanceReport[i].BreakDate != null
          ? getAttendanceReport[i].BreakDate
          : "-";
      breakType =
        getAttendanceReport[i].BreakType != null
          ? getAttendanceReport[i].BreakType
          : "-";
    } catch (e) {
      name = "";
      role = "";
      teamname = "";
      date = "";
      in_time = "";
      out_time = "";
      totalbrk = "";
      durations = "";
      attenstatus = "";
      breakStartTime = "";
      breakEndTime = "";
      breakDate = "";
      breakType = "";
    }
    return (
      <tr>
        <td>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <span class="m-1">{name}</span>{" "}
          </div>
        </td>
        <td> {role} </td>
        <td> {teamname}</td>
        <td> {date} </td>
        <td> {in_time} </td>
        <td> {out_time}</td>
        <td> {totalbrk} </td>
        <td> {durations} </td>
        <td>
          {attenstatus == "out" ? (
            <div style={{ fontWeight: 600, color: "lightgreen" }}>
              {" "}
              <span class="badge bg-success"> Present</span>{" "}
            </div>
          ) : attenstatus == "Force logout" ? (
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
          ) : attenstatus == "in" ? (
            <span
              class="badge bg-info"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              In
            </span>
          ) : attenstatus == "Absent" ? (
            <div style={{ fontWeight: 600 }}>
              {" "}
              <span class="badge bg-danger">Absent</span>{" "}
            </div>
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
      (entNumber + 1) * entriesPerPage < getAttendanceReport.length
        ? (entNumber + 1) * entriesPerPage
        : getAttendanceReport.length
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
    let totalPages = getAttendanceReport.length / entriesPerPage;
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
                              <h5 class="mt-0">Attendance report</h5>
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
                                  <div className="dropdown float-end">
                                    <a
                                      href="#"
                                      className="dropdown-toggle arrow-none card-drop"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                    >
                                      <button
                                        type="button"
                                        class="btn btn-sm"
                                        style={{
                                          background: "#4261F7",
                                          border: "1px solid #4261F7",
                                          color: "#fff",
                                          borderRadius: 5,
                                        }}
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
                                      {/* item*/}
                                    </div>
                                  </div>
                                  <CSVLink
                                    data={getAttendanceReportExcelData}
                                    filename={"Attendance Report.csv"}
                                  >
                                    <button
                                      type="button"
                                      class="btn btn-info btn-sm"
                                      style={{
                                        marginLeft: 5,
                                        borderRadius: 5,
                                      }}
                                    >
                                      <i class="mdi mdi-download"></i> Export
                                    </button>
                                  </CSVLink>
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
                            </div>
                          </div>
                          <div class="col-lg-2">
                            <div
                              class="row"
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
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
                      </div>

                      <div className="table" style={{ fontSize: 11.5 }}>
                        <table id="productTable" className="table table-hover">
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
                                  <div>User</div>
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
                                  <div>Role</div>
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
                                  }}
                                >
                                  <div>Team</div>
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
                                onClick={() => sortTable(5)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "80px",
                                  }}
                                >
                                  <div>In time</div>
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
                                    width: "100px",
                                  }}
                                >
                                  <div>Out time</div>
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
                                    width: "130px",
                                  }}
                                >
                                  <div>Total Break</div>
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
                                  <div>Effective hours</div>
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
                                  }}
                                >
                                  <div>Status</div>
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
                                    width: "150px",
                                  }}
                                >
                                  <div>Break start time</div>
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
                                    width: "150px",
                                  }}
                                >
                                  <div>Break end time</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>

                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(12)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "130px",
                                  }}
                                >
                                  <div>Break date</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>

                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: "0px 15px 0px 0px",
                                }}
                                onClick={() => sortTable(13)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "110px",
                                  }}
                                >
                                  <div>Break type</div>
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
                                  No attendance report yet..!
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
                          {!getAttendanceReport.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getAttendanceReport.length +
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
