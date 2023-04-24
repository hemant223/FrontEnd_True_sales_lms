import React, { useState, useEffect } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment/moment";
import { CSVLink } from "react-csv";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";

export default function ManagerBreifingReport(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getBriefingData, setBriefingData] = useState([]);
  const [getBriefingDataExcelData, setBriefingDataExcelData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [getLoading, setLoading] = useState(true);
  const [Page, setPage] = useState(1);

  useEffect(() => {
    fetchBriefingData();
    // fetchBriefingExcelData();
  }, []);

  const fetchBriefingData = async () => {
    try {
      let response = await getDataAxios(
        `briefings/managerPenalDisplayBriefing/${CompanyId}/${userData.id}`
      );
      if (response.status) {
        setBriefingData(response.response);
        setTempTableData(response.response);
        var arr = [];
        var tempData = response.response;
        tempData.map((item) => {
          delete item.posted_team;
          arr.push(item);
        });
        console.log("arr", arr);
        setBriefingDataExcelData(arr);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchBriefingExcelData = async () => {
    try {
      let response = await getDataAxios(
        `briefings/BreifingReportNewPenalDisplay/${CompanyId}`
      );
      if (response.status) {
        setBriefingDataExcelData(response.result);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      if (
        (item.Title &&
          item.Title.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.BreifingDescription &&
          item.BreifingDescription.toLowerCase().includes(
            e.target.value.toLowerCase()
          )) ||
        (item.team_name &&
          item.team_name.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setBriefingData(searchArr);
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
        `briefings/managerPenalFilterDisplayBriefing/${userCompanyId.company_id}/${userData.id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.response.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setBriefingData(response.response);
          var arr = [];
          var tempData = response.response;
          tempData.map((item) => {
            delete item.posted_team;
            arr.push(item);
          });
          setBriefingDataExcelData(arr);
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
        `briefings/managerPenalFilterDisplayBriefing/${userCompanyId.company_id}/${userData.id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.response.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setBriefingData(response.response);
          var arr = [];
          var tempData = response.response;
          tempData.map((item) => {
            delete item.posted_team;
            arr.push(item);
          });
          setBriefingDataExcelData(arr);
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
        `briefings/managerPenalFilterDisplayBriefing/${userCompanyId.company_id}/${userData.id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.response.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setBriefingData(response.response);
          var arr = [];
          var tempData = response.response;
          tempData.map((item) => {
            delete item.posted_team;
            arr.push(item);
          });
          setBriefingDataExcelData(arr);
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
      entryStart + value > getBriefingData.length
        ? getBriefingData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getBriefingData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getBriefingData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let title = "";
    let description = "";
    let teamname = "";
    let from = "";
    let to = "";
    try {
      title = getBriefingData[i].Title;
      description = getBriefingData[i].BreifingDescription;
      teamname = getBriefingData[i].team_name;
      from = moment(getBriefingData[i].date_from).format("DD/MM/YYYY HH:mm:ss");
      to = moment(getBriefingData[i].date_to).format("DD/MM/YYYY HH:mm:ss");
    } catch (e) {
      title = "";
      description = "";
      teamname = "";
      from = "";
      to = "";
    }

    return (
      <tr>
        <td> {title} </td>
        <td style={{ width: 300 }}> {description} </td>
        <td> {teamname} </td>
        <td>
          {" "}
          {from} to {to}
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getBriefingData.length
        ? (entNumber + 1) * entriesPerPage
        : getBriefingData.length
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
    let totalPages = getBriefingData.length / entriesPerPage;
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
                              <h5 class="mt-0">Briefing report</h5>
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
                                    data={getBriefingDataExcelData}
                                    filename={"Briefing Report.csv"}
                                  >
                                    <button
                                      type="button"
                                      class="btn btn-info btn-sm"
                                      style={{
                                        marginLeft: 5,
                                        borderRadius: "5px",
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
                                  <div>Title</div>
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
                                  <div>Briefing Description</div>
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
                                  <div>Posted</div>
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
                                  <div>Posting Duration</div>
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
                                No briefing data yet..!
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
                          {!getBriefingData.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getBriefingData.length +
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
                          {handlePaging().length == 0 ? (
                            <td colspan={7}>
                              <p
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                No briefings yet..!
                              </p>
                            </td>
                          ) : (
                            handlePaging()
                          )}
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
