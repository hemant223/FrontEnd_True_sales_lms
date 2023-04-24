import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import ViewUser from "../ViewUser/ViewUser";
import moment from "moment/moment";
import TaskView from "../TaskView/TaskView.";
import AddTask from "../AddTask/AddTask";

export default function TaskTable(props) {
  const [getAllTasks, setAllTasks] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    if (props.getTaskData.length != 0) {
      setAllTasks(props.getTaskData);
      setTempTableData(props.getTaskData);
      setLoading(false);
    }
  }, [props.getTaskData]);

  const handleSearch = async (e) => {
    console.log("eeeee in handle search", e);
    var searchArr = [];
    getTempTableData.map((item) => {
      // console.log("item in handle search === 189", item);
      if (
        (item.firstname &&
          item.firstname
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setAllTasks(searchArr);
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

  const getEmployee = (indOfRow) => {
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
    console.log("HIII", item);
    props.handleDashComponent(
      "",
      <TaskView item={item} handleDashComponent={props.handleDashComponent} />
    );
  };

  const handleTask = (item) => {
    // console.log("HIII", item);
    props.handleDashComponent(
      "",
      <AddTask item={item} handleDashComponent={props.handleDashComponent} />
    );
  };

  const showEmployee = (i) => {
    // console.log("getAllTasks [i]", getAllTasks[i], i);
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
      date = moment(getAllTasks[i].created_at).format("DD/MM/YYYY HH:mm:ss");
      type = getAllTasks[i].TaskType;
      // added = moment(getAllCustomer[i].created_at).format("DD/MM/YYYY HH:mm:ss")
      username = getAllTasks[i].UserName;
      teamname = getAllTasks[i].TeamName;
      taskpriority = getAllTasks[i].TaskPriority;
      created = moment(getAllTasks[i].created_at).format("DD/MM/YYYY");
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

        {/* <td>
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
        </td> */}
      </tr>
    );
  };

  const nextPage = () => {
    setEntryStart(entryEnd);
    setEntryEnd(
      entryEnd + entriesPerPage > getAllTasks.length
        ? getAllTasks.length
        : entryEnd + entriesPerPage
    );
  };

  const previousPage = () => {
    setEntryStart(
      entryStart - entriesPerPage < 0 ? 0 : entryStart - entriesPerPage
    );
    setEntryEnd(entryStart - entriesPerPage < 0 ? entriesPerPage : entryStart);
  };

  const handlePageNumber = (entryNumber, entriesPerPage) => {
    console.log(
      "entryNumber============",
      entryNumber,
      "entriesPerPage==========",
      entriesPerPage
    );
    let entNumber = entryNumber - 1;
    console.log("entNumberrr=======>>>>>>>", entNumber);

    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getAllTasks.length
        ? (entNumber + 1) * entriesPerPage
        : getAllTasks.length
    );
  };

  const handlePaging = () => {
    let totalPages = getAllTasks.length / entriesPerPage;
    let pageNumber = [];

    return (
      <Pagination
        color="primary"
        variant="outlined"
        shape="rounded"
        count={parseInt(totalPages + 1)}
        // showFirstButton
        // showLastButton
        hideNextButton={true}
        hidePrevButton={true}
        onChange={(event) =>
          handlePageNumber(event.target.innerText, entriesPerPage)
        }
        // onChange={(event) => console.log(event.target.innerText)}
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
                              {/* <div class="row"> */}
                              <h5 class="mt-0">Task</h5>
                              {/* </div> */}
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
                              <div class="row "></div>
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
                                      {/* <option value={getList.length}>{getList.length}</option> */}
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
                                onClick={() => sortTable(0)}
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
                                onClick={() => sortTable(1)}
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
                                onClick={() => sortTable(2)}
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
                                onClick={() => sortTable(3)}
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
                                onClick={() => sortTable(4)}
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
                                onClick={() => sortTable(5)}
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
                                onClick={() => sortTable(10)}
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
                                onClick={() => sortTable(6)}
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

                              <th style={{ width: 86 }}></th>
                            </tr>
                          </thead>

                          <tbody style={{ fontSize: 13 }}>
                            {getEmployee()}
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
                          <ul class="pagination">
                            <li class="page-item">
                              <a
                                class="page-link"
                                href={() => false}
                                onClick={() => previousPage()}
                                aria-label="Previous"
                              >
                                <span aria-hidden="true">
                                  {entryStart === 0 ||
                                  getAllTasks.length < entriesPerPage ? (
                                    <div style={{ color: "#8395a7" }}>
                                      Previous
                                    </div>
                                  ) : (
                                    // <div>
                                    <a
                                      href={() => false}
                                      onClick={() => previousPage()}
                                      // className="pagination-previous"
                                      // style={{
                                      //   position: "absolute",
                                      //   top: 20,
                                      //   left: "20%",
                                      //   cursor: "pointer",
                                      // }}
                                    >
                                      Previous
                                    </a>
                                    // </div>
                                  )}
                                </span>
                              </a>
                            </li>
                            {handlePaging()}

                            <li class="page-item">
                              <a
                                class="page-link"
                                href={() => false}
                                onClick={() => nextPage()}
                                aria-label="Next"
                              >
                                <span aria-hidden="true">
                                  {getAllTasks.length === entryEnd ||
                                  getAllTasks.length < entriesPerPage ? (
                                    "Next"
                                  ) : (
                                    <a
                                      href={() => false}
                                      onClick={() => nextPage()}
                                    >
                                      Next
                                    </a>
                                  )}
                                </span>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="pagination is-rounded is-small"
                      role="navigation"
                      aria-label="pagination"
                    >
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* <div>{handlePaging()} </div> */}
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
