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
import swal from "sweetalert";
import Swal from "sweetalert2";
import AddDisposition from "../AddDisposition/AddDisposition";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PaginationItem } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Disposition(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getDisposition, setDisposition] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [EditOpen, setEditOpen] = useState(false);
  const [DispositionId, setDispositionId] = useState("");
  const [DispositionName, setDispositionName] = useState("");
  const [CreatedAt, setCreatedAt] = useState("");
  const [getLoading, setLoading] = useState(true);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [isCheck, setIsCheck] = useState([]);


  // const handleMultipleDelete=async()=>{
   
  //   var body = { id: isCheck };
  //   var response = await postData("disposition/delete_all_all_disposition", body);

  //   if (response.status) {
  //     swal({
  //       title: "All Data of Disposition Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     window.location.reload();
  //     fetchDisposition();
  //   } else {
  //     swal({
  //       title: `Something went wrong.`,
  //       icon: "error",
  //       button: "ok",
  //     });
  //   }

  //  }

  const handleMultipleDelete = async () => {
    Swal.fire({
      title: "Do you want to delete this Multiple Role Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: isCheck };
          var response = await postData("disposition/delete_all_all_disposition", body);
  
  
        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchDisposition();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    
  };


  const handleMultiChecked = (event, cid) => {
    const { checked } = event.target;
    let id = cid;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
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

  useEffect(() => {
    fetchDisposition();
  }, []);

  const fetchDisposition = async () => {
    try {
      let response = await getDataAxios(`disposition/display_all_disposition`);
      if (response.status) {
        setDisposition(response.data);
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
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.created_at &&
          item.created_at
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setDisposition(searchArr);
  };

  const handleUpdate = async () => {
    try {
      var body = {
        id: DispositionId,
        name: DispositionName,
        created_at: CreatedAt,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: companyId,
      };
      let EditResponse = await postDataAxios(
        `disposition/update/${DispositionId}`,
        body
      );
      if (EditResponse.status) {
        swal({
          title: `${EditResponse.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setDispositionId("");
          setDispositionName("");
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
                        <b>Edit Disposition</b>
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
                                <Form.Label>Disposition name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter disposition"
                                  value={DispositionName}
                                  onChange={(event) =>
                                    setDispositionName(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Disposition is missing
                                </Form.Control.Feedback>
                              </Form.Group>
                              <div class="w-100"></div>
                            </Row>
                            <Row className="mb-3">

                        <Form.Label>Comapny Name</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={companyId}
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

  const handleEditClickOpen = (row) => {
    console.log('rowww',row);
    setEditOpen(true);
    setDispositionId(row.id);
    setDispositionName(row.name);
    setCreatedAt(row.created_at);
    setCompanyId(row.company_id)
    setCompName(row.cName)
  };

  // const handleDelete = async (id) => {
  //   // console.log("row in Edit click open", id);
  //   var body = { id: id };
  //   var response = await postData("disposition/delete_disposition_data", body);

  //   if (response.status) {
  //     swal({
  //       title: "Disposition Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     fetchDisposition();
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
      title: "Do you want to delete this Task Status Details?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then(async (res) => {
      /* Read more about isConfirmed, isDenied below */
      if (res.isConfirmed) {
        var body = { id: id };
          var response = await postData("disposition/delete_disposition_data", body);
  
        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchDisposition();
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
    setDispositionName("");
    setDispositionId("");
    setcheckvalidate(false);
    setValidated(false);
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
      entryStart + value > getDisposition.length
        ? getDisposition.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getDisposition.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getDisposition.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleAddDisposition = () => {
    props.handleDashComponent(
      "",
      <AddDisposition handleDashComponent={props.handleDashComponent} />
    );
  };

  const showEmployee = (i) => {
    let id = "";
    let Name = "";
    let created = "";
    let companyname = "";
    try {
      id = getDisposition[i].id;
      Name = getDisposition[i].name;
      created = moment(getDisposition[i].created_at).format("DD/MM/YYYY");
      companyname = getDisposition[i].cName;
    } catch (e) {
      id = "";
      Name = "";
      created = "";
    }
    return (
      <tr>
         <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={id}
            id={id}
            checked={isCheck.includes(id)}
            onChange={(event) => handleMultiChecked(event, id)}
          />
        </td>
        <td>{id}</td>
        <td> {Name} </td>
        <td> {created}</td>
        <td> {companyname}</td>
        <td>
          <button
            type="button"
            class="btn btn-success btn-xs"
            onClick={() => handleEditClickOpen(getDisposition[i])}
            style={{ borderRadius: 0 }}
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
      (entNumber + 1) * entriesPerPage < getDisposition.length
        ? (entNumber + 1) * entriesPerPage
        : getDisposition.length
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
    let totalPages = getDisposition.length / entriesPerPage;
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
                              <h5 class="mt-0">Disposition</h5>
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
                                    onClick={() => handleAddDisposition()}
                                  >
                                    <i class="mdi mdi-plus"></i>Add Disposition
                                  </button>
                                  { isCheck.length > 1 && <button
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
                              style={{ cursor: "pointer", padding: "0px 15px 0px 0px", }}
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
                                  <div>Disposition type</div>
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
                                  <div>Added on</div>
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
                                  No disposition yet..!
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
                          {!getDisposition.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getDisposition.length +
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
          {showEditDialogBox()}
        </div>
      )}
    </>
  );
}
