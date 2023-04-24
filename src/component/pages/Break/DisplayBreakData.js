import React, { useEffect, useState } from "react";
import { getDataAxios,getData,postData } from "../../../services/FetchNodeServices";
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
import AddBreakData from "./AddBreakData";


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
  const [getBreakData, setBreakData] = useState([]);
  const [getTempTableData, setTempTableData] = useState([]);
 
  const [getOpen, setOpen] = useState(false);
  const [Page, setPage] = useState(1);
  const [EditOpen, setEditOpen] = useState(false)
  const legth = 30;
 
  const [breakId, setBreakId] = useState("");
  const [attendanceId, setAttendanceId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [inTimeGps, setInTimeGps] = useState("");
  const [outTimeGps, setOutTimeGps] = useState("");
  const [status, setStatus] = useState("");
  // const [createdAt, setCreatedAt] = useState('')
  const [duration, setDuration] = useState("");
  const [breakType, setBreakType] = useState("");
  const [isCheck, setIsCheck] = useState([]);


  const handleMultipleDelete=async()=>{
   
    var body = { id: isCheck };
    var response = await postData("break/delete_all_all_break", body);

    if (response.status) {
      swal({
        title: "All Data of Break Delete Sucessfully",
        icon: "success",
        button: "ok",
      });
      window.location.reload();
      fetchAllBreak();
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





const fetchAllBreak = async () => {
    let data = await getData('break/display_all_break')
    // alert(JSON.stringify(data))
    setBreakData(data.data)
    setTempTableData(data.data)
  }
  useEffect(function () {

    fetchAllBreak()

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
    setBreakData(searchArr);
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
      entryStart + value > getBreakData.length
        ? getBreakData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const getEmployee = () => {
    let c = [];
    if (getBreakData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);
      }
    } else {
      for (let i = 0; i < getBreakData.length; i++) {
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
        var body = { attendanceId: attendanceId,startTime:startTime,endTime:endTime,inTimeGps:inTimeGps,outTimeGps:outTimeGps,status:status, duration: duration,breakType:breakType,breakId:breakId }
        var result = await postData('break/updateBreak',body)
        if (result.status == true) {
          swal({
            title: `Break Updated SuccesFully`,
            icon: "success",
            button: "ok",
          })
          fetchAllBreak()

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
          
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body" style={{ padding: "2%" }}>
                  <b>Add Break</b>
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
                          <Form.Label>Attendence</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Attendence"
                            value={attendanceId}
                            onChange={(event) =>
                              setAttendanceId(event.target.value)
                            }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Attendence
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom02"
                        >
                          <Form.Label>Start Time</Form.Label>
                          <Form.Control
                            type="text"
                            value={startTime}
                          onChange={(event) => setStartTime(event.target.value)}
                            placeholder="Start Time"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Start Time
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>End Time</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="End Time"
                            value={endTime}
                            onChange={(event) => setEndTime(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter End Time
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom04"
                        >
                          <Form.Label>In Time Gps</Form.Label>
                          <Form.Control
                            type="text"
                            value={inTimeGps}
                            onChange={(event) => setInTimeGps(event.target.value)}
                            placeholder="In Time Gps"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                          In Time Gps
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom05"
                        >
                          <Form.Label>Out Time Gps</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Out Time Gps"
                            value={outTimeGps}
                          onChange={(event) =>
                            setOutTimeGps(event.target.value)
                          }
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Out Time Gps
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom06"
                        >
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            type="text"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            placeholder="Status"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Status
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom07"
                        >
                          <Form.Label>Duration</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Duration"
                           value={duration}
                          onChange={(event) => setDuration(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Duration
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom08"
                        >
                          <Form.Label>Break Type</Form.Label>
                          <Form.Control
                            type="text"
                            value={breakType}
                            onChange={(event) => setBreakType(event.target.value)}
                            placeholder="Break Type"
                            required
                          ></Form.Control>
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Break Type
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

    </div>)

  }






  const handleEditPage = (data) => {
      console.log('breakDataaa==',data);
      setEditOpen(true)
      setAttendanceId(data.attendance_id)
      setStartTime(data.start_time)
      setEndTime(data.end_time)
      setInTimeGps(data.in_time_gps)
      setOutTimeGps(data.out_time_gps)
      setStatus(data.status)
      setDuration(data.duration)
      setBreakType(data.break_type)
      setBreakId(data.id)
      
      
  };

const handleDelete = async(id) => {
    // console.log("row company id", id);
    var body = {id:id}
    var response = await postData('break/delete_break_data',body)
    
     if (response.status) {
      swal({
        title: 'Break Delete Sucessfully',
        icon: "success",
        button: "ok",
      })
      fetchAllBreak();
    } 
    else {
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
      <AddBreakData handleDashComponent={props.handleDashComponent} />
    );
  };



  const showEmployee = (i) => {
    return (
      <tr>
            <td>
          <input
            class="form-check-input"
            type="checkbox"
            value={getBreakData[i].id}
            id={getBreakData[i].id}
            checked={isCheck.includes(getBreakData[i].id)}
            onChange={(event) => handleMultiChecked(event, getBreakData[i].id)}
          />
        </td>
        <td> {getBreakData[i].id} </td>
        <td> {getBreakData[i].attendance_id} </td>
        <td> {getBreakData[i].start_time} </td>
        {/* <td style={{ width: 500 }}>{getBreakData[i].perm}</td> */}
        {/* id, name, address, licence, authorised_person_name, auth_emailid, created_at, updated_at, company_phone, company_picture */}
        <td> {getBreakData[i].end_time} </td>
        <td> {getBreakData[i].in_time_gps} </td>
        <td> {getBreakData[i].out_time_gps} </td>
        <td> {getBreakData[i].status} </td>
        <td> {getBreakData[i].created_at} </td>
        <td> {getBreakData[i].break_type} </td>
        <td> {getBreakData[i].duration} </td>
        <td style={{width:110,flexDirection:'row',display:'flex',textDecoration:'none'}}>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft: 5, borderRadius: 0 }}
            onClick={() => handleEditPage(getBreakData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-xs"
            style={{ borderRadius: 0,backgroundColor:'red',borderColor:'red',marginLeft:10}}
            onClick={() => handleDelete(getBreakData[i].id)}
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
      (entNumber + 1) * entriesPerPage < getBreakData.length
        ? (entNumber + 1) * entriesPerPage
        : getBreakData.length
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
    let totalPages = getBreakData.length / entriesPerPage;
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
                            <h5 class="mt-0">Break Management</h5>
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
                                  Add Break
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
                                <div>Attendence</div>
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
                                  <div>Start Time</div>
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
                                  <div>End Time</div>
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
                                <div>In Time Gps</div>
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
                                <div>Out Time Gps</div>
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
                                <div>Status</div>
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
                                <div>Create at</div>
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
                                <div>Duration</div>
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
                                <div>Break Type</div>
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
                        {!getBreakData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                          (entryStart + 1) +
                          " to " +
                          entryEnd +
                          " of " +
                          getBreakData.length +
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
