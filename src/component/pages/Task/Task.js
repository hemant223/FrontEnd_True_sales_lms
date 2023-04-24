import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAxios,
  postDataAndImage,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import { CSVLink } from "react-csv";
import TaskView from "../TaskView/TaskView.";
import AddTask from "../AddTask/AddTask";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";

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

export default function Task(props) {
  var UserData = JSON.parse(localStorage.getItem("user"));
  const [getAllTasks, setAllTasks] = useState([]);
  const [getAllTasksExcelDownload, setAllTasksExcelDownload] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [Page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [UploadExcel, setUploadExcel] = useState(false);
  const [getTaskExcel, setTaskExcel] = useState("");
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllTask();
    // fetchAllTaskExcelDownload();
  }, [props]);

  const fetchAllTask = async () => {
    try {
      var result = await getDataAxios(
        `task/newPenalDisplay/${UserData.company_id}`
      );
      // console.log("Result of Task Display", result.data);
      if (result.status) {
        setAllTasks(result.Data[0]);
        setTempTableData(result.Data[0]);
        setAllTasksExcelDownload(result.Excel[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchAllTaskExcelDownload = async () => {
    var result = await getDataAxios(
      `task/newPenalDisplayExcelDownload/${UserData.company_id}`
    );
    // console.log("Result of Task Display", result.data);
    if (result.status) {
      setAllTasksExcelDownload(result.data);
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
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
        (item.lastname &&
          item.lastname.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });

    setAllTasks(searchArr);
  };

  const handleExcelSubmit = async () => {
    try {
      setLoading(true);
      var temp = getTaskExcel.name.split(".")[1];
      if (excelFormat.includes(temp)) {
        const formData = new FormData();
        formData.append("taskExcel", getTaskExcel);
        const config = { headers: { "content-type": "multipart/form-data" } };
        var result = await postDataAndImage(
          "task/UploadExcel",
          formData,
          config
        );
        if (result.status == true) {
          handleClose();
          setUploadExcel(false);
          setLoading(false);
          swal({
            title: `Excel sheet Upload Successfully`,
            icon: "success",
            button: "ok",
          }).then(() => {
            window.location.reload();
          });
        } else {
          swal({
            title: `Something went wrong`,
            icon: "error",
            button: "ok",
          }).then(() => {
            window.location.reload();
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
          window.location.reload();
          setLoading(false);
          setUploadExcel(false);
        });
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
        `task/filtersInTask/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllTasks(response.resultt[0]);
          setAllTasksExcelDownload(response.ExcelData[0]);
          setTempTableData(response.resultt[0]);
          setLoading(false);
        });
      } else {
        setLoading(false);
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
        `task/filtersInTask/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllTasks(response.resultt[0]);
          setAllTasksExcelDownload(response.ExcelData[0]);
          setTempTableData(response.resultt[0]);
          setLoading(false);
        });
      } else {
        setLoading(false);
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
        `task/filtersInTask/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllTasks(response.resultt[0]);
          setAllTasksExcelDownload(response.ExcelData[0]);
          setTempTableData(response.resultt[0]);
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

  const handleExcel = (e) => {
    setUploadExcel(true);
    setTaskExcel(e.target.files[0]);
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
      entryStart + value > getAllTasks.length
        ? getAllTasks.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getAllTasks.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getAllTasks.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleViewPage = (item) => {
    props.handleDashComponent(
      "",
      <TaskView
        taskDetail={item}
        handleDashComponent={props.handleDashComponent}
      />
    );
  };

  const handleTask = (item) => {
    props.handleDashComponent(
      "",
      <AddTask item={item} handleDashComponent={props.handleDashComponent} />
    );
  };

  const showEmployee = (i) => {
    let id = "";
    let firstname = "";
    let lastname = "";
    let mobile = "";
    let date = "";
    let type = "";
    let username = "";
    let teamname = "";
    let taskpriority = "";
    let created = "";
    let status = "";

    try {
      id = getAllTasks[i].id;
      firstname = getAllTasks[i].firstname;
      lastname = getAllTasks[i].lastname;
      mobile = getAllTasks[i].mobile;
      date = moment(getAllTasks[i].created_at).format("DD/MM/YYYY HH:mm a");
      type = getAllTasks[i].TaskType;
      username = getAllTasks[i].UserName;
      teamname = getAllTasks[i].TeamName;
      taskpriority = getAllTasks[i].TaskPriority;
      created = moment(getAllTasks[i].task_added_date).format("DD/MM/YYYY");
      status = getAllTasks[i].TaskStatus;
    } catch (e) {
      id = "";
      firstname = "";
      lastname = "";
      mobile = "";
      date = "";
      type = "";
      username = "";
      teamname = "";
      taskpriority = "";
      created = "";
      status = "";
    }

    return (
      <tr style={{ textAlign: "center" }}>
        <td> {id} </td>
        <td> {firstname} </td>
        <td> {lastname} </td>
        <td> {mobile}</td>
        <td>{date}</td>
        <td> {username} </td>
        <td>{type}</td>
        <td> {teamname}</td>
        <td>
          {taskpriority === "High Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#F90E0E",
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {taskpriority}
            </span>
          ) : taskpriority === "Low Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#1241DE",
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {taskpriority}
            </span>
          ) : taskpriority === "Medium Priority" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#2B921B",
                padding: 7,
                fontSize: 11,
                fontWeight: 400,
              }}
            >
              {taskpriority}
            </span>
          ) : (
            <div style={{ color: "white", fontWeight: 600 }}>
              {taskpriority}{" "}
            </div>
          )}
        </td>

        <td>{created}</td>
        <td>
          {status === "Planned" ? (
            <span
              class="badge bg-success"
              style={{
                backgroundColor: "#2ecc71",
                color: "#FFF",
                fontSize: "10.8px",
              }}
            >
              {status}
            </span>
          ) : status === "Delayed" ? (
            <span
              class="badge"
              style={{
                backgroundColor: "#2980b9",
                color: "#FFF",
                fontSize: "10.8px",
              }}
            >
              {status}
            </span>
          ) : status === "Completed" ? (
            <span
              className="badge "
              style={{
                backgroundColor: "#7f8c8d",
                color: "#FFF",
                fontSize: "10px",
              }}
            >
              {status}
            </span>
          ) : (
            <div style={{ color: "white", fontWeight: 600 }}>{status} </div>
          )}
        </td>

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
            onClick={() => handleViewPage(getAllTasks[i])}
          >
            <i class="mdi mdi-eye"></i>View
          </span>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getAllTasks.length
        ? (entNumber + 1) * entriesPerPage
        : getAllTasks.length
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
    let totalPages = getAllTasks.length / entriesPerPage;
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

  const handleClose = () => {
    setTaskExcel("");
    setUploadExcel(false);
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
                              <h5 class="mt-0">Tasks</h5>
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
                                  <button
                                    type="button"
                                    class="btn btn-primary btn-sm"
                                    style={{
                                      background: "#4261F7",
                                      border: "1px solid #4261F7",
                                      color: "#fff",
                                      borderRadius: 5,
                                      maeginRight: 5,
                                    }}
                                    onClick={() => handleTask()}
                                  >
                                    <i class="mdi mdi-plus"></i>Add Task
                                  </button>
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
                                            Import Task
                                          </h4>

                                          <CSVLink
                                            data={getAllTasksExcelDownload}
                                            filename={"Task List.csv"}
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
                                              id="example-fileinput"
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
                                      {/* /.modal-content */}
                                    </div>
                                    {/* /.modal-dialog */}
                                  </div>

                                  <button
                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{ marginLeft: 5, borderRadius: 5 }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#centermodal"
                                  >
                                    <i class="mdi mdi-download"></i>
                                    Import
                                  </button>
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
                                    </div>
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
                        <table
                          id="productTable"
                          className="table table-hover"
                          style={{ width: "100%" }}
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
                                  <div>First Name</div>
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
                                  <div>Last Name</div>
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
                                  <div>Mobile number</div>{" "}
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
                                  <div>Assigned Executive</div>
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
                                  <div>Task Type</div>
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
                                  <div>Team</div>
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
                                  <div>Priority</div>
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
                                  }}
                                >
                                  <div>Added on</div>
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
                                  }}
                                >
                                  <div>Status</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>

                              <th style={{ width: 86 }}></th>
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
                          {!getAllTasks.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getAllTasks.length +
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
