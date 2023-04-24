import React, { useEffect, useState } from "react";
import { getDataAxios, postData, postDataAxios } from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import AddWhatsapp from "../AddWhatsapp/AddWhatsapp";

import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import { PaginationItem } from "@mui/material";
import swal from "sweetalert";
import Swal from "sweetalert2";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import moment from "moment/moment";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


export default function WhatsApp (props){
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const[showData,setShowData] = useState([])
  const [getTempTableData, setTempTableData] = useState([]);
  const [EditOpen, setEditOpen] = useState(false);
  const[users,setUsers]=useState([])
  const[company,setCompany]=useState([])
  const[customer,setCustomer]=useState([])
  
  const [id, setId] = useState();
  const [userId, setUserId] = useState();
  const [companyId, setCompanyId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState('');
  const [template, setTemplate] = useState('');
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [getOpen, setOpen] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [Page, setPage] = useState(1);
  const legth = 30;
  

  const fetchAllWhatsapp=async()=>{
    var res=await getDataAxios(
     `whatsapp/display_all_whatsapp_data`
     )
    
    setShowData(res.data)
     setTempTableData(res.data);
 }
     useEffect (function(){
        fetchAllWhatsapp() 
 },[])

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
      entryStart + value > showData.length
        ? showData.length
        : entryStart + value
    );
    setEntriesPerPage(value);
  };

  const handleAddRole = () => {
    props.handleDashComponent(
      "",
      <AddWhatsapp handleDashComponent={props.handleDashComponent} />
    );
  };
  
 const getEmployee = () => { 
    let c = [];
    if (showData.length > entriesPerPage) {
      for (let i = entryStart; i < entryEnd; i++) {
        c[i] = showEmployee(i);       
      }
    } else {
      for (let i = 0; i < showData.length; i++) {
        c[i] = showEmployee(i);
      }
    }
    return c;
  };

  const showEmployee = (i) => {
    //  alert(JSON.stringify(showEmployee))
    return (
      <tr>
        <td>
         <input
            class="form-check-input"
            type="checkbox"
            value={showData[i].id}
            id={showData[i].id}
            checked={isCheck.includes(showData[i].id)}
            onChange={(event) => handleMultiChecked(event, showData[i].id)}
          />
        </td>
        <td> {showData[i].id} </td>
        <td> {showData[i].uName} </td>
        <td> {showData[i].ComName}</td>
        <td> {showData[i].cName} </td>
        <td> {showData[i].mobile} </td> 
        <td> {showData[i].date} </td> 
        <td> {showData[i].template} </td>  
        <td >
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ borderRadius: 0 }}
           onClick={() => handleEditClickOpen(showData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-xs"
            style={{ marginLeft: 10, borderRadius: 0,backgroundColor:'red',color:'#fff' ,borderColor:'red'}}
            onClick={() => handleDelete(showData[i].id)}
          >
            <i class="mdi mdi-delete"></i>
          </button>
        </td>
      </tr>
    );
  };

  const handleSearch = async (e) => {
    
    var searchArr = [];
    getTempTableData.map((item) => {
      var id = `${item.id}`;
      //  alert(JSON.stringify(item.role_id))
      if (
        (id && id.toLowerCase().includes(e.target.value.toLowerCase()))
        // (item.perm &&
        //   item.perm.toLowerCase().includes(e.target.value.toLowerCase()))
      ) {
        searchArr.push(item);
      }
    });
    setShowData(searchArr);
  };

  // const handleDelete = async(id) => {
  //   var body={id:id}
  //   var result= await postData('whatsapp/delete_whatsapp',body)
    
  //   if(result.status)
  //   {
  //     swal({
  //       title: `Whatsapp Delete Successfully`,
  //       icon: "success",
  //       button: "ok",
  //     })
  //     fetchAllWhatsapp() 
  //     setEditOpen(false)
  //   }
  //   else 
  //   {
  //       swal({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'Something went wrong!',
            
  //         })
  //       }
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
          var body={id:id}
    var result= await postData('whatsapp/delete_whatsapp',body)
  
        if (result.status) {
          Swal.fire("Deleted!", "", "success");
          fetchAllWhatsapp();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const handlePageNumber = (entryNumber, value) => {
    let entNumber = value - 1;
    setEntryStart(entNumber * entriesPerPage);
    setEntryEnd(
      (entNumber + 1) * entriesPerPage < showData.length
        ? (entNumber + 1) * entriesPerPage
        : showData.length
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
    let totalPages = showData.length / entriesPerPage;
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
        // role_id: roleId,
        // claim_id: claimId,
        // // createdAt:  moment().format("YYYY-MM-DD HH:mm:ss"),
        // updated_at:  moment().format("YYYY-MM-DD HH:mm:ss"),  
        // company_id: CompanyId,
        // role_Id:roleId
        id:id,
        userid:userId,
        companyid:companyId,
        customerid:customerId,
        mobile:mobile,
        date:date,
        template:template,
        


      };
      let EditResponse = await postData(
        `whatsapp/edit_whatsapp_data`,
        body
      );
      if (EditResponse.status) {
        swal({
          title: `Whatsapp Updated Successfully`,
          icon: "success",
          button: "ok",
        })
        fetchAllWhatsapp()
         setEditOpen(false)
       
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const fetchAllUsers=async(cid)=>{
    // alert(JSON.stringify(cid))
    var body={comId:cid}
     var res=await postDataAxios(
      `whatsapp/display_all_user_data`,body
      )
    
      setUsers(res.data)
      
  }
      useEffect (function(){
      fetchAllUsers() 
  },[])
  
  const fillUsers = () => {
    return users.map(function (item, key) {
        //  alert(JSON.stringify(users))
      return (
        <option value={item.id}>
          {item.name}
        </option>
      );
    });
  };  
  
  const fetchAllCompany=async()=>{
    // var body={comId:cid}
     var res=await getDataAxios(
      `whatsapp/display_all_company`,
      )
      // alert(JSON.stringify(res))
    
      setCompany(res.data)
      
  }
      useEffect (function(){
        fetchAllCompany() 
  },[])

  const fillCompany = () => {

    return company.map(function (item, key) {
        // alert(JSON.stringify(item))
      return (
        <option  value={item.id}>

          {item.name}
        </option>
      );
    });
  };

  // const handleMultipleDelete=async()=>{
   
  //   var body = { id: isCheck };
  //   var response = await postData("whatsapp/delete_all_all_whatsapp", body);
    
  //   // alert(JSON.stringify(response.status))
  //   if (response.status) {
  //     swal({
  //       title: "All Data of Whatsapp Delete Sucessfully",
  //       icon: "success",
  //       button: "ok",
  //     });
  //     // window.location.reload();
  //     fetchAllWhatsapp();
  //     setEditOpen(false)

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
          var response = await postData("whatsapp/delete_all_all_whatsapp", body);
  
  
        if (response.status) {
          Swal.fire("Deleted!", "", "success");
          fetchAllWhatsapp();
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

  const fetchAllCustomer=async(cid)=>{
    var res=await postData(
     `whatsapp/display_all_customer`,{id:cid}
     )
   
     setCustomer(res.data)
     
 }
     useEffect (function(){
        fetchAllCustomer() 
 },[])

  const fillCustomer = () => {

    return customer.map(function (item, key) {
        // alert(JSON.stringify(item))
      return (
        <option  value={item.id}>

          {item.name}
        </option>
      );
    });
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
                        <b>Edit Whatsapp</b>
                        <Form
                          noValidate
                          validated={validated}
                           onSubmit={handleEditSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-3">
                              {/* <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >
                                <Form.Label>ID</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter disposition"
                                  value={id}
                                  onChange={(event) =>
                                    setId(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  ID is missing
                                </Form.Control.Feedback>
                              </Form.Group> */}
                              <Form.Group as={Col} md="6">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={companyId}
                              onChange={(event) => {setCompanyId(event.target.value); 
                                 fetchAllUsers(event.target.value);
                                 fetchAllCustomer(event.target.value); 
                              } }
                              placeholder="Company ID"
                            >
                              <option>
                                --Select Company--
                              </option>
                              {fillCompany()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Kindly select Company ID
                            </Form.Control.Feedback>
                          </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom03">
                            <Form.Label>User ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={userId}
                              onChange={(event) => {setUserId(event.target.value); 
                                // fetchAllRoles(event.target.value); fetchAllClaim(event.target.value)
                              }
                               }
                              placeholder="User ID"
                            >
                              <option>
                              --Select User--
                              </option>
                              {fillUsers()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Kindly select User ID
                            </Form.Control.Feedback>
                          </Form.Group>
                              
                              {/* <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Company Id</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter disposition"
                                  value={companyId}
                                  onChange={(event) =>
                                    setCompanyId(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Disposition is missing
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Customer Id</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter disposition"
                                  value={customerId}
                                  onChange={(event) =>
                                    setCustomerId(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Disposition is missing
                                </Form.Control.Feedback>
                              </Form.Group> */}
                              <Form.Group 
                               as={Col} 
                               controlId="validationCustom03"
                               md="12" 
                      >
                            <Form.Label>Customer ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={customerId}
                              onChange={(event) => {setCustomerId(event.target.value); 
                                // fetchAllUsers(event.target.value); 
                              } }
                              placeholder="Customer ID"
                            >
                              <option>
                                --Select Customer--
                              </option>
                              {fillCustomer()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                            Kindly select User ID
                          </Form.Control.Feedback>
                          </Form.Group>
                             
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Mobile</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter disposition"
                                  value={mobile}
                                  onChange={(event) =>
                                    setMobile(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Mobile is missing
                                </Form.Control.Feedback>
                              </Form.Group>
                              <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustom08"
                        >
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                            required
                            type="date"
                            placeholder="Date"
                            value={date}
                            onChange={(newValue) => {
                              setDate(newValue.target.value);
                            }}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Please pick vaild date
                          </Form.Control.Feedback>
                        </Form.Group>
                              <Form.Group
                                as={Col}
                                md="12"
                                controlId="validationCustom01"
                              >
                                <Form.Label>Template</Form.Label>
                                <Form.Control
                                  required
                                  type="text"
                                  placeholder="Enter disposition"
                                  value={template}
                                  onChange={(event) =>
                                    setTemplate(event.target.value)
                                  }
                                />
                                <Form.Control.Feedback>
                                  Looks good!
                                </Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">
                                  Template is missing
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
  
  const handleEditClickOpen = (row) => {
    fetchAllUsers(row.company_id)
    fetchAllCustomer(row.company_id)
    setEditOpen(true);
    setId(row.id);
    setUserId(row.user_id);
    setCompanyId(row.company_id);
    setCustomerId(row.customer_id);
    setMobile(row.mobile);
    setDate(row.date);
    setTemplate(row.template)
    
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setId('');
    setUserId('');
    setCompanyId('');
    setMobile('');
    setDate('');
    setTemplate('')
    setValidated(false);
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
                            <h5 class="mt-0">Whatsapp</h5>
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
                                    width:140
                                  }}
                                 onClick={() => handleAddRole()}
                                >
                                  {" "}
                                  <i class="mdi mdi-plus"></i>
                                  Add Whatsapp
                                </button>
                                { (isCheck.length > 1 && showData ) && <button
                                    onClick={() => handleMultipleDelete()}
                                    // { isCheck.length > 0 && disabled}
                                    
                                    type="button"
                                    class="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: 5,
                                      height: 34,
                                      marginLeft: 10,
                                      width:100
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
                                        <span class="fas fa-search"></span>
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

                                <img src="images/arrow.png" width="10" />
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
                                <div>User_ID</div>
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
                                  <div>Company_ID</div>
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
                                  <div>Customer_ID</div>
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
                                  <div>Mobile</div>
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
                                  <div>Date</div>
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
                                  <div>Template</div>
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
                                  <div>Actions</div>
                                  
                                </div>
                            </th>
                               
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
                        {!showData.length
                          ? "[Nothing to show]"
                          : "Showing  " +
                          (entryStart + 1) +
                          " to " +
                          entryEnd +
                          " of " +
                          showData.length +
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
     { showEditDialogBox()}
    </>
  );
}