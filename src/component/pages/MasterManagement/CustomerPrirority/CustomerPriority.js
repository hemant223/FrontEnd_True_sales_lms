import React, { useState, useEffect } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import moment from "moment/moment";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import swal from "sweetalert";
import Swal from "sweetalert2";
import AddCustomerPriority from "../AddCustomerPriority/AddCustomerPriority";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PaginationItem } from "@mui/material";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomerPriority(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [Page, setPage] = useState(1);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState('');
  const [getCustomerPrirority, setCustomerPrirority] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
  const [EditOpen, setEditOpen] = useState(false);
  const [CustomerPriorityName, setCustomerPriorityName] = useState("");
  const [CustomerPriorityId, setCustomerPriorityId] = useState("");
  const [CustomerPriorityColor, setCustomerPriorityColor] = useState("");
  const [CreatedAt, setCreatedAt] = useState("");
  const [getLoading, setLoading] = useState(true);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [companyList, setCompanyList] = useState([])
  const [isCheck, setIsCheck] = useState([]);
  useEffect(() => {
    fetchCustomerPrirority();
  }, []);



  // const handleMultipleDelete=async()=>{
   
  //   var body = { id: isCheck };
  //   var response = await postDataAxios("customerpriority/delete_all_customerpriority", body);

  //   if (response.status) {
  //     swal({
  //       title: "All Data of Customer Priority Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     window.location.reload();
  //     fetchCustomerPrirority();
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
    var response = await postDataAxios("customerpriority/delete_all_customerpriority", body);
  
  
        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchCustomerPrirority();
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

  const fetchCustomerPrirority = async () => {
    try {
      let response = await getDataAxios(
        `customerpriority/display_all_customerpriority_data`
      );
      // console.log("Response in customer prirority", response);
      if (response.status) {
        setCustomerPrirority(response.data);
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
      var id = `${item.customerpriority_id}`;
      if (
        (item.customer_priority &&
          item.customer_priority
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
    setCustomerPrirority(searchArr);
  };

  const EditCustomerPriority = async () => {
    try {
      var body = {
        customerpriority_id: CustomerPriorityId,
        customer_priority: CustomerPriorityName,
        created_at: CreatedAt,
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: CompanyId,
        color: CustomerPriorityColor,
      };
      let EditResponse = await postDataAxios(
        `customerpriority/update/${CustomerPriorityId}`,
        body
      );
      if (EditResponse.status) {
        swal({
          title: `${EditResponse.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setCustomerPriorityName("");
          setCustomerPriorityId("");
          setEditOpen(false);
          window.location.reload();
        });
      }
      else {
        swal({
            title: `Something went wrong`,
            icon: "info",
            button: "ok",
        });
    }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fillCompany = () => {
    console.log("companyList", companyList);
    return companyList.map(function (item) {
      return (
        <option value={item.id}>
          {item.name}
        </option>
      );
    });
  };


  const fetchCompany = async () => {
    // try {
    let response = await getDataAxios(
      `company/display_all_company`
    );
    // alert(JSON.stringify(response.data))
    // if (response.status) {
    setCompanyList(response.data);
    // }
    // } catch (error) {
    // console.log("error in catch", error);
    // }
  };

  useEffect(() => {
    fetchCompany();
  }, []);




  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      EditCustomerPriority();
    } else {
      EditCustomerPriority();
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
                        <b>Customer Priority</b>
                        {/* <hr /> */}

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
                                <Form.Label>Customer priority name</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter priority name"
                                  value={CustomerPriorityName}
                                  onChange={(event) =>
                                    setCustomerPriorityName(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Please select customer priority
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Customer priority color</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  value={CustomerPriorityColor}
                                  onChange={(event) =>
                                    setCustomerPriorityColor(event.target.value)
                                  }
                                  placeholder="Enter color"
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Provide relevant priority color
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom02"
                              >
                                <Form.Label>Company</Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  value={CompanyId}
                                  onChange={(event) =>
                                    setCompanyId(event.target.value)
                                  }
                                  placeholder="Enter Company"
                                  required
                                >
                                  <option selected value="">
                                    --Select Company--
                                  </option>
                                  {fillCompany()}
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Please Select Company
                                </Form.Control.Feedback>
                              </Form.Group>
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
    setEditOpen(true);
    setCustomerPriorityId(row.customerpriority_id);
    setCustomerPriorityName(row.customer_priority);
    setCustomerPriorityColor(row.color);
    setCreatedAt(row.created_at);
    setCompanyId(row.company_id)
  };

  const handleEditClose = () => {
    setEditOpen(false);
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
      entryStart + value > getCustomerPrirority.length
        ? getCustomerPrirority.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getCustomerPrirority.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getCustomerPrirority.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleAddCustomerPriority = () => {
    props.handleDashComponent(
      "",
      <AddCustomerPriority handleDashComponent={props.handleDashComponent} />
    );
  };

  // const handleDelete = async (id) => {
   
    
  //   var body = { id: id }
  //   // alert(JSON.stringify(id))
  //   var result = await postDataAxios(`customerpriority/delete_customerpriority`, body)
  //   if (result.status) {

  //     swal({
  //       title: `Customer Priority  Delete Successfully`,
  //       icon: "success",
  //       button: "ok",
  //     })
  //     fetchCustomerPrirority();
  //   }
  //   else {
  //     swal({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Something went wrong!',
  //     })
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
        var body = { id: id }
  //   // alert(JSON.stringify(id))
    var result = await postDataAxios(`customerpriority/delete_customerpriority`, body)
  
        if (result.status) {
          Swal.fire("Deleted!", "", "success");
          fetchCustomerPrirority();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  const showEmployee = (i) => {
    let id = "";
    let customerpriority = "";
    let color = "";
    let created = "";
    let updated = ""
    let company = "";
    try {
      id = getCustomerPrirority[i].customerpriority_id;
      customerpriority = getCustomerPrirority[i].customer_priority;
      color = getCustomerPrirority[i].color;
      created = getCustomerPrirority[i].created_at;
      updated = getCustomerPrirority[i].updated_at;
      company = getCustomerPrirority[i].company_name;
    } catch (e) {
      id = "";
      customerpriority = "";
      color = "";
      created = "";
      updated = "";
      company = "";
    }

    return (
      <tr>
        <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getCustomerPrirority[i].customerpriority_id}
            id={getCustomerPrirority[i].customerpriority_id}
            checked={isCheck.includes(getCustomerPrirority[i].customerpriority_id)}
            onChange={(event) => handleMultiChecked(event, getCustomerPrirority[i].customerpriority_id)}
          />
        </td>
        <td>{id}</td>
        <td>
          {" "}
          {customerpriority == "Hot" ? (
            <span
              class="badge bg-danger"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              {customerpriority}
            </span>
          ) : customerpriority == "Warm" ? (
            <span
              class="badge bg-success"
              style={{ padding: 7, fontSize: 11, fontWeight: 500 }}
            >
              {customerpriority}
            </span>
          ) : (
            <span
              class="badge"
              style={{
                padding: 7,
                fontSize: 11,
                fontWeight: 500,
                background: "#4261F7",
                color: "#fff",
              }}
            >
              {customerpriority}
            </span>
          )}{" "}
        </td>
        <td>{color}</td>
        <td> {company}</td>
        <td> {created}</td>
        <td> {updated}</td>
        <td>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleEditClickOpen(getCustomerPrirority[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft:5,borderRadius: 0,borderColor:'red',backgroundColor:'red' }}
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
      (entNumber + 1) * entriesPerPage < getCustomerPrirority.length
        ? (entNumber + 1) * entriesPerPage
        : getCustomerPrirority.length
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
    let totalPages = getCustomerPrirority.length / entriesPerPage;
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
                              <h5 class="mt-0">Customer Priority</h5>
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
                                    onClick={() => handleAddCustomerPriority()}
                                  >
                                    {" "}
                                    <i class="mdi mdi-plus"></i>Add Customer
                                    Priority
                                  </button>

                                  { (isCheck.length > 1 && getCustomerPrirority ) && <button
                                    onClick={() => handleMultipleDelete()}
                                    // { isCheck.length > 0 && disabled}
                                    
                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: 5,
                                    
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
                                
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>selection</div>
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
                                  <div>Customer Priority</div>
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
                                  <div>Color code</div>
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
                                  <div>Company</div>
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
                                  <div>Added on</div>
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
                                  <div>Update</div>
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
                                  No customer priority yet..!
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
                          {!getCustomerPrirority.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                            (entryStart + 1) +
                            " to " +
                            entryEnd +
                            " of " +
                            getCustomerPrirority.length +
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
