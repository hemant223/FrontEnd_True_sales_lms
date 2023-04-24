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
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { PaginationItem } from "@mui/material";
import AddBreakType from "../AddBreakType/AddBreakType";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function BreakType(props) {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [Page, setPage] = useState(1);
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [CompanyId, setCompanyId] = useState(userData.company_id);
  const [getTempTableData, setTempTableData] = useState([]);
  const [getBreakTypeData, setBreakTypeData] = useState([]);
  const [EditOpen, setEditOpen] = useState(false);
  const [getId, setId] = useState("");
  const [BreakType, setBreakTpe] = useState("");
  const [getCreatedAt, setCreatedAt] = useState("");
  const [getUpdateAt, setUpdateAt] = useState("");
  const [BreakStatus, setBreakStatus] = useState("");
  const [getLoading, setLoading] = useState(true);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [companyName,setCompanyName]=useState('')
  const [companyList, setCompanyList] = useState([]);
  const [isCheck, setIsCheck] = useState([]);


  // const handleMultipleDelete=async()=>{
   
  //   var body = { id: isCheck };
  //   var response = await postDataAxios("breaktype/delete_all_all_breaktype", body);

  //   if (response.status) {
  //     swal({
  //       title: "All Data of Break Type Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     window.location.reload();
  //     fetchBreakTypeData();
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
    var response = await postDataAxios("breaktype/delete_all_all_breaktype", body);
  
  
        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchBreakTypeData();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
    
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
    setCompanyName(event.target.value);
  };


  useEffect(() => {
    fetchBreakTypeData();
  }, []);

  const fetchBreakTypeData = async () => {
    try {
      setLoading(true);
      let response = await getDataAxios(
        `breaktype/display_all_type/`
      );
      if (response.status == true) {
        setBreakTypeData(response.result);
        setTempTableData(response.result);
        setLoading(false);
      } else {
        swal({
          title: `something went wrong.`,
          icon: "error",
        });
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
        (item.break_type &&
          item.break_type
            .toLowerCase()
            .includes(e.target.value.toLowerCase())) ||
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });

    setBreakTypeData(searchArr);
  };

  const handleEditSubmit = async (event) => {
  
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      UpdateBreakType();
    } else {
      UpdateBreakType();
    }
    setValidated(true);
  };

  const UpdateBreakType = async () => {
    try {
      var body = {
        id: getId,
        break_type: BreakType,
        updated_at: moment().format("YYYY-MM-DD hh:mm:ss"),
        company_id: companyName,
        breakstatus: BreakStatus,
      };
      let EditResponse = await postDataAxios(
        `breaktype/update/${getId}/${CompanyId}`,
        body
      );
      if (EditResponse.status) {
        swal({
          title: `${EditResponse.message}`,
          icon: "success",
          button: "ok",
        }).then(() => {
          setId("");
          setBreakTpe("");
          setCompanyName("")
          setCreatedAt("");
          setUpdateAt("");
          setBreakStatus("");
          setEditOpen(false);
          window.location.reload();
        });
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
                        <b>Edit Break type</b>
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
                                <Form.Label>Break type</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  value={BreakType}
                                  onChange={(event) =>
                                    setBreakTpe(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Enter valid break type
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group
                                as={Col}
                                md="6"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Break status</Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  required
                                  type="text"
                                  value={BreakStatus}
                                  onChange={(event) =>
                                    setBreakStatus(event.target.value)
                                  }
                                >
                                  <option selected value="">
                                    --Select Status--
                                  </option>
                                  <option value="Enable">Enable</option>
                                  <option value="Disable">Disable</option>
                                </Form.Select>
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  kindly select a status
                                </Form.Control.Feedback>
                              </Form.Group>


                              <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom01"
                          >
                        <Form.Label>Comapny Name</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={companyName}
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
                                  Enter valid Company type
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
    // alert(JSON.stringify(row))
    setEditOpen(true);
    setId(row.id);
    setBreakTpe(row.break_type);
    setCompanyName(row.company_id)
    setCreatedAt(row.created_at);
    setBreakStatus(row.breakstatus);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setId("");
    setBreakTpe("");
    setCompanyName("")
    setCreatedAt("");
    setBreakStatus("");
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
      entryStart + value > getBreakTypeData.length
        ? getBreakTypeData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getBreakTypeData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getBreakTypeData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const handleAddAbandoned = () => {
    props.handleDashComponent(
      "",
      <AddBreakType handleDashComponent={props.handleDashComponent} />
    );
  };

  const showEmployee = (i) => {
    let id = "";
    let breakType = "";
    let created = "";
    let breakStatus = "";
    let companyName="";
    try {
      id = getBreakTypeData[i].id;
      breakType = getBreakTypeData[i].break_type;
      created = getBreakTypeData[i].created_at;
      breakStatus = getBreakTypeData[i].breakstatus;
      companyName=getBreakTypeData[i].cname;

   
    } catch (e) {
      id = "";
      breakType = "";
      created = "";
      breakStatus = "";
      companyName="";
    }


// Handle Delete Break Type//
// const handleDelete = async (id) => {
//   var body = { id: id };
//   // alert(id)
//   var result = await postDataAxios("breaktype/delete", body);

//   if (result.status) {
//     swal({
//       title: `Break Type Delete Successfully`,
//       icon: "success",
//       button: "ok",
//     });
//     fetchBreakTypeData();
//   } else {
//     swal({
//       icon: "error",
//       title: "Oops...",
//       text: "Something went wrong!",
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
      //   // alert(id)
        var result = await postDataAxios("breaktype/delete", body);

      if  (result.status){
        Swal.fire("Deleted!", "", "success");
        fetchBreakTypeData();
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

    return (
      <tr>

<td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getBreakTypeData[i].id}
            id={getBreakTypeData[i].id}
            checked={isCheck.includes(getBreakTypeData[i].id)}
            onChange={(event) => handleMultiChecked(event, getBreakTypeData[i].id)}
          />
          </td>

        <td>{id}</td>
        <td> {breakType} </td>
        <td> {created}</td>
        <td> {breakStatus}</td>
        <td> {companyName}</td>
        <td>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ borderRadius: 0 }}
            onClick={() => handleEditClickOpen(getBreakTypeData[i])}
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
            onClick={() => handleDelete(getBreakTypeData[i].id)}
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
      (entNumber + 1) * entriesPerPage < getBreakTypeData.length
        ? (entNumber + 1) * entriesPerPage
        : getBreakTypeData.length
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
    let totalPages = getBreakTypeData.length / entriesPerPage;
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
                              <h5 class="mt-0">Break type</h5>
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
                                    onClick={() => handleAddAbandoned()}
                                  >
                                    {" "}
                                    <i class="mdi mdi-plus"></i>Add break type
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
                                  <div>Break type</div>
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
                                  <div>Created date</div>
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
                                  <div>Break status</div>
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
                                  <div>Comapny Id</div>
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
                                  No break type yet..!
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
                          {!getBreakTypeData.length
                            ? "[Nothing to show]"
                            : "Showing  " +
                              (entryStart + 1) +
                              " to " +
                              entryEnd +
                              " of " +
                              getBreakTypeData.length +
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
