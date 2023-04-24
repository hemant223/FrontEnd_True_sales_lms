import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import { CSVLink } from "react-csv";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";
import AuditorTaskDetail from "../AuditorTask/AuditorTaskView/AuditorTaskView";

export default function AuditorTaskView(props) {
  // console.log("props in TaskView", props);
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [UserId, setUserId] = useState(props.getData.id);
  const [CompanyId, setCompany] = useState(props.getData.company_id);
  const [getTaskData, setTaskData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [getTaskDownloadData, setTaskDownloadData] = useState([]);
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserTask();
    // fetchUserTaskDownload();
  }, []);

  const fetchUserTaskDownload = async () => {
    let response = await getDataAxios(
      `template/userTaskDownload/${UserId}/${CompanyId}`
    );
    // console.log(
    //   "response user task get task data in user task download",
    //   response
    // );
    if (response.status == true) {
      setTaskDownloadData(response.data);
      setLoading(false);
    }
  };

  const fetchUserTask = async () => {
    try {
      let response = await getDataAxios(`task/display/${UserId}/${CompanyId}`);
      // console.log("response user task get task data", response);
      if (response.status == true) {
        setTaskData(response.Data[0]);
        setTempTableData(response.Data[0]);
        setTaskDownloadData(response.Excel[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSearch = (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      if (
        (item.firstname &&
          item.firstname
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.TaskPriority &&
          item.TaskPriority.toLowerCase().includes(
            e.target.value.toLowerCase()
          ))
      ) {
        searchArr.push(item);
      }
    });
    setTaskData(searchArr);
  };

  const handleFilter = async () => {
    try {
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD hh:mm");
      const currentOfMonth = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let AttendanceFilterResponse = await postDataAxios(
        `task/FilterDisplay/${UserId}/${CompanyId}`,
        body
      );
      if (AttendanceFilterResponse.status == true) {
        swal({
          title: `${AttendanceFilterResponse.resultData[0].length} record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskData(AttendanceFilterResponse.resultData[0]);
          setTempTableData(AttendanceFilterResponse.resultData[0]);
          setTaskDownloadData(AttendanceFilterResponse.excelData[0]);
        });
      } else {
        swal({
          title: `Somewthing went wrong.`,
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
      let AttendanceFilterResponse = await postDataAxios(
        `task/FilterDisplay/${UserId}/${CompanyId}`,
        body
      );
      if (AttendanceFilterResponse.status == true) {
        swal({
          title: `${AttendanceFilterResponse.resultData[0].length} record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskData(AttendanceFilterResponse.resultData[0]);
          setTempTableData(AttendanceFilterResponse.resultData[0]);
          setTaskDownloadData(AttendanceFilterResponse.excelData[0]);
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

  const handleLast3MonthFilter = async () => {
    try {
      const startDateofLast3Months = moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD hh:mm");
      const endDateofLast3Months = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startDateofLast3Months,
        endDate: endDateofLast3Months,
      };
      let AttendanceFilterResponse = await postDataAxios(
        `task/FilterDisplay/${UserId}/${CompanyId}`,
        body
      );
      if (AttendanceFilterResponse.status == true) {
        swal({
          title: `${AttendanceFilterResponse.resultData[0].length} record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskData(AttendanceFilterResponse.resultData[0]);
          setTempTableData(AttendanceFilterResponse.resultData[0]);
          setTaskDownloadData(AttendanceFilterResponse.excelData[0]);
        });
      } else {
        swal({
          title: `Somewthing went wrong.`,
          icon: "error",
          button: "ok",
        });
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
      entryStart + value > getTaskData.length
        ? getTaskData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getTaskData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getTaskData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleViewPage = (item) => {
    props.handleDashComponent(
      "",
      <AuditorTaskDetail {...props} taskDetail={{ ...item }} />
    );
  };

  const showEmployee = (i) => {
    let id = "";
    let firstname = "";
    let lastname = "";
    let mobile = "";
    let created_at = "";
    let tasktype = "";
    let taskpriority = "";
    let task_added_date = "";
    try {
      id = getTaskData[i].id;
      firstname = getTaskData[i].firstname;
      lastname = getTaskData[i].lastname;
      mobile = getTaskData[i].mobile;
      created_at = moment(getTaskData[i].created_at).format(
        "DD/MM/YYYY HH:mm a"
      );
      tasktype = getTaskData[i].TaskType;
      taskpriority = getTaskData[i].TaskPriority;
      task_added_date = moment(getTaskData[i].task_added_date).format(
        "DD/MM/YYYY HH:mm a"
      );
    } catch (e) {
      id = "";
      firstname = "";
      lastname = "";
      mobile = "";
      created_at = "";
      tasktype = "";
      taskpriority = "";
      task_added_date = "";
    }

    return (
      <tr>
        <td> {id} </td>
        <td> {firstname} </td>
        <td> {lastname} </td>
        <td> {mobile}</td>
        <td> {created_at}</td>
        <td> {tasktype} </td>
        <td>
          {" "}
          {taskpriority == "High Priority" ? (
            <span
              class="badge bg-danger"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              {taskpriority}
            </span>
          ) : taskpriority == "Medium Priority" ? (
            <span
              class="badge bg-success"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              {" "}
              {taskpriority}
            </span>
          ) : (
            <span
              class="badge bg-primary"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              {" "}
              {taskpriority}
            </span>
          )}{" "}
        </td>
        <td>{task_added_date}</td>
        <td style={{ cursor: "pointer" }}>
          <span
            class="badge bg-success"
            style={{
              padding: 7,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
            }}
            onClick={() => handleViewPage(getTaskData[i])}
          >
            <i class="mdi mdi-eye"></i> View
          </span>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getTaskData.length
        ? (entNumber + 1) * entriesPerPage
        : getTaskData.length
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
    let totalPages = getTaskData.length / entriesPerPage;
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
        <div class="container-fluid" style={{ padding: 0 }}>
          <div class="row">
            <div style={{ justifyContent: "space-between", display: "flex" }}>
              <h5 class="mt-0">Tasks list</h5>
              <div
                class="mb-2"
                style={{
                  display: "flex",
                  width: "20%",
                  justifyContent: "flex-end",
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
            <div class="col-md-12">
              <div class="card border border-default">
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
                                        <div class="input-group input-group-merge">
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
                                    data={getTaskDownloadData}
                                    filename={`${props.getData.name}'s task list.csv`}
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
                                    <div>First name</div>
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
                                    <div>Last name</div>
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
                                    <div>Mobile number</div>
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
                                    <div>Task Date & Time</div>
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
                                    <div>Task Type</div>
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
                                    <div>Priority</div>
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
                                    <div>Added on</div>
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
                                    No task yet..!
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
                            {!getTaskData.length
                              ? "[Nothing to show]"
                              : "Showing  " +
                                (entryStart + 1) +
                                " to " +
                                entryEnd +
                                " of " +
                                getTaskData.length +
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
