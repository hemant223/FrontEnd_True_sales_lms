import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  ServerURL,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import { Avatar, PaginationItem } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AddCompanyData from "./AddCompanyData";
import swal from "sweetalert";
import moment from "moment/moment";
import IconButton from "@mui/material/IconButton";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

// import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DisplayCompanyData(props) {
  const [Customer, setCustomer] = useState("");
  const [getErrCustomerId, setErrCustomerId] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [Assign, setAssign] = useState("");

  //   var userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getCompanyData, setCompanyData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [CompanyId, setCompanyId] = useState("");
  const [getOpen, setOpen] = useState(false);
  const [Page, setPage] = useState(1);
  const [EditOpen, setEditOpen] = useState(false);
  const legth = 30;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [licence, setlicence] = useState("");
  const [authorisedPersonName, setAuthorisedPersonName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  //   const [createdAt,setCreatedAt] = useState('00/00/00')
  const [updatedAt, setUpdatedAt] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyPicture, setCompanyPicture] = useState({
    url: "/icon.png",
    bytes: "",
  });

  const [checked, setChecked] = useState(true);
  const [isCheck, setIsCheck] = useState([]);

  const handleMultipleDelete = async () => {
    var body = { id: isCheck };
    var response = await postDataAxios("company/delete_all_all_company", body);

    if (response.status) {
      swal({
        title: "All Data of Company Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
    //   window.location.reload();
    setEditOpen(false)
      fetchAllCompany();
    } else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }
  };

  const handleMultiChecked = (event, cid) => {
    const { checked } = event.target;
    let id = cid;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const handleCompanyPicture = (event) => {
    setCompanyPicture({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  //   useEffect(() => {
  //     fetchRolesData();
  //   }, []);

  //   const fetchRolesData = async () => {
  //     try {
  //       let response = await getDataAxios(
  //         `company/display_all_company_data/${CompanyId}`
  //       );
  //       // console.log("roles in display", response);
  //       if (response.status) {
  //         setCompanyData(response.result);
  //         setTempTableData(response.result);
  //       }
  //     } catch (error) {
  //       console.log("error in catch", error);
  //     }

  //   };

  const fetchAllCompany = async () => {
    let data = await getDataAxios("company/display_all_company_data");
    // alert(JSON.stringify(data))
    setCompanyData(data.data);
    setTempTableData(data.data);
  };
  useEffect(function () {
    fetchAllCompany();
  }, []);

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      if (
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.perm &&
          item.perm.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setCompanyData(searchArr);
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
      entryStart + value > getCompanyData.length
        ? getCompanyData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getCompanyData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getCompanyData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  /*  const handleSubmit  = async () => {
    setEditOpen(false)
    var body = { name: name,address:address,licence:licence,authorisedpersonname:authorisedPersonName,authoremail:authorEmail,updatedat:moment().format("YYYY-MM-DD HH:mm:ss"),companyphone:companyPhone, companyid: CompanyId }
    var result = await postData('company/edit_company_data', body)
    if (result.status) {
        swal({
          title: 'Company Data Added Sucessfully',
          icon: "success",
          button: "ok",
        })
        fetchAllCompany()
      } 
      else {
        swal({
          title: `Something went wrong.`,
          icon: "error",
          button: "ok",
        });
      }
    
  } */

  const handleAddCustomer = async () => {
    try {
      var err = false;

      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (!err) {
       
          var formData = new FormData();
          formData.append("name", name);
          formData.append("address", address);
          formData.append("licence", licence);
          formData.append("authorisedPersonName", authorisedPersonName);
          formData.append("authorEmail", authorEmail);
      
          formData.append("updatedat",moment().format("YYYY-MM-DD HH:mm:ss"));
          formData.append("companyPhone", companyPhone);
          formData.append("companyPicture", companyPicture.bytes);
          formData.append("companyid", CompanyId);
        
        var result = await postDataAxios("company/edit_company_data",formData, true);
        if (result.status == true) {
          swal({
            title: `Company Updated SuccesFully`,
            icon: "success",
            button: "ok",
          });
          fetchAllCompany();
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
    setEditOpen(false);
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

  const EditCompanyData = () => {
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
                        <b>Add Company</b>
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
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Name"
                                  value={name}
                                  onChange={(event) =>
                                    setName(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Name
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={address}
                                  onChange={(event) =>
                                    setAddress(event.target.value)
                                  }
                                  placeholder="Address"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Address
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom03"
                              >
                                <Form.Label>Licence</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Licence"
                                  value={licence}
                                  onChange={(event) =>
                                    setlicence(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Licence
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom04"
                              >
                                <Form.Label>Authorised Person Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={authorisedPersonName}
                                  onChange={(event) =>
                                    setAuthorisedPersonName(event.target.value)
                                  }
                                  placeholder="Authorised Person Name"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Authorised Person Name
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <Form.Label>Author Email</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Author Email"
                                  value={authorEmail}
                                  onChange={(event) =>
                                    setAuthorEmail(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Author Email
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom06"
                              >
                                <Form.Label>Company Phone</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={companyPhone}
                                  onChange={(event) =>
                                    setCompanyPhone(event.target.value)
                                  }
                                  placeholder="Company Phone"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Company Phone
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                            <input
                              style={{ display: "flex",width:200,height:35,marginLeft:12 }}
                              type="file"
                              accept="image/*"
                              id="contained-button-filepic"
                              class="form-control mb-2"
                              onChange={(event) => handleCompanyPicture(event)}
                            />
                              <Avatar
                                alt="Remy Sharp"
                                src={companyPicture.url}
                                sx={{ width: 100, height: 50 }}
                                variant="square"
                              />
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

                              {/* <button
                           onClick={handleEditClose}
                          class="btn btn-sm waves-effect waves-light"
                          style={{
                            background: "#C9C9CB",
                            color: "#fff",
                            borderRadius: 5,
                            height: "38px",
                          }}
                        >
                          Cancel
                        </button> */}
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
    console.log("companyData", data);
    setEditOpen(true);
    setName(data.name);
    setAddress(data.address);
    setlicence(data.licence);
    setAuthorisedPersonName(data.authorised_person_name);
    setAuthorEmail(data.auth_emailid);
    setCompanyPhone(data.company_phone);
    setCompanyId(data.id);
    setCompanyPicture({
      url: `${ServerURL}/images/${data.company_picture}`,
      bytes: "",
    });
  };

  const handleDelete = async (id) => {
    // console.log("row company id", id);
    var body = { id: id };
    var response = await postDataAxios("company/delete_company", body);

    if (response.status) {
      swal({
        title: "Company Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      fetchAllCompany();
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
      <AddCompanyData handleDashComponent={props.handleDashComponent} />
    );
  };

  //   const handleCheckboxChange = (id) => {};

  //   alert(checked);
  const showEmployee = (i) => {
    return (
      <tr>
        {/*  <td>
          <Checkbox
            checked={item.checked}
            onChange={() => handleCheckboxChange(getCompanyData[i].id)}
            inputProps={{ "aria-label": item.name }}
          />
        </td> */}
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getCompanyData[i].id}
            id={getCompanyData[i].id}
            checked={isCheck.includes(getCompanyData[i].id)}
            onChange={(event) =>
              handleMultiChecked(event, getCompanyData[i].id)
            }
          />
        </td>
        <td> {getCompanyData[i].id} </td>
        <td> {getCompanyData[i].name} </td>
        {/* <td style={{ width: 500 }}>{getCompanyData[i].perm}</td> */}
        {/* id, name, address, licence, authorised_person_name, auth_emailid, created_at, updated_at, company_phone, company_picture */}
        <td> {getCompanyData[i].address} </td>
        <td> {getCompanyData[i].licence} </td>
        <td> {getCompanyData[i].authorised_person_name} </td>
        <td> {getCompanyData[i].auth_emailid} </td>
        <td> {getCompanyData[i].created_at} </td>
        <td> {getCompanyData[i].updated_at} </td>
        <td> {getCompanyData[i].company_phone} </td>
        <td>
          {" "}
          <img
            src={`${ServerURL}/images/${getCompanyData[i].company_picture}`}
            alt="image"
            class="img-fluid avatar-sm rounded-circle"
          />{" "}
        </td>
        <td
          style={{
            width: 110,
            flexDirection: "row",
            display: "flex",
            textDecoration: "none",
          }}
        >
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft: 5, borderRadius: 0 }}
            onClick={() => handleEditPage(getCompanyData[i])}
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
            onClick={() => handleDelete(getCompanyData[i].id)}
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
      (entNumber + 1) * entriesPerPage < getCompanyData.length
        ? (entNumber + 1) * entriesPerPage
        : getCompanyData.length
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
    let totalPages = getCompanyData.length / entriesPerPage;
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
                            <h5 class="mt-0">Company Management</h5>
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
                                  Add Company
                                </button>
                                {isCheck.length > 1 && (
                                  <button
                                    onClick={() => handleMultipleDelete()}
                                    // { isCheck.length > 0 && disabled}

                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: 5,
                                      //   height: 34,
                                      marginLeft: 10,
                                    }}
                                  >
                                    <i class="mdi mdi-delete"></i> Delete
                                  </button>
                                )}
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
                            {/*   <th
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
                                <div>Selection</div>

                              </div>
                            </th> */}
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
                                <div>Selection</div>

                                {/* <img src="images/arrow.png" width="10" /> */}
                              </div>
                            </th>

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
                                <div>Name</div>
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
                                <div>Address</div>
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
                                <div>Licence</div>
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
                                <div>Authorised Person Name</div>
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
                                <div>auth Email id</div>
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
                                <div>Create_at</div>
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
                                <div>Update at</div>
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
                                <div>Company Phone</div>
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
                                <div>Company Picture</div>
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
                  <div
                    class="row"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <div class="col-12 col-md-6">
                      <div style={{ fontSize: 13, fontWeight: 700 }}>
                        {!getCompanyData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            getCompanyData.length +
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
      {EditCompanyData()}
    </>
  );
}
