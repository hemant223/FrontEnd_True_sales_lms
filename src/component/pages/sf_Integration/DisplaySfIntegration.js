import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  getData,
  postData,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
// import AddRole from "../AddRole/AddRole";
// import EditRole from "../EditRole/EditRole";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import { PaginationItem } from "@mui/material";

// import AddCompanyData from "./AddCompanyData";
import swal from "sweetalert";
import moment from "moment/moment";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

// import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddSfIntregrationData from "./AddSfIntregrationData";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DisplaySfIntegration(props) {
  //   var userData = JSON.parse(localStorage.getItem("user"));
  const [Customer, setCustomer] = useState("");
  const [getErrCustomerId, setErrCustomerId] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [Assign, setAssign] = useState("");

  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getTempTableData, setTempTableData] = useState([]);

  const [getOpen, setOpen] = useState(false);
  const [Page, setPage] = useState(1);
  const [EditOpen, setEditOpen] = useState(false);
  const legth = 30;

  const [sfIintData, setSfIintData] = useState([]);

  const [tokenUrl, setTokenUrl] = useState("");
  const [mainUrl, setMainUrl] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [apiName, setApiName] = useState("");
  const [id, setId] = useState("");

  const fetchAll_Sf_Intregration_data = async () => {
    let data = await getData("sf_integration/display_all_sf_integration_data");
    // alert(JSON.stringify(data))
    setSfIintData(data.data);
    setTempTableData(data.data);
  };
  useEffect(function () {
    fetchAll_Sf_Intregration_data();
  }, []);

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      if (id && id.toLowerCase().includes(e.target.value.toLowerCase())) {
        searchArr.push(item);
      }
    });
    setSfIintData(searchArr);
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
      entryStart + value > sfIintData.length
        ? sfIintData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (sfIintData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < sfIintData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleEditClose = () => {
    setEditOpen(false);
    // setId("");
    // setTaskType("");
    // setcheckvalidate(false);
    // setValidated(false);
  };

  const handleAddCustomer = async () => {
    try {
      var err = false;

      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (!err) {
        setEditOpen(false);
        var body = {
          tokenUrl: tokenUrl,
          mainUrl: mainUrl,
          companyId: companyId,
          apiName: apiName,
          id: id,
        };
        var result = await postData(
          "sf_integration/edit_sf_integrationy_data",
          body
        );
        if (result.status == true) {
          swal({
            title: `Sf Integration Updated SuccesFully`,
            icon: "success",
            button: "ok",
          });
          fetchAll_Sf_Intregration_data();
        } else {
          swal({
            title: `Something went wrong`,
            icon: "info",
            button: "ok",
          });
        }
      } else {
        swal({
          title: "Please select customer",
          icon: "warning",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleAddCustomer();
    } else {
      handleAddCustomer();
    }
    setValidated(true);
  };

  const EditDisplaySfIntregrationData = () => {
    return (
      <div>
        <Dialog
          open={EditOpen}
          onClose={handleEditClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <div class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-body" style={{ padding: "2%" }}>
                        <b>Add Sf Intregration</b>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Token Url</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Token Url"
                                  value={tokenUrl}
                                  onChange={(event) =>
                                    setTokenUrl(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Token Url
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Main Url</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={mainUrl}
                                  onChange={(event) =>
                                    setMainUrl(event.target.value)
                                  }
                                  placeholder="Main Url"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Main Url
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom03"
                              >
                                <Form.Label>Company Id</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="End Time"
                                  value={companyId}
                                  onChange={(event) =>
                                    setCompanyId(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Company Id
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom04"
                              >
                                <Form.Label>Api name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={apiName}
                                  onChange={(event) =>
                                    setApiName(event.target.value)
                                  }
                                  placeholder="Api name"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  In Api name
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                          </div>
                          <div class="col-xl-6">
                            <div class="button-list">
                              <button
                                type="submit"
                                class="btn btn-sm waves-effect waves-light"
                                style={{
                                  background: "#4261F7",
                                  color: "#fff",
                                  borderRadius: 5,
                                  height: "38px",
                                }}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const handleEditPage = (data) => {
    console.log("breakDataaa==", data);
    setEditOpen(true);
    setTokenUrl(data.token_url);
    setMainUrl(data.main_url);
    setCompanyId(data.companyid);
    setApiName(data.api_name);
    setId(data.id);
  };

  const handleDelete = async (id) => {
    // console.log("row company id", id);
    var body = { id: id };
    var response = await postData("sf_integration/delete_sf_integration", body);

    if (response.status) {
      swal({
        title: "Sf integration Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      fetchAll_Sf_Intregration_data();
    } else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }
  };

  const handleAddCompany = () => {
    props.handleDashComponent(
      "",
      <AddSfIntregrationData handleDashComponent={props.handleDashComponent} />
    );
  };

  const showEmployee = (i) => {
    var maxLength = 17;
    var token_url =
      sfIintData[i].token_url.substring(0, maxLength) + "...";
    var main_url =
      sfIintData[i].main_url.substring(0, maxLength) + "...";
    return (
      <tr>
        <td> {sfIintData[i].id} </td>
        <td> {token_url} </td>
        <td> {main_url} </td>
        <td> {sfIintData[i].companyid} </td>
        <td> {sfIintData[i].api_name} </td>

        <td
          style={{
            flexDirection: "row",
            display: "flex",
            textDecoration: "none",
          }}
        >
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleEditPage(sfIintData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{
              borderRadius: 0,
              backgroundColor: "red",
              borderColor: "red",
              marginLeft: 10,
            }}
            onClick={() => handleDelete(sfIintData[i].id)}
          >
            <i class="mdi mdi-delete"></i>
          </button>
        </td>
      </tr>
    );
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < sfIintData.length
        ? (entNumber + 1) * entriesPerPage
        : sfIintData.length
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
    let totalPages = sfIintData.length / entriesPerPage;
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
                            <h5 class="mt-0">Sf Intregration Management</h5>
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
                                  class="btn btn-sm"
                                  style={{
                                    background: "#4261F7",
                                    border: "1px solid #4261F7",
                                    color: "#fff",
                                    borderRadius: 5,
                                  }}
                                  onClick={() => handleAddCompany()}
                                >
                                  {" "}
                                  <i class="mdi mdi-plus"></i>
                                  Add Sf Intregration
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
                      <table id="productTable" className="table table-hover">
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
                                <div>Token Url</div>
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
                                <div>Main Url</div>
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
                                <div>Company Id</div>
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
                                <div>Api Name</div>
                                <img src="images/arrow.png" width="10" />
                              </div>
                            </th>

                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: 13 }}>{getEmployee()}</tbody>
                      </table>
                    </div>
                  </div>
                  <div class="row" style={{ display: "flex" }}>
                    <div class="col-12 col-md-6">
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {!sfIintData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            sfIintData.length +
                            " entries"}
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
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
      {EditDisplaySfIntregrationData()}
    </>
  );
}
