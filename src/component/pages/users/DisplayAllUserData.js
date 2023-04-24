import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  ServerURL,
  postDataAxios,
  postData,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import { Avatar, PaginationItem } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
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
import AddUserData from "./AddAllUserData";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DisplayAllUserData(props) {
  const [Customer, setCustomer] = useState("");
  const [getErrCustomerId, setErrCustomerId] = useState("");
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [Assign, setAssign] = useState("");

  //   var userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getUserData, setUserData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [Page, setPage] = useState(1);
  const [EditOpen, setEditOpen] = useState(false);
  const legth = 30;
  const [isCheck, setIsCheck] = useState([]);

  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getMobile, setMobile] = useState("");
  const [getEmail, setEmail] = useState("");
  const [TeamId, setTeamId] = useState("");
  const [teamData, setTeamData] = useState([]);
  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [getStatus, setStatus] = useState("");
  const [getJoiningDate, setJoiningDate] = useState(null);
  const [roleId, setRoleId] = useState();
  const [userId, setUserId] = useState("");
  const [roles, setRoles] = useState([]);
  const [getImage, setImage] = useState({ url: "/icon.png", bytes: "" });
  const handleEditPage = (data) => {
    // console.log("companyData", data);
    setEditOpen(true);
    setFirstName(data.firstname);
    setLastName(data.lastname);
    setMobile(data.mobile);
    setEmail(data.email);
    setTeamId(data.team_id);
    setCompName(data.company_id);
    setStatus(data.status);
    setJoiningDate(data.date_of_joining);
    setRoleId(data.role_id);
    setUserId(data.id);
    fetchAllRoles(data.company_id);
    fetchAllTeams(data.company_id);
    setImage({
      url: `${ServerURL}/images/${data.user_picture}`,
      bytes: "",
    });
  };
  const handleUserPicture = (event) => {
    setImage({
      url: URL.createObjectURL(event.target.files[0]),
      bytes: event.target.files[0],
    });
  };

  const fetchAllCompanyId = async () => {
    var joy = await getDataAxios("company/display_all_company");
    setCompanyList(joy.data);
  };
  useEffect(function () {
    fetchAllCompanyId();
  }, []);

  // Fill Company  Name
  const fillCompanyName = () => {
    return companyList.map((item) => {
      return <option value={item.id}> {item.name}</option>;
    });
  };

  // Handle Change Company //
  const handleChangeCompany = async (event) => {
    setCompName(event.target.value);
    fetchAllRoles(event.target.value);
    fetchAllTeams(event.target.value);
  };

  const fetchAllRoles = async (cid) => {
    var body = { comId: cid };
    var res = await postData(`usersR/display_all_roles`, body);
    setRoles(res.data);
  };
  const fetchAllTeams = async (cid) => {
    var body = { id: cid };
    var res = await postData(`usersR/display_all_team`, body);
    setTeamData(res.data);
  };
  useEffect(function () {
    fetchAllRoles();
    fetchAllTeams();
  }, []);

  const fillRoles = () => {
    return roles.map(function (item, key) {
      return <option value={item.id}>{item.name}</option>;
    });
  };
  const fillTeams = () => {
    return teamData.map(function (item, key) {
      // alert(JSON.stringify(item))
      return <option value={item.id}>{item.team_name}</option>;
    });
  };

  const handleMultipleDelete = async () => {
    var body = { id: isCheck };
    var response = await postDataAxios("usersR/delete_all_user", body);

    if (response.status) {
      swal({
        title: "All Data of User Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      //   window.location.reload();
      setEditOpen(false);
      fetchAllUsers();
    } else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }
  };

  const fetchAllUsers = async () => {
    let data = await getDataAxios("usersR/display_all_user_data");
    // alert(JSON.stringify(data))
    setUserData(data.data);
    setTempTableData(data.data);
  };
  useEffect(function () {
    fetchAllUsers();
  }, []);

  const handleMultiChecked = (event, cid) => {
    const { checked } = event.target;
    let id = cid;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

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
    setUserData(searchArr);
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
      entryStart + value > getUserData.length
        ? getUserData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getUserData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getUserData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleAddCustomer = async () => {
    try {
      var err = false;

      var a = Assign.toString().trim();
      var teamid = a.split(" ")[1];
      var userid = a.split(" ")[0];
      if (!err) {
        var formData = new FormData();
        formData.append("firstname", getFirstName);
        formData.append("lastname", getLastName);
        formData.append("user_picture", getImage.bytes);
        formData.append("mobile", getMobile);
        formData.append("email", getEmail);
        formData.append("team_id", TeamId);
        formData.append("company_id", compName);
        formData.append("status", getStatus);
        formData.append(
          "date_of_joining",
          moment(getJoiningDate).format("YYYY-MM-DD HH:mm:ss")
        );
        formData.append("role_id", roleId);
        formData.append("userId", userId);
        formData.append("update_At", moment().format("YYYY-MM-DD HH:mm:ss"));
        var result = await postData("usersR/edit_user_data", formData, true);
        if (result.status == true) {
          swal({
            title: `User Updated SuccesFully`,
            icon: "success",
            button: "ok",
          });
          fetchAllUsers();
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

  const EditUserData = () => {
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
                        <b>Add User</b>
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
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="First Name"
                                  value={getFirstName}
                                  onChange={(event) =>
                                    setFirstName(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter First Name
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={getLastName}
                                  onChange={(event) =>
                                    setLastName(event.target.value)
                                  }
                                  placeholder="Last Name"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Last Name
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom03"
                              >
                                <Form.Label>Mobile Number</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Mobile Number"
                                  value={getMobile}
                                  onChange={(event) =>
                                    setMobile(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Mobile Number
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom04"
                              >
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={getEmail}
                                  onChange={(event) =>
                                    setEmail(event.target.value)
                                  }
                                  placeholder="Email"
                                  required
                                ></Form.Control>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Email
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <Form.Label>Company</Form.Label>

                                <Form.Select
                                  aria-label="Default select example"
                                  value={compName}
                                  onChange={handleChangeCompany}
                                  placeholder="Select Company Name"
                                  required
                                >
                                  <option selected value="">
                                    Select Company Name
                                  </option>
                                  {fillCompanyName()}
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Comapny
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <Form.Label>Team</Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  value={TeamId}
                                  onChange={(event) =>
                                    setTeamId(event.target.value)
                                  }
                                >
                                  <option disabled value="">
                                    -- Select Team --
                                  </option>
                                  {fillTeams()}
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Team
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Status"
                                  value={getStatus}
                                  onChange={(event) =>
                                    setStatus(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter Status
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom05"
                              >
                                <Form.Label>Joining Date</Form.Label>
                                <Form.Control
                                  required
                                  type="datetime-local"
                                  placeholder="Date"
                                  value={getJoiningDate}
                                  onChange={(event) => {
                                    setJoiningDate(event.target.value);
                                  }}
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Please pick a valid date
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom07"
                              >
                                <Form.Label>Role ID</Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  value={roleId}
                                  onChange={(event) =>
                                    setRoleId(event.target.value)
                                  }
                                  placeholder="Role"
                                  required
                                >
                                  <option selected value="">
                                    --Select Role--
                                  </option>
                                  {fillRoles()}
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Select Role
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <input
                                style={{
                                  display: "flex",
                                  width: 200,
                                  height: 35,
                                  marginLeft: 12,
                                }}
                                type="file"
                                accept="image/*"
                                id="contained-button-filepic"
                                class="form-control mb-2"
                                onChange={(event) => handleUserPicture(event)}
                              />
                              <Avatar
                                alt="Remy Sharp"
                                src={getImage.url}
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

  const handleDelete = async (id) => {
    // console.log("row company id", id);
    var body = { id: id };
    var response = await postDataAxios("usersR/delete_user", body);

    if (response.status) {
      swal({
        title: "User Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      fetchAllUsers();
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
      <AddUserData handleDashComponent={props.handleDashComponent} />
    );
  };

  //   const handleCheckboxChange = (id) => {};

  //   alert(checked);
  const showEmployee = (i) => {
    return (
      <tr>
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getUserData[i].id}
            id={getUserData[i].id}
            checked={isCheck.includes(getUserData[i].id)}
            onChange={(event) => handleMultiChecked(event, getUserData[i].id)}
          />
        </td>
        <td> {getUserData[i].id} </td>
        <td> {getUserData[i].name} </td>
        {/* <td style={{ width: 500 }}>{getUserData[i].perm}</td> */}
        {/* id, name, address, licence, authorised_person_name, auth_emailid, created_at, updated_at, company_phone, company_picture */}
        <td> {getUserData[i].mobile} </td>
        <td> {getUserData[i].email} </td>
        <td> {getUserData[i].TeamName} </td>
        <td> {getUserData[i].created_at} </td>
        <td> {getUserData[i].updated_at} </td>
        <td> {getUserData[i].Cname} </td>

        <td> {getUserData[i].status} </td>
        <td> {getUserData[i].date_of_joining} </td>
        <td> {getUserData[i].RoleName} </td>
        <td> {getUserData[i].firstname} </td>
        <td> {getUserData[i].lastname} </td>
        <td>
          {" "}
          <img
            src={`${ServerURL}/images/${getUserData[i].user_picture}`}
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
            onClick={() => handleEditPage(getUserData[i])}
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
            onClick={() => handleDelete(getUserData[i].id)}
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
      (entNumber + 1) * entriesPerPage < getUserData.length
        ? (entNumber + 1) * entriesPerPage
        : getUserData.length
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
    let totalPages = getUserData.length / entriesPerPage;
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
                            <h5 class="mt-0">User Management</h5>
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
                                  Add User
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
                                <div>Mobile Number</div>
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
                                <div>Email</div>
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
                                <div>Team</div>
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
                                <div>Create At</div>
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
                                <div>Update At</div>
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
                                <div>Company</div>
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
                                <div>Status</div>
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
                                <div>Dtate of Joining</div>
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
                                <div>Role</div>
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
                              onClick={() => sortTable(1)}
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
                              onClick={() => sortTable(1)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div>Picture</div>
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
                        {!getUserData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            getUserData.length +
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
      {EditUserData()}
    </>
  );
}
