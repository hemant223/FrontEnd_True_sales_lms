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
const config = require("../../../services/company.json");

export default function CallsReport(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getCallsReport, setCallsReport] = useState([]);
  const [getCallsReportExcelData, setCallsReportExcelData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [getFilterCSR, setFilterCSR] = useState([]);
  const [getLoading, setLoading] = useState(true);

  useEffect(() => {
    // fetchCallsReport();
    fetchCallsReportExcelData();
    fetchSalesExecutive();
  }, []);

  const fetchCallsReport = async () => {
    let response = await getDataAxios(`calls/newPenalDisplay/${CompanyId}`);
    if (response.status) {
      setCallsReport(response.data);
      setTempTableData(response.data);
      setLoading(false);
    }
  };

  const fetchCallsReportExcelData = async () => {
    try {
      let response = await getDataAxios(
        `calls/CallsReportDataNewPenalDisplay/${CompanyId}`
      );
      console.log("response in call report", response);
      if (response.status) {
        var arr = [];
        var tempResult = response.data;
        if (CompanyId == config.prepLadder) {
          setLoading(false);
          setCallsReportExcelData(response.data);
          setCallsReport(response.data);
          setTempTableData(response.data);
        } else {
          tempResult.map((item) => {
            delete item.case_number;
            delete item.CustomerMobile;
            arr.push(item);
          });
          setLoading(false);
          setCallsReportExcelData(arr);
          setCallsReport(arr);
          setTempTableData(arr);
        }
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchSalesExecutive = async () => {
    let Role = JSON.parse(localStorage.getItem("Roles"));
    let csrId = "";
    try {
      Role.filter((item) => {
        if (item.name == "Sales Executive") {
          return (csrId = item.id);
        }
      });
      let CSRResponse = await getDataAxios(
        `usersR/AllCSRFetch/${csrId}/${CompanyId}`
      );
      if (CSRResponse.status == true) {
        setFilterCSR(CSRResponse.result);
      } else {
        setFilterCSR([]);
      }
    } catch (e) {
      console.log("fetchSalesExecutive in catch", e);
    }
  };

  const handleFilterCSR = async (Uid) => {
    setLoading(true);
    try {
      let CsrFilterResponse = await getDataAxios(
        `calls/FilterSalesExecutive/${CompanyId}/${Uid}`
      );
      if (CsrFilterResponse.status == true) {
        swal({
          title: `${CsrFilterResponse.AllData[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCallsReport(CsrFilterResponse.AllData[0]);
          setTempTableData(CsrFilterResponse.AllData[0]);
          setCallsReportExcelData(CsrFilterResponse.ExcelData[0]);
          setLoading(false);
        });
      } else {
        setCallsReport("");
        setTempTableData("");
        setLoading(false);
      }
    } catch (e) {
      console.log("handleFilterCSR error in catch", e);
    }
  };

  const handleSearch = async (e) => {
    try {
      var searchArr = [];
      getTempTableData.map((item) => {
        var id = `${item.id}`;
        if (
          (item.call_type &&
            item.call_type
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (item.CustomerName &&
            item.CustomerName.toLowerCase().includes(
              e.target.value.toLowerCase()
            )) ||
          (item.call_status &&
            item.call_status
              .toLowerCase()
              .includes(e.target.value.toLowerCase())) ||
          (item.CustomerMobile &&
            item.CustomerMobile.toLowerCase().includes(
              e.target.value.toLowerCase()
            )) ||
          (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
        ) {
          searchArr.push(item);
        }
      });
      setCallsReport(searchArr);
    } catch (e) {
      console.log("error in handle search", e);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const currentOfMonth = moment().format("YYYY-MM-DD");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let response = await postDataAxios(
        `calls/newPenalFilterInCalls/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.CallData[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCallsReport(response.CallData[0]);
          setCallsReportExcelData(response.data[0]);
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
        `calls/newPenalFilterInCalls/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.CallData[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCallsReport(response.CallData[0]);
          setCallsReportExcelData(response.data[0]);
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
        .format("YYYY-MM-DD");
      const endDateofLast3Months = moment().format("YYYY-MM-DD");
      let body = {
        startDate: startDateofLast3Months,
        endDate: endDateofLast3Months,
      };
      let response = await postDataAxios(
        `calls/newPenalFilterInCalls/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.CallData[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCallsReport(response.CallData[0]);
          setCallsReportExcelData(response.data[0]);
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
      entryStart + value > getCallsReport.length
        ? getCallsReport.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getCallsReport.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getCallsReport.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    let CallUniqueId = "";
    let call_type = "";
    let username = "";
    let customer = "";
    let created = "";
    let duration = "";
    let usernote = "";
    let disposition = "";
    let callStatus = "";
    let call_case_number = "";
    let customerNumber = "";
    let unknownNumber = "";
    try {
      CallUniqueId = getCallsReport[i].id;
      call_type = getCallsReport[i].call_type;
      username = getCallsReport[i].Executive;
      customer = getCallsReport[i].CustomerName;
      created =
        CompanyId == config.prepLadder
          ? moment(getCallsReport[i].CallDateTime).format(
              "DD/MM/YYYY hh:mm:ss a"
            )
          : moment(getCallsReport[i].CallDateTime).format("DD/MM/YYYY hh:mm a");
      duration =
        moment.utc(getCallsReport[i].Duration * 1000).format("HH:mm:ss") ===
        "Invalid date"
          ? getCallsReport[i].Duration
          : moment.utc(getCallsReport[i].Duration * 1000).format("HH:mm:ss");
      usernote = getCallsReport[i].Notes;
      callStatus = getCallsReport[i].Status;
      disposition = getCallsReport[i].Disposition;
      unknownNumber = getCallsReport[i].unknown_number;
      call_case_number =
        getCallsReport[i].case_number == "undefined" || null || undefined
          ? "-"
          : getCallsReport[i].case_number;
      customerNumber = getCallsReport[i].CustomerMobile;
    } catch (e) {
      CallUniqueId = "";
      call_type = "";
      username = "";
      customer = "";
      created = "";
      duration = "";
      usernote = "";
      disposition = "";
      callStatus = "";
      call_case_number = "";
      customerNumber = "";
      unknownNumber = "";
    }

    return (
      <tr>
        <td> {CallUniqueId} </td>
        <td> {call_type} </td>
        <td> {username}</td>
        <td> {customer} </td>
        <td> {created} </td>
        <td> {duration}</td>
        <td> {usernote} </td>
        <td> {callStatus} </td>
        <td> {disposition} </td>
        <td> {unknownNumber} </td>
        {CompanyId == config.prepLadder ? <td> {call_case_number}</td> : null}
        {CompanyId == config.prepLadder ? <td> {customerNumber} </td> : null}
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getCallsReport.length
        ? (entNumber + 1) * entriesPerPage
        : getCallsReport.length
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
    let totalPages = getCallsReport.length / entriesPerPage;
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
                              <h5 class="mt-0">Call Report</h5>
                            </div>
                          </div>

                          <div
                            className="modal fade"
                            id="scrollable-modal"
                            tabIndex={-1}
                            aria-labelledby="scrollableModalTitle"
                            aria-hidden="true"
                            style={{ display: "none" }}
                          >
                            <div
                              className="modal-dialog modal-dialog-scrollable modal-lg"
                              role="document"
                            >
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5
                                    className="modal-title"
                                    id="scrollable-modal"
                                  >
                                    Sales Executive
                                  </h5>
                                </div>
                                <div
                                  className="modal-body"
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "space-between",
                                    padding: 10,
                                  }}
                                >
                                  {getFilterCSR.map((item, key) => {
                                    console.log("getFilterCSR", getFilterCSR);
                                    return (
                                      <div
                                        onClick={() => handleFilterCSR(item.id)}
                                        data-bs-dismiss="modal"
                                      >
                                        <div
                                          className="btn btn-default border"
                                          style={{
                                            margin: 10,
                                            width: 170,
                                            borderRadius: 10,
                                          }}
                                        >
                                          {item.name}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    data-bs-dismiss="modal"
                                    class="btn btn-info btn-sm"
                                    style={{ marginLeft: 12 }}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
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
                                      {CompanyId == config.prepLadder ? (
                                        <div
                                          href="javascript:void(0);"
                                          className="dropdown-item"
                                          data-bs-toggle="modal"
                                          data-bs-target="#scrollable-modal"
                                        >
                                          Sales executive
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                  <CSVLink
                                    data={getCallsReportExcelData}
                                    filename={"Calls Report.csv"}
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
                                    width: "130px",
                                  }}
                                >
                                  <div>Call uniqueId</div>
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
                                    width: "130px",
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
                                    width: "130px",
                                  }}
                                >
                                  <div>Customer name</div>
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
                                    width: "150px",
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
                                onClick={() => sortTable(6)}
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
                                onClick={() => sortTable(7)}
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
                                  <div>Unknown number</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>
                              {CompanyId == config.prepLadder ? (
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
                                    <div>Case number</div>
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                              ) : null}

                              {CompanyId == config.prepLadder ? (
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
                                      width: "150px",
                                    }}
                                  >
                                    <div>Customer number</div>
                                    <img src="images/arrow.png" width="10" />
                                  </div>
                                </th>
                              ) : null}
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
                                  No calls report yet..!
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
                          {!getCallsReport.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getCallsReport.length +
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
