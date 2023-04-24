import React, { useEffect, useState } from "react";
import { getDataAxios, ServerURL } from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import ViewUser from "../ViewUser/ViewUser";
import moment from "moment/moment";
import EditUser from "../EditUser/EditUser";
import AddUser from "../AddUser/AddUser";

export default function UserTable(props) {
  console.log("props in userTable", props);
  const [getAllUsers, setAllUsers] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getTempTableData, setTempTableData] = useState([]);
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    if (props.getUserData.length != 0) {
      setAllUsers(props.getUserData);
      setTempTableData(props.getUserData);
      setLoading(false);
    }
  }, [props.getUserData]);

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      console.log("item TempTableData", item);
      if (
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setAllUsers(searchArr);
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

  const getEmployee = (indOfRow) => {
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
    console.log("HIII", item);
    console.log("HIIIIIIIIIIIIIIIIIIIII", props);
    props.props.handleDashComponent(
      "",
      <ViewUser
        item={item}
        handleDashComponent={props.handleDashComponent}
        props={props}
      />
    );
  };

  const handleEditPage = (item) => {
    props.handleDashComponent(
      "",
      <EditUser item={item} handleDashComponent={props.handleDashComponent} />
    );
  };

  const handleAddUser = () => {
    props.handleDashComponent(
      "",
      <AddUser handleDashComponent={props.handleDashComponent} />
    );
  };

  const showEmployee = (i) => {
    // console.log("Data [i]", data[i], i);
    return (
      <tr>
        <td> {getAllUsers[i].id} </td>
        <td width="100">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <span class="m-1">{getAllUsers[i].name}</span>{" "}
          </div>
        </td>
        <td> {getAllUsers[i].RoleName} </td>
        {/* <td> {displayDate(date3)} </td> */}

        <td> {getAllUsers[i].TeamName}</td>
        <td> {getAllUsers[i].email} </td>
        <td> {getAllUsers[i].mobile} </td>
        <td> {moment(getAllUsers[i].created_at).format("DD/MM/YYYY")}</td>
        <td>
          {getAllUsers[i].status == "Active" ? (
            <div style={{ fontWeight: 600, color: "lightgreen" }}>
              {" "}
              {getAllUsers[i].status}{" "}
            </div>
          ) : (
            <div style={{ fontWeight: 600, color: "red" }}>
              {" "}
              {getAllUsers[i].status}{" "}
            </div>
          )}
        </td>
        
      </tr>
    );
  };

  const nextPage = () => {
    setEntryStart(entryEnd);
    setEntryEnd(
      entryEnd + entriesPerPage > getAllUsers.length
        ? getAllUsers.length
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
      (entNumber + 1) * entriesPerPage < getAllUsers.length
        ? (entNumber + 1) * entriesPerPage
        : getAllUsers.length
    );
  };

  const handlePaging = () => {
    let totalPages = getAllUsers.length / entriesPerPage;

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
                              <h5 class="mt-0">Users list</h5>
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
                              <div class="row ">
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {/* <h5 class="mt-0">Inline edit</h5> */}
                                  {/* <button
                                    type="button"
                                    class="btn btn-primary btn-sm"
                                    style={{
                                      background: "#4261F7",
                                      border: "1px solid #4261F7",
                                      color: "#fff",
                                      borderRadius: 5,
                                    }}
                                    onClick={() => handleAddUser()}
                                  >
                                    <i class="mdi mdi-plus"></i>Add User
                                  </button> */}
                                  {/* <button
                                      type="button"
                                      class="btn btn-info btn-sm"
                                      style={{ marginLeft: 5, borderRadius: 5 }}
                                      onClick={() => handleClick()}
                                    >
                                      <i class="mdi mdi-download"></i>
                                      Import
                                    </button> */}
                                  {/* <h5 class="mt-0">Inline edit</h5> */}
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
                                      {/* <option value={getList.length}>{getList.length}</option> */}
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
                                  paddingRight: 5,
                                }}
                              ></div>
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
                          // style={{ width: "100%" }}
                        >
                          <thead className="table">
                            <tr>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "7%",
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
                                  {/* <div> */}
                                  <img src="images/arrow.png" width="10" />
                                  {/* </div> */}
                                </div>
                              </th>
                              <th
                                style={{
                                  cursor: "pointer",
                                  padding: 0,
                                  width: "10%",
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
                                  padding: 0,
                                  width: "9%",
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
                                  padding: 0,
                                  width: "20%",
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
                                // onClick={() => sortTable(5)}
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
                                onClick={() => sortTable(6)}
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
                                onClick={() => sortTable(7)}
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
                              {/* <th style={{ width: "12%" }}>Actions</th> */}
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
                                  getAllUsers.length < entriesPerPage ? (
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
                                  {getAllUsers.length === entryEnd ||
                                  getAllUsers.length < entriesPerPage ? (
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
