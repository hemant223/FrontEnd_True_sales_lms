import React, { useState, useEffect } from "react";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import { CSVLink } from "react-csv";
import { postDataAxios } from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import ManagerTaskDetail from "../ManagerTaskDetail/ManagerTaskDetail";
import { PaginationItem } from "@mui/material";

export default function TeamTodaysTask(props) {
  // console.log("props in TeamTodaysTask", props);

  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(5);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [getTodaysTasks, setTodaysTasks] = useState([]);
  const [getTempTodaysTasks, setTempTodaysTasks] = useState([]);
  const [Page, setPage] = useState(1);

  useEffect(() => {
    fetchTeamTodayTask();
  }, []);

  const fetchTeamTodayTask = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      let body = {
        todayDate: moment().format("YYYY-MM-DD"),
      };
      let TodayTaskResult = await postDataAxios(
        `task/managerPenalTeamViewTodatTask/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      // console.log("TodayTaskResult", TodayTaskResult);
      setTodaysTasks(TodayTaskResult.result);
      setTempTodaysTasks(TodayTaskResult.result);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleLast3MonthFilter = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("user"));
      const startDateofLast3Months = moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD hh:mm");
      const endDateofLast3Months = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startDateofLast3Months,
        endDate: endDateofLast3Months,
        todayDate: moment().format("YYYY-MM-DD"),
      };
      let response = await postDataAxios(
        `task/managerPenalFilterTeamViewTodatTask/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.result.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTodaysTasks(response.result);
          setTempTodaysTasks(response.result);
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
        .format("YYYY-MM-DD hh:mm");
      const endDateofLastMonth = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startDateofLastMonth,
        endDate: endDateofLastMonth,
        todayDate: moment().format("YYYY-MM-DD"),
      };
      let response = await postDataAxios(
        `task/managerPenalFilterTeamViewTodatTask/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.result.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTodaysTasks(response.result);
          setTempTodaysTasks(response.result);
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
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD hh:mm");
      const currentOfMonth = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
        todayDate: moment().format("YYYY-MM-DD"),
      };
      let response = await postDataAxios(
        `task/managerPenalFilterTeamViewTodatTask/${userData.company_id}/${userData.id}/${props.item.id}`,
        body
      );
      if (response.status) {
        swal({
          title: `${response.result.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTodaysTasks(response.result);
          setTempTodaysTasks(response.result);
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
    getTempTodaysTasks.map((item) => {
      if (
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setTodaysTasks(searchArr);
  };

  const handleViewPage = (item) => {
    props.handleDashComponent(
      "",
      <ManagerTaskDetail
        taskDetail={item}
        handleDashComponent={props.handleDashComponent}
        {...props}
      />
    );
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
      entryStart + value > getTodaysTasks.length
        ? getTodaysTasks.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getTodaysTasks.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getTodaysTasks.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let Id = "";
    let customerName = "";
    let mobile = "";
    let user = "";
    let taskDate = "";
    let taskType = "";
    let priority = "";
    let addedDate = "";
    try {
      Id = getTodaysTasks[i].id;
      customerName = getTodaysTasks[i].CustomerName;
      mobile = getTodaysTasks[i].CustomerMobile;
      user = getTodaysTasks[i].UserName;
      taskDate = moment(getTodaysTasks[i].TaskDate).format("DD/MM/YYYY");
      taskType = getTodaysTasks[i].TaskType;
      priority = getTodaysTasks[i].TaskPriority;
      addedDate =
        getTodaysTasks[i].task_added_date != null
          ? moment(getTodaysTasks[i].task_added_date).format("DD/MM/YYYY")
          : "00/00/0000";
    } catch (e) {
      Id = "";
      customerName = "";
      mobile = "";
      user = "";
      taskDate = "";
      taskType = "";
      priority = "";
      addedDate = "";
    }
    return (
      <tr>
        <td>{Id}</td>
        <td> {customerName} </td>
        <td> {mobile} </td>
        <td> {user} </td>
        <td> {taskDate} </td>
        <td> {taskType}</td>
        <td>
          {priority === "High Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#F90E0E",
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {priority}
            </span>
          ) : priority === "Low Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#1241DE",
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {priority}
            </span>
          ) : priority === "Medium Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#2B921B",
                padding: 7,
                fontSize: 11,
                fontWeight: 400,
              }}
            >
              {priority}
            </span>
          ) : (
            <div style={{ color: "white", fontWeight: 600 }}>{priority} </div>
          )}
        </td>
        <td> {addedDate} </td>
        <td>
          <span
            style={{
              backgroundColor: "#2B921B",
              padding: 7,
              fontSize: 11,
              fontWeight: 400,
              cursor: "pointer",
            }}
            class="badge"
            onClick={() => handleViewPage(getTodaysTasks[i])}
          >
            <i class="mdi mdi-eye"></i>View
          </span>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    console.log("entNumberrr=======>>>>>>>", entNumber);

    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getTodaysTasks.length
        ? (entNumber + 1) * entriesPerPage
        : getTodaysTasks.length
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
    let totalPages = getTodaysTasks.length / entriesPerPage;
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
                          <h5 class="mt-0">Todays Task</h5>
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
                                data={getTodaysTasks}
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
                              <div> ID. </div>
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
                              <div>Customer</div>
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
                              {" "}
                              <div>Mobile number</div>{" "}
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
                              <div>Executive</div>
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
                              }}
                            >
                              {" "}
                              <div>Task Date & Time</div>{" "}
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
                              }}
                            >
                              {" "}
                              <div>Task Type</div>{" "}
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
                              }}
                            >
                              {" "}
                              <div>Priority</div>{" "}
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
                              }}
                            >
                              {" "}
                              <div>Added on</div>{" "}
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
                            No task today yet..!
                          </p>
                        ) : (
                          getEmployee()
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div
                class="row"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div class="col-12 col-md-6">
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    {!getTodaysTasks.length
                      ? "[Nothing to show]"
                      : "Showing  " +
                        (entryStart + 1) +
                        " to " +
                        entryEnd +
                        " of " +
                        getTodaysTasks.length +
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
    </>
  );
}
