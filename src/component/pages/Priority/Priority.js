import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import AddPriority from "../Priority/AddPriority";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import Form from "react-bootstrap/Form";
import { Row } from "react-bootstrap";
import { PaginationItem } from "@mui/material";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { json } from "react-router-dom";
import swal from "sweetalert";
import moment from "moment";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Company(props) {
  var userData = JSON.parse(localStorage.getItem("user"));

  const [priority, setPriority] = useState([]);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [Page, setPage] = useState(1);
  const [name, setName] = useState();
  const [company_id, setCompanyId] = useState();
  const [editOpen, setEditOpen] = useState("");
  const [validated, setValidated] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [id, setId] = useState();
  const [getTempTableData, setTempTableData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [companyName, setCompanyName] = useState();



  const [isCheck, setIsCheck] = useState([]);


  const handleMultipleDelete=async()=>{
   
    var body = { id: isCheck };
    var response = await postDataAxios("priority/delete_all_all_priority", body);

    if (response.status) {
      swal({
        title: "All Data of Priority Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      // window.location.reload();
      setEditOpen(false)
      fetchPriority();
    } else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }

   }



  // const [CompanyId,setCompanyIde]=useState()
  const fetchPriority = async () => {
    let joy = await getDataAxios(`priority/priorityDisplay`);
    // alert(JSON.stringify(joy));
    setPriority(joy.result);
    setTempTableData(joy.result);
  };
  useEffect(function () {
    fetchPriority();
  }, []);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleUpdate();
    } else {
      handleUpdate();
    }
    setValidated(true);
  };

  const handleUpdate = async () => {
    try {
      var body = {
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        name: name,
        company_id: company_id,
        id: id,
      };
      let EditResponse = await postDataAxios(
        "priority/edit_priority_data",
        body
      );
      // alert(JSON.stringify(body))
      if (EditResponse.result) {
        swal({
          title: `Priority Updated Successfully`,
          icon: "success",
          button: "ok",
        });
        // window.location.reload();
        setEditOpen(false)
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

 


        // Fetch All CompanyId//
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
    setCompanyId(event.target.value);
  };









  const showEditDialogBox = () => {
    return (
      <>
        <div>
          <Dialog
            open={editOpen}
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
                        <b>Edit Priority</b>
                        <Form
                          noValidate
                          validated={validated}
                          onSubmit={handleEditSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-3">
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter Name"
                                  value={name}
                                  onChange={(event) =>
                                    setName(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Name is missing
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >


                                <Form.Label>Comapny Name</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={company_id}
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
                                  Comapny ID is missing
                                </Form.Control.Feedback>
                              </Form.Group>

                              <div class="w-100"></div>
                            </Row>
                          </div>
                          <div class="col-xl-6">
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
  const handleEditPage = (row) => {
    console.log("rowww", row.name);
    setEditOpen(true);
    setName(row.name);
    setCompanyId(row.company_id);
    setId(row.id);
   
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setName("");

    setCompanyId("");
  };

  const handleSearch = async (e) => {
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      //  alert(JSON.stringify(item.role_id))
      if (
        id &&
        id.toLowerCase().includes(e.target.value.toLowerCase())
        // (item.perm &&
        //   item.perm.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setPriority(searchArr);
  };
  const handleDelete = async (id) => {
    var body = { id: id };
    // alert(id)
    var result = await postDataAxios("priority/delete", body);

    if (result.status) {
      swal({
        title: `Priority Delete Successfully`,
        icon: "success",
        button: "ok",
      });
      fetchPriority();
    } else {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
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

  const showEmployee = (i) => {
    return (
      <tr>
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={priority[i].id}
            id={priority[i].id}
            checked={isCheck.includes(priority[i].id)}
            onChange={(event) => handleMultiChecked(event, priority[i].id)}
          />
        </td>
        <td> {priority[i].id} </td>
        <td> {priority[i].name} </td>
        <td> {priority[i].cname} </td>
        <td>{priority[i].created_at}</td>
        <td>{priority[i].updated_at}</td>

        <td>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft: 5, borderRadius: 0 }}
            onClick={() => handleEditPage(priority[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-xs"
            style={{
              marginLeft: 10,
              borderRadius: 0,
              backgroundColor: "red",
              color: "#fff",
              borderColor: "red",
            }}
            onClick={() => handleDelete(priority[i].id)}
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
      (entNumber + 1) * entriesPerPage < priority.length
        ? (entNumber + 1) * entriesPerPage
        : priority.length
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
    let totalPages = priority.length / entriesPerPage;
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
  const getEmployee = () => {
    let c = [];
    if (priority.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < priority.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleAddRole = () => {
    props.handleDashComponent(
      "",
      <AddPriority handleDashComponent={props.handleDashComponent} />
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
                            <h5 class="mt-0">Priority Management</h5>
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
                                  onClick={() => handleAddRole()}
                                >
                                  {" "}
                                  <i class="mdi mdi-plus"></i>
                                  Add Priority
                                </button>
                                { (isCheck.length > 1  ) && <button
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
                                    // onChange={(event) =>
                                    //   showEntry(parseInt(event.target.value))
                                    // }
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
                                // onClick={() => sortTable(1)}
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
                              // onClick={() => sortTable(0)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
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
                              // onClick={() => sortTable(1)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
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
                              // onClick={() => sortTable(2)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                }}
                              >
                                <div>CompanyId</div>
                                <img src="images/arrow.png" width="10" />
                              </div>
                            </th>
                            <th
                              style={{
                                cursor: "pointer",
                                padding: "0px 15px 0px 0px",
                              }}
                              // onClick={() => sortTable(3)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                }}
                              >
                                <div>Created At</div>
                                <img src="images/arrow.png" width="10" />
                              </div>
                            </th>
                            <th
                              style={{
                                cursor: "pointer",
                                padding: "0px 15px 0px 0px",
                              }}
                              // onClick={() => sortTable(2)}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                }}
                              >
                                <div>Updated AT</div>
                                <img src="images/arrow.png" width="10" />
                              </div>
                            </th>
                            {/* <th>Updated AT </th> */}
                            {/* <img src="images/arrow.png" width="10" /> */}
                            <th>Action</th>
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
                        {!priority.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            priority.length +
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
      {showEditDialogBox()}
    </>
  );
}
