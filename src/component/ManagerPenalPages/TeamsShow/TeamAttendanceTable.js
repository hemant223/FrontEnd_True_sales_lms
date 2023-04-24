import React, { useState, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import { CSVLink } from "react-csv";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";

export default function TeamAttendanceTable(props) {
  // console.log("props in Team Attendance Table", props);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(5);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [getTeamAttendance, setTeamAttendance] = useState([]);
  const [getTempAttendanceData, setTempAttendnaceData] = useState([]);
  const [Page, setPage] = useState(1);

  useEffect(() => {
    fetchTeamAttendanceData();
  }, []);

  const fetchTeamAttendanceData = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let TeamAttendanceResult = await getDataAxios(
        `attendence/managerPenalTeamMemberAttendanceShow/${userData.company_id}/${userData.id}/${props.item.id}`
      );
      // console.log("TeamAttendanceResult", TeamAttendanceResult);
      setTeamAttendance(TeamAttendanceResult.arr);
      setTempAttendnaceData(TeamAttendanceResult.arr);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleLast3MonthFilter = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      const startDateofLast3Months = moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD");
      const endDateofLast3Months = moment().format("YYYY-MM-DD");
      let body = {
        startDate: startDateofLast3Months,
        endDate: endDateofLast3Months,
      };
      let response = await postDataAxios(
        `attendence/managerPenalTeamMemberFilterAttendanceShow/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.arr.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTeamAttendance(response.arr);
          setTempAttendnaceData(response.arr);
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

  const handleLastMonthFilter = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
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
      let response = await postDataAxios(
        `attendence/managerPenalTeamMemberFilterAttendanceShow/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.arr.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTeamAttendance(response.arr);
          setTempAttendnaceData(response.arr);
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

  const handleFilter = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const currentOfMonth = moment().format("YYYY-MM-DD");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let response = await postDataAxios(
        `attendence/managerPenalTeamMemberFilterAttendanceShow/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.arr.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTeamAttendance(response.arr);
          setTempAttendnaceData(response.arr);
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

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempAttendanceData.map((item) => {
      if (
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setTeamAttendance(searchArr);
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
      entryStart + value > getTeamAttendance.length
        ? getTeamAttendance.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getTeamAttendance.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getTeamAttendance.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let Id = "";
    let name = "";
    let role = "";
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
      Id = getTeamAttendance[i].id;
      name = getTeamAttendance[i].name;
      role = getTeamAttendance[i].RoleName;
      date = moment(getTeamAttendance[i].date).format("DD/MM/YYYY");
      in_time = getTeamAttendance[i].InTime;
      out_time = getTeamAttendance[i].OutTime;
      totalbrk = getTeamAttendance[i].TotalBreak;
      durations = getTeamAttendance[i].EffectiveHour;
      attenstatus = getTeamAttendance[i].Status;
      breakStartTime =
        getTeamAttendance[i].BreakStartTime != null
          ? moment(getTeamAttendance[i].BreakStartTime, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            )
          : "-";
      breakEndTime =
        getTeamAttendance[i].BreakEndTime != null
          ? moment(getTeamAttendance[i].BreakEndTime, ["HH:mm:ss"]).format(
              "hh:mm:ss a"
            )
          : "-";
      breakDate =
        getTeamAttendance[i].BreakDate != null
          ? getTeamAttendance[i].BreakDate
          : "-";
      breakType =
        getTeamAttendance[i].BreakType != null
          ? getTeamAttendance[i].BreakType
          : "-";
    } catch (e) {
      Id = "";
      name = "";
      role = "";
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
        <td>{Id}</td>
        <td> {name} </td>
        <td> {role} </td>
        <td> {date} </td>
        <td> {in_time} </td>
        <td> {out_time}</td>
        <td> {totalbrk != null ? totalbrk : "00:00:00"} </td>
        <td> {durations != null ? durations : "00:00:00"} </td>
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
      (entNumber + 1) * entriesPerPage < getTeamAttendance.length
        ? (entNumber + 1) * entriesPerPage
        : getTeamAttendance.length
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
    let totalPages = getTeamAttendance.length / entriesPerPage;
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
                                </div>
                              </div>
                              <CSVLink
                                data={getTeamAttendance}
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
                                style={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                }}
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
                                  <option value={5}>5</option>
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
                                    ></div>
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
                              <div>User</div>
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
                              <div>Role</div>
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
                                width: "110px",
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
                                width: "110px",
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
                                width: "110px",
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
                          <p
                            style={{
                              position: "absolute",
                              left: "370px",
                              color: "#979797",
                              borderRadius: "50px",
                              fontFamily: "sans-serif",
                              marginTop: "10px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            No attendance yet..!
                          </p>
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
                      {!getTeamAttendance.length
                        ? "[Nothing to show]"
                        : "Showing  " +
                          (entryStart + 1) +
                          " to " +
                          entryEnd +
                          " of " +
                          getTeamAttendance.length +
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
                      {" "}
                      {handlePaging()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
