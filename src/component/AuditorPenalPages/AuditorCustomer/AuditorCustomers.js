import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAndImage,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment/moment";
import { CSVLink } from "react-csv";
import swal from "sweetalert";
import { PaginationItem } from "@mui/material";
import AuditorCustomerDetail from "./AuditorCustomerDetails/AuditorCustomerDetail";

export default function AuditorCustomers(props) {
  var UserData = JSON.parse(localStorage.getItem("user"));
  const [getAllManagerCustomer, setAllManagerCustomer] = useState([]);
  const [getManagerCustomerExcel, setManagerCustomerExcel] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getCustomerExcel, setCustomerExcel] = useState("");
  const [UploadExcel, setUploadExcel] = useState(false);
  const [getLoading, setLoading] = useState(true);
  const [Page, setPage] = useState(1);
  const [FilterTeam, setFilterTeam] = useState([]);

  useEffect(() => {
    fetchAllCustomer();
    fetchTeams();
    // fetchAllCustomerExcelDownload();
  }, []);

  const fetchAllCustomer = async () => {
    try {
      var result = await getDataAxios(
        `customers/displayAll/${UserData.company_id}`
      );
      // console.log("Ccccccccccccccuuuuuusstttooommmeeerrrr", result.data);
      if (result.status == true) {
        setAllManagerCustomer(result.Data[0]);
        setTempTableData(result.Data[0]);
        setManagerCustomerExcel(result.Excel[0]);
        setLoading(false);
      } else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        }).then(() => {
          setAllManagerCustomer([]);
          setTempTableData([]);
          setManagerCustomerExcel([]);
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchTeams = async () => {
    try {
      let response = await getDataAxios(
        `team/teamsDisplay/${UserData.company_id}`
      );
      // console.log("ddddddddddddddddddddddddddddddddddddd", response);
      if (response.status == true) {
        setFilterTeam(response.data);
      } else {
        swal({
          title: `Something went wrong in fetchTeams`,
          icon: "error",
          button: "ok",
        }).then(() => {
          setFilterTeam([]);
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleTeamFilter = async (team_id) => {
    try {
      var arr = [];
      let response = await getDataAxios(
        `customers/AuditorTeamFilter/${UserData.company_id}/${team_id}`
      );
      // console.log("gggggggggggggggggggggggg", response);
      if (response.status == true) {
        var tempResult = response.data;
        swal({
          title: `${response.data.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllManagerCustomer(response.data);
          setTempTableData(response.data);
          tempResult.map((item) => {
            delete item.name;
            delete item.phone;
            delete item.address;
            delete item.type;
            delete item.status;
            delete item.note;
            delete item.updated_at;
            delete item.company_id;
            delete item.team_id;
            delete item.user;
            delete item.firmname;
            delete item.priority;
            delete item.pincode;
            delete item.outcome;
            delete item.createdBy;
            delete item.CustomerName;
            delete item.customer_mobile;
            delete item.ManagerName;
            delete item.CreatedName;
            item["LastActivity"] = moment(item.created_at).format(
              "DD/MM/YYYY HH:mm:ss"
            );
            item["Added on"] = moment(item.created_at).format("DD/MM/YYYY");
            arr.push(item);
          });
          setManagerCustomerExcel(arr);
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

  const fetchAllCustomerExcelDownload = async () => {
    try {
      var result = await getDataAxios(
        `customers/AllMangerCustomersExcelDownload/${UserData.company_id}/${UserData.id}`
      );
      // console.log("Result of Customer Display---57 line-->", result.data);
      if (result.status) {
        setManagerCustomerExcel(result.data);
        setLoading(false);
      }
    } catch (error) {
      swal("something went wrong");
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
        (item.lastname &&
          item.lastname.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.mobile &&
          item.mobile.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setAllManagerCustomer(searchArr);
  };

  const handleExcelSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("customerExcel", getCustomerExcel);
      const config = { headers: { "content-type": "multipart/form-data" } };
      var result = await postDataAndImage(
        "customers/UploadExcel",
        formData,
        config
      );
      if (result != null) {
        if (result.status == true) {
          setUploadExcel(false);
          setLoading(false);
          swal({
            title: `Excel sheet Upload Successfully`,
            icon: "success",
            button: "ok",
          });
        } else {
          swal({
            title: `Something went wrong`,
            icon: "error",
            button: "ok",
          });
        }
      } else {
        swal({
          title: `Please check the format of excel sheet`,
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
      let userCompanyId = JSON.parse(localStorage.getItem("user"));
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD hh:mm");
      const currentOfMonth = moment().format("YYYY-MM-DD hh:mm");
      let body = {
        startDate: startOfMonth,
        endDate: currentOfMonth,
      };
      let response = await postDataAxios(
        `customers/customerFilter/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllManagerCustomer(response.resultt[0]);
          setManagerCustomerExcel(response.ExcelData[0]);
          setTempTableData(response.resultt[0]);
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
        `customers/customerFilter/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllManagerCustomer(response.resultt[0]);
          setManagerCustomerExcel(response.ExcelData[0]);
          setTempTableData(response.resultt[0]);
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
        `customers/customerFilter/${userCompanyId.company_id}`,
        body
      );
      if (response.status == true) {
        swal({
          title: `${response.resultt[0].length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllManagerCustomer(response.resultt[0]);
          setManagerCustomerExcel(response.ExcelData[0]);
          setTempTableData(response.resultt[0]);
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

  const fetchAllTeamCustomer = async () => {
    try {
      var result = await getDataAxios(
        `customers/displayAll/${UserData.company_id}`
      );
      if (result.status == true) {
        swal({
          title: `${result.data.length} Record found.`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setAllManagerCustomer(result.data);
          setManagerCustomerExcel(result.data);
          setTempTableData(result.data);
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

  const handleClose = () => {
    setCustomerExcel("");
    setUploadExcel(false);
  };

  const handleExcel = (e) => {
    setUploadExcel(true);
    setCustomerExcel(e.target.files[0]);
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
      entryStart + value > getAllManagerCustomer.length
        ? getAllManagerCustomer.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getAllManagerCustomer.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getAllManagerCustomer.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleViewPage = (item) => {
    props.handleDashComponent(
      "",
      <AuditorCustomerDetail {...props} customerDetail={item} />
    );
  };

  const showEmployee = (i) => {
    let id = "";
    let firstname = "";
    let lastname = "";
    let mobile = "";
    let email = "";
    let date = "";
    let added = "";
    let username = "";
    let teamname = "";
    let Reference = "";

    try {
      id = getAllManagerCustomer[i].id;
      firstname = getAllManagerCustomer[i].firstname;
      lastname = getAllManagerCustomer[i].lastname;
      mobile = getAllManagerCustomer[i].mobile;
      email = getAllManagerCustomer[i].email;
      date =
        getAllManagerCustomer[i].created_at != null
          ? moment(getAllManagerCustomer[i].created_at).format("DD/MM/YYYY")
          : null;
      added = moment(getAllManagerCustomer[i].created_at).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      username = getAllManagerCustomer[i].UserName;
      teamname = getAllManagerCustomer[i].TeamName;
      Reference =
        getAllManagerCustomer[i].refrence_from == null
          ? "Call"
          : getAllManagerCustomer[i].refrence_from;
    } catch (e) {
      id = "";
      firstname = "";
      lastname = "";
      mobile = "";
      email = "";
      date = "";
      added = "";
      username = "";
      teamname = "";
      Reference = "";
    }

    return (
      <tr>
        <td>{id}</td>
        <td>{firstname}</td>
        <td> {lastname} </td>
        <td> {mobile}</td>
        <td>{email}</td>
        <td>{Reference}</td>
        <td>{date}</td>
        <td> {added}</td>
        <td> {username}</td>
        <td> {teamname}</td>
        <td
          style={{
            display: "inline-block",
            width: "max-content",
            height: "65px",
            border: "none",
          }}
        >
          <button
            type="button"
            class="btn btn-primary btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleViewPage(getAllManagerCustomer[i])}
          >
            <i class="mdi mdi-eye"></i>
          </button>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < getAllManagerCustomer.length
        ? (entNumber + 1) * entriesPerPage
        : getAllManagerCustomer.length
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
    let totalPages = getAllManagerCustomer.length / entriesPerPage;
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
                          <div class="col-4 col-md-8 form-label">
                            <div class="grid-cont1ainer">
                              <h5 class="mt-0">Customers</h5>
                            </div>
                          </div>
                          <div
                            class="col-8 col-md-4"
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
                                            Import Customers
                                          </h4>

                                          <CSVLink
                                            data={getManagerCustomerExcel}
                                            filename={
                                              "Auditor_Customer_List.csv"
                                            }
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
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
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
                                            style={{ width: "22%" }}
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                            onClick={() => handleClose()}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </div>
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
                                  <div
                                    className="modal fade"
                                    id="scrollable-modal"
                                    tabIndex={-1}
                                    aria-labelledby="scrollableModalTitle"
                                    aria-hidden="true"
                                    style={{ display: "none" }}
                                  >
                                    <div
                                      className="modal-dialog modal-dialog-scrollable modal-sm"
                                      role="document"
                                    >
                                      <div className="modal-content">
                                        <div className="modal-body">
                                          {FilterTeam.map((e) => {
                                            return (
                                              <div>
                                                <div
                                                  onClick={() =>
                                                    handleTeamFilter(e.id)
                                                  }
                                                  data-bs-dismiss="modal"
                                                >
                                                  <div
                                                    style={{
                                                      border: "1px solid black",
                                                      margin: 8,
                                                      textAlign: "center",
                                                      fontSize: 10,
                                                      borderRadius: 10,
                                                      cursor: "pointer",
                                                      height: 20,
                                                      backgroundColor: "grey",
                                                      color: "white",
                                                    }}
                                                  >
                                                    {e.team_name}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
                                      {/* item*/}
                                      <div
                                        href="javascript:void(0);"
                                        className="dropdown-item"
                                        onClick={() => fetchAllTeamCustomer()}
                                      >
                                        All Teams
                                      </div>

                                      <div
                                        href="javascript:void(0);"
                                        className="dropdown-item"
                                        data-bs-toggle="modal"
                                        data-bs-target="#scrollable-modal"
                                      >
                                        Teams
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
                                  <div>Email</div>
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
                                  <div>Reference</div>
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
                                  <div>Added on</div>
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
                                  <div>Last Activity</div>
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
                                  <div>Team</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>

                              <th>Actions</th>
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
                          {!getAllManagerCustomer.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getAllManagerCustomer.length +
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
                                No customers yet..!
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
