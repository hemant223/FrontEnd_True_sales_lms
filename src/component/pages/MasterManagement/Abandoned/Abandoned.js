import React, { useEffect, useState } from "react";
import { postData,getDataAxios,postDataAxios,getData } from "../../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import { PaginationItem } from "@mui/material";
import swal from "sweetalert";
import moment from "moment/moment";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AddAbandoned from "../AddAbandoned/AddAbandoned";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DisplayBreakData(props) {
//   var userData = JSON.parse(localStorage.getItem("user"));
const [Customer, setCustomer] = useState("");
const [getErrCustomerId, setErrCustomerId] = useState("");
const [checkvalidate, setcheckvalidate] = useState(false);
const [validated, setValidated] = useState(false);
const [Assign, setAssign] = useState("");



  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [getAbandonedData, setAbandonedData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
 
  const [getOpen, setOpen] = useState(false);
  const [Page, setPage] = useState(1);
  const [EditOpen, setEditOpen] = useState(false)
  const legth = 30;
  const [abandonedMobile, setAbandonedMobile] = useState("");
  const [getAbandonedStatus, setAbandonedStatus] = useState("");
  const [compName, setCompName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [companyId, setCompanyId] = useState('')
  const [abandonedId, setAbandonedId] = useState('')
  const [isCheck, setIsCheck] = useState([]);


  const handleMultipleDelete=async()=>{
   
    var body = { id: isCheck };
    var response = await postData("abandoned/delete_allabandoned", body);

    if (response.status) {
      swal({
        title: "All Data of Abandoned Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      window.location.reload();
      fetchAllAbandoned();
    } else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }

   }


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
    var joy = await getDataAxios  ("company/display_all_company");
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




const fetchAllAbandoned = async () => {
    let data = await getData('abandoned/display_all_abandoned_data')
    // alert(JSON.stringify(data))
    setAbandonedData(data.data)
    setTempTableData(data.data)
  }
  useEffect(function () {

    fetchAllAbandoned()

  }, [])


  const handleSearch = async (e) => {

    var searchArr = [];
    getTempTableData.map((item) => {
        var id=`${item.id}`
      if (
        (id &&
          id.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setAbandonedData(searchArr);
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
      entryStart + value > getAbandonedData.length
        ? getAbandonedData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getAbandonedData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getAbandonedData.length; i++) {
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
        setEditOpen(false)
        var body = { abandonedmobile:abandonedMobile ,companyid:companyId,abandonedstatus:getAbandonedStatus,id:abandonedId}
        var result = await postData('abandoned/edit_abandoned_data',body)
        if (result.status == true) {
          swal({
            title: `Abandoned Updated SuccesFully`,
            icon: "success",
            button: "ok",
          })
          fetchAllAbandoned()

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


  const EditCompanyData = () => {
    return (<div>
      <Dialog
        open={EditOpen}
        onClose={handleEditClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >

        <DialogContent>
          
        <div>
        <div class="content">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body" style={{ padding: "2%" }}>
                    <b>Update Abandoned</b>
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
                            <Form.Label>Abandoned Mobile</Form.Label>
                            <Form.Control
                              required
                              type="text"
                              placeholder="Mobile number"
                              pattern="[6-9]{1}[0-9]{9}"
                              value={abandonedMobile}
                              onChange={(event) =>
                                setAbandonedMobile(event.target.value)
                              }
                            />
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Enter valid mobile number
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="6"
                            controlId="validationCustom02"
                          >
                            <Form.Label> Abandoned status</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={getAbandonedStatus}
                              onChange={(event) =>
                                setAbandonedStatus(event.target.value)
                              }
                              placeholder="Select abandoned status"
                              required
                            >
                              <option selected value="">
                                --Select abandoned status--
                              </option>
                              <option value="Block">Block</option>
                              <option value="Unblock">Unblock</option>
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
                            Create
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
      </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Close</Button>
        </DialogActions>
      </Dialog>

    </div>)

  }






  const handleEditPage = (data) => {
      console.log('dataaaa==',data);
      setEditOpen(true)
      setAbandonedMobile(data.abandoned_mobile)
      setAbandonedStatus(data.abandoned_status)
      setAbandonedId(data.abandoned_id)
      setCompName(data.cName)
      setCompanyId(data.company_id)
      
      
  };

const handleDelete = async(id) => {
    // console.log("row company id", id);
    var body = {id:id}
    var response = await postData('abandoned/delete_abandoned',body)
    
     if (response.status) {
      swal({
        title: 'Abandoned Delete Sucessfully',
        icon: "success",
        button: "ok",
      })
      fetchAllAbandoned();
    } 
    else {
      swal({
        title: `Something went wrong.`,
        icon: "error",
        button: "ok",
      });
    }

  };

  const handleAddAbandoned = () => {
    props.handleDashComponent(
      "",
      <AddAbandoned handleDashComponent={props.handleDashComponent} />
    );
  };



  const showEmployee = (i) => {
    return (
      <tr>
         <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getAbandonedData[i].abandoned_id}
            id={getAbandonedData[i].abandoned_id}
            checked={isCheck.includes(getAbandonedData[i].abandoned_id)}
            onChange={(event) => handleMultiChecked(event, getAbandonedData[i].abandoned_id)}
          />
        </td>
        <td> {getAbandonedData[i].abandoned_id} </td>
        <td> {getAbandonedData[i].abandoned_mobile} </td>
        <td> {getAbandonedData[i].cName} </td>
        <td> {getAbandonedData[i].abandoned_status} </td>
       
        <td style={{width:110,flexDirection:'row',display:'flex',textDecoration:'none'}}>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft: 5, borderRadius: 0 }}
            onClick={() => handleEditPage(getAbandonedData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-xs"
            style={{ borderRadius: 0,backgroundColor:'red',borderColor:'red',marginLeft:10}}
            onClick={() => handleDelete(getAbandonedData[i].abandoned_id)}
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
      (entNumber + 1) * entriesPerPage < getAbandonedData.length
        ? (entNumber + 1) * entriesPerPage
        : getAbandonedData.length
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
    let totalPages = getAbandonedData.length / entriesPerPage;
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
                            <h5 class="mt-0">Abandoned Management</h5>
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
                                  onClick={() => handleAddAbandoned()}
                                >
                                  {" "}
                                  <i class="mdi mdi-plus"></i>
                                  Add Abandoned
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
                                <div>ID</div>

                                <img src="images/arrow.png" width="10" />
                              </div>
                            </th>


                            <th
                              style={{ cursor: "pointer", padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(1)}
                            >
                              <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                                <div>Abandoned Mobile Number</div>
                                <img src="images/arrow.png" width="10" />
                              </div>

                            </th>


                            <th
                              style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(2)}
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

                            <th
                              style={{ cursor: "pointer",padding: "0px 15px 0px 0px", }}
                              onClick={() => sortTable(3)}
                            >
                              <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>Company Status</div>
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
                        {!getAbandonedData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                          (entryStart + 1) +
                          " to " +
                          entryEnd +
                          " of " +
                          getAbandonedData.length +
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
