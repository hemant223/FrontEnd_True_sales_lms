import React, { useState, useEffect } from "react";
import {
  getDataAxios,
  postData,
  postDataAxios,
} from "../../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment/moment";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import Swal from "sweetalert2";
import AddTeam from "../AddTeam/AddTeam";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import swal from "sweetalert";

import { PaginationItem } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Team(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [Page, setPage] = useState(1);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getTempTableData, setTempTableData] = useState([]);
  const [TeamsData, setTeamsData] = useState([]);
  const [EditOpen, setEditOpen] = useState(false);
  const [getId, setId] = useState("");
  const [TeamHead, setTeamHead] = useState("");
  const [UsersList, setUsersList] = useState([]);
  const [CreatedAt, setCreatedAt] = useState("");
  const [getLoading, setLoading] = useState(true);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  const [TeamName, setTeamName] = useState("");
  const [TeamStatus, setTeamStatus] = useState("");
  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userName, setUserName] = useState("");

  const [isCheck, setIsCheck] = useState([]);



  const handleMultipleDelete = async () => {
    Swal.fire({
      title: "Do you want to delete this Multiple Claims Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: isCheck };
          var response = await postData("team/delete_all_all_team", body);

        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchAllTeam();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    
  };

  // const handleMultipleDelete=async()=>{
   
  //   var body = { id: isCheck };
  //   var response = await postData("team/delete_all_all_team", body);

  //   if (response.status) {
  //     swal({
  //       title: "All Data of Team Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     window.location.reload();
  //     fetchTeams();
  //   } else {
  //     swal({
  //       title: `Something went wrong.`,
  //       icon: "error",
  //       button: "ok",
  //     });
  //   }

  //  }

  // Fetch All CompanyId//
  const fetchAllCompanyId = async () => {
    var joy = await getDataAxios("company/display_all_company");
    setCompanyList(joy.data);
  };

  const fetchAllTeam = async (cid) => {
    console.log("ciddd", cid);
    var joy = await postData("team/display_all_user_name_by_company_id", {
      id: cid,
    });
    setUserList(joy.data);
  };

  useEffect(function () {
    fetchAllCompanyId();
    fetchAllTeam();
  }, []);

  // Fill Company  Name
  const fillCompanyName = () => {
    return companyList.map((item) => {
      return <option value={item.id}> {item.name}</option>;
    });
  };
  const fillUserName = () => {
    return userList.map((item) => {
      return <option value={item.id}> {item.name}</option>;
    });
  };

  // Handle Change Company //
  const handleChangeCompany = async (event) => {
    setCompName(event.target.value);
    fetchAllTeam(event.target.value);
  };
  const handleChangeUser = async (event) => {
    setUserName(event.target.value);
  };

  useEffect(() => {
    fetchTeams();
    fetchUsersRoleWise();
  }, []);

  const fetchTeams = async () => {
    try {
      let response = await getDataAxios(`team/display_all_team`);
      if (response.status) {
        setTeamsData(response.data);
        setTempTableData(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      if (
        (item.team_name &&
          item.team_name
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (item.created_at &&
          item.created_at
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setTeamsData(searchArr);
  };

  const fetchUsersRoleWise = async () => {
    try {
      let response = await getDataAxios(
        `usersR/DisplayUsersRoleWise/${CompanyId}`
      );
      if (response.status) {
        setUsersList(response.result);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      UpdateTeams();
    } else {
      UpdateTeams();
    }
    setValidated(true);
  };

  const UpdateTeams = async () => {
    try {
      var body = {
        id: getId,
        team_name: TeamName,
        team_head: userName,
        team_status: TeamStatus,
        // created_at: CreatedAt,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: compName,
      };
      let EditResponse = await postDataAxios(`team/edit_team_data`, body);
      if (EditResponse.status) {
        swal({
          title: `Update Team Data`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setId("");
          setTeamName("");
          setTeamHead("");
          setTeamStatus("");
          setCreatedAt("");
          setEditOpen(false);
          window.location.reload();
        });
        setEditOpen(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const showEditDialogBox = () => {
    return (
      <>
        <div>
          <Dialog
            open={EditOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleEditClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <div class="content">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-12">
                    <div class="card">
                      <div class="card-body" style={{ padding: "2%" }}>
                        <b>Edit Team</b>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleEditSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Team name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter team name"
                                  value={TeamName}
                                  onChange={(event) =>
                                    setTeamName(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Team name is missing!
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label> Team status</Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  value={TeamStatus}
                                  onChange={(event) =>
                                    setTeamStatus(event.target.value)
                                  }
                                  placeholder="Select team status"
                                  required
                                >
                                  <option selected value="">
                                    --Select team status--
                                  </option>
                                  <option value="working">Working</option>
                                  <option value="not working">
                                    Not working
                                  </option>
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Please enter team status
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>

                            <Row className="mb-3">
                              <Form.Label>Comapny Name</Form.Label>
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
                            </Row>

                            <Row className="mb-3">
                              <Form.Group as={Col} md="6">
                                <Form.Label>Team head</Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  value={userName}
                                  onChange={handleChangeUser}
                                  placeholder="Team head"
                                >
                                  <option selected value="">
                                    --Select Users--
                                  </option>
                                  {fillUserName()}
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Kindly select team head
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Row>
                          </div>
                          <div class="col-xl-12">
                            <div class="button-list">
                              <Button
                                variant="primary"
                                type="submit"
                                style={{
                                  background: "#4261F7",
                                  color: "#fff",
                                  borderRadius: 5,
                                  height: "38px",
                                }}
                              >
                                Update
                              </Button>

                              <Button
                                variant="secondary"
                                style={{
                                  background: "#C9C9CB",
                                  color: "#fff",
                                  borderRadius: 5,
                                  height: "38px",
                                  borderColor: "white",
                                }}
                                onClick={handleEditClose}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
        </div>
      </>
    );
  };

  const handleEditClickOpen = (row) => {
    fetchAllTeam(row.company_id);
    console.log("row in Edit click open", row);
    setEditOpen(true);
    setId(row.id);
    setTeamName(row.team_name);
    setTeamStatus(row.team_status);
    setCompName(row.company_id);
    setUserName(row.team_head);
  };
  // const handleDelete = async (id) => {
  //   console.log("row in Edit click open", id);
  //   var body = { id: id };
  //   var response = await postData("team/delete_team_data", body);

  //   if (response.status) {
  //     swal({
  //       title: "Team Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     fetchTeams();
  //   } else {
  //     swal({
  //       title: `Something went wrong.`,
  //       icon: "error",
  //       button: "ok",
  //     });
  //   }
  // };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Do you want to delete this Role Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: id };
          var response = await postData("team/delete_team_data", body);

        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchAllTeam();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setId("");
    setTeamName("");
    setTeamHead("");
    setTeamStatus("");
    setValidated(false);
    setcheckvalidate(false);
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
      entryStart + value > TeamsData.length
        ? TeamsData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (TeamsData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < TeamsData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleAddTeam = () => {
    props.handleDashComponent(
      "",
      <AddTeam handleDashComponent={props.handleDashComponent} />
    );
  };

  const handleMultiChecked = (event, cid) => {
    const { checked } = event.target;
    let id = cid;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
    
  };

  const showEmployee = (i) => {
    let id = "";
    let teamname = "";
    let teamHead = "";
    let teamStatus = "";
    let created = "";
    let updated = "";
    let companayId = "";
    try {
      id = TeamsData[i].id;
      teamname = TeamsData[i].team_name;
      teamHead = TeamsData[i].uName;
      teamStatus = TeamsData[i].team_status;
      created = moment(TeamsData[i].created_at).format("DD/MM/YYYY");
      updated = moment(TeamsData[i].updated_at).format("DD/MM/YYYY");
      companayId = TeamsData[i].cName;
    } catch (e) {
      id = "";
      teamname = "";
      created = "";
    }

    return (
      <tr>

        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={TeamsData[i].id}
            id={TeamsData[i].id}
            checked={isCheck.includes(TeamsData[i].id)}
            onChange={(event) => handleMultiChecked(event, TeamsData[i].id)}
          />
        </td>

        <td>{id}</td>
        <td> {teamname} </td>
        <td> {teamHead}</td>
        <td> {teamStatus}</td>
        <td> {created}</td>
        <td> {updated}</td>
        <td> {companayId}</td>
        <td style={{display:'flex',flexDirection:'row'}}>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleEditClickOpen(TeamsData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>

          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{
              borderRadius: 0,
              backgroundColor: "red",
              marginLeft: 10,
              borderColor: "red",
            }}
            onClick={() => handleDelete(id)}
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
      (entNumber + 1) * entriesPerPage < TeamsData.length
        ? (entNumber + 1) * entriesPerPage
        : TeamsData.length
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
    let totalPages = TeamsData.length / entriesPerPage;
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
                              <h5 class="mt-0">Team</h5>
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
                                      color: "#fff",
                                      borderRadius: 5,
                                    }}
                                    onClick={() => handleAddTeam()}
                                  >
                                    {" "}
                                    <i class="mdi mdi-plus"></i>Add Team
                                  </button>

                                  { (isCheck.length > 1 && TeamsData ) && <button
                                    onClick={() => handleMultipleDelete()}
                                    // { isCheck.length > 0 && disabled}
                                    
                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: 5,
                                      height: 34,
                                      marginLeft: 10,
                                    }}
                                  >
                                    <i class="mdi mdi-delete"></i> Delete
                                  </button>}

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
                                        ></div>
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
                                  <div>selection</div>
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
                                  <div>Team Name</div>
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
                                  <div>Team Head</div>
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
                                  <div>Team Status</div>
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
                                  <div>Create At</div>
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
                                  <div>Update At</div>
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
                                  <div>Company Name</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                              </th>

                              <th>Actions</th>
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
                                  No team yet..!
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
                          {!TeamsData.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              TeamsData.length +
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
                {showEditDialogBox()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
