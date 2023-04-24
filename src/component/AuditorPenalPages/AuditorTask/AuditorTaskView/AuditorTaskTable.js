import React, { useEffect, useState } from "react";
import {
  postDataAxios,
  ServerURL,
  getDataAxios,
} from "../../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";

export default function AuditorTaskTable(props) {
  // console.log("Task Table props get item....", props);
  const [TaskTableData, setTaskTableData] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getTempTaskViewData, setTempTaskViewData] = useState([]);

  useEffect(() => {
    fetchTaskViewTableData();
  }, [props]);

  const fetchTaskViewTableData = async () => {
    try {
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      var result = await getDataAxios(
        `task/newPenalTaskViewDisplay/${props.getTaskId}/${userCompanyId.company_id}`
      );
      // console.log("Result of Task View Display", result.data);
      if (result.status == true) {
        setTaskTableData(result.result);
        setTempTaskViewData(result.result);
      } else {
        swal({
          title: "Error in Data fetch",
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
    getTempTaskViewData.map((item) => {
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
    setTaskTableData(searchArr);
  };

  const handleFilter = async () => {
    try {
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD hh:mm");
      const currentOfMonth = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let response = await postDataAxios(
        `task/newPenalTaskViewFilter/${props.getTaskId}/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.result.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskTableData(response.result);
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
        `task/newPenalTaskViewFilter/${props.getTaskId}/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.result.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskTableData(response.result);
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
        `task/newPenalTaskViewFilter/${props.getTaskId}/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.result.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setTaskTableData(response.result);
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

  document.addEventListener(
    "play",
    function (e) {
      var audios = document.getElementsByTagName("audio");
      for (var i = 0, len = audios.length; i < len; i++) {
        if (audios[i] != e.target) {
          audios[i].pause();
        }
      }
    },
    true
  );

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
      entryStart + value > TaskTableData.length
        ? TaskTableData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (TaskTableData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < TaskTableData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let id = "";
    let tasktype = "";
    let username = "";
    let created = "";
    let Duration = "";
    let note = "";
    let rec = "";
    let callstatus = "";
    let dispo = "";

    try {
      id = TaskTableData[i].id;
      tasktype = TaskTableData[i].call_type;
      username = TaskTableData[i].UserName;
      created = moment(TaskTableData[i].created_at).format(
        "DD/MM/YYYY hh:mm a"
      );
      Duration = moment
        .utc(TaskTableData[i].duration * 1000)
        .format("HH:mm:ss");
      note = TaskTableData[i].user_note;
      rec = TaskTableData[i].recording_url;
      callstatus = TaskTableData[i].call_status;
      dispo = TaskTableData[i].disposition;
    } catch (e) {
      id = "";
      tasktype = "";
      username = "";
      created = "";
      Duration = "";
      note = "";
      rec = "";
      callstatus = "";
      dispo = "";
    }
    return (
      <tr style={{ alignItems: "center" }}>
        <td>{id}</td>
        <td>{tasktype}</td>
        <td> {username} </td>
        <td> {created}</td>
        <td>{Duration}</td>
        <td> {note} </td>
        <td>
          {
            <audio
              // autoPlay
              key={id}
              src={`${ServerURL}/images/${rec}`}
              controls={true}
              style={{ height: "20px", width: "220px" }}
            />
          }
        </td>
        <td>
          {callstatus === "Connected" ? (
            <div style={{ color: "#E33899", fontWeight: 600 }}>
              {callstatus}{" "}
            </div>
          ) : callstatus === "Not Connected" ? (
            <div style={{ color: "#EF7829", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : callstatus === "Missed" ? (
            <div style={{ color: "#E80505", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : callstatus === "Answered" ? (
            <div style={{ color: "#447CEC", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : callstatus === "whatsapp" ? (
            <div style={{ color: "#10C469", fontWeight: 600 }}>
              {callstatus}
            </div>
          ) : (
            <div style={{ color: "#FFB523", fontWeight: 600 }}>
              {callstatus}{" "}
            </div>
          )}
        </td>
        <td style={{ color: "#38ada9", fontWeight: 600 }}>{dispo}</td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < TaskTableData.length
        ? (entNumber + 1) * entriesPerPage
        : TaskTableData.length
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
    let totalPages = TaskTableData.length / entriesPerPage;
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
      <div class="container-fluid" style={{ padding: 0 }}>
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <h5 class="mt-0 mb-3">Activites</h5>
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
                          <div style={{ fontSize: 13, fontWeight: 500 }}>
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
                <div class="row">
                  <div class="col-12">
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
                                <div>Call Type</div>
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
                                <div>Executive</div>
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
                                  width: "140px",
                                }}
                              >
                                <div>Call Date & time</div>
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
                                <div>Duration</div>
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
                                <div>Note</div>
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
                                <div>Play Audio</div>
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
                                <div>Status</div>
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
                                <div>Disposition</div>
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
                                No task's calls yet..!
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
                        {!TaskTableData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            TaskTableData.length +
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
    </>
  );
}
