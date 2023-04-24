import React, { useEffect, useState } from "react";
import { getDataAxios, postData, postDataAxios } from "../../../services/FetchNodeServices";
import Pagination from "@mui/material/Pagination";
import AddRoleClaims from '../AddRoleClaims/AddRoleClaims'

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

export default function RoleClaims(props) {

  var userData = JSON.parse(localStorage.getItem("user"));
  const [entryStart, setEntryStart] = useState(0);
  const [entryEnd, setEntryEnd] = useState(10);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  // const [getRolesData, setRolesData] = useState([data])
   const[showData,setShowData] = useState([])
  const [getTempTableData, setTempTableData] = useState([]);
  // const [CompanyId, setCompanyId] = useState(userData.company_id);
  // const [RoleID, setRoleId] = useState(userData.role_id);
  const [roleId, setRoleId] = useState();
  const [claimId, setClaimId] = useState();
  const [CompanyId, setCompanyId] = useState();
  const [roles, setRoles] = useState([]);
  const [company, setCompany] = useState([])
  const[claim,setClaim]=useState([])
  const [Created_At, setCreated_At] = useState("");
  const [Updated_At, setUpdated_At] = useState('');
  const [EditOpen, setEditOpen] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);
  const [getOpen, setOpen] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [Page, setPage] = useState(1);
  const [id, setId] = useState('')
  const legth = 30;
  
  const fetchAllRolesClaims=async()=>{
   var res=await getDataAxios(
    `rolesclaims/display_all_rolesclaims`
    )
  
    setShowData(res.data)
    setTempTableData(res.data);
}
    useEffect (function(){
    fetchAllRolesClaims() 
},[])

const fillRoles = () => {
  return roles.map(function (item, key) {
      // alert(JSON.stringify(item))
    return (
      <option value={item.id}>
        {item.name}
      </option>
    );
  });
};

// const handleMultipleDelete=async()=>{
   
//   var body = { id: isCheck };
//   var response = await postData("rolesclaims/delete_all_all_roleclaims", body);
  
//   // alert(JSON.stringify(response.status))
//   if (response.status) {
//     swal({
//       title: "All Data of Roleclaim Delete Sucessfully",
//       icon: "success",
//       button: "ok",
//     });
//     setEditOpen(false)
//     // window.location.reload();
//     fetchAllRolesClaims();
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
  var response = await postData("rolesclaims/delete_all_all_roleclaims", body);


      if (response.status) {
        Swal.fire("Deleted!", "", "success");
        fetchAllRolesClaims();
      } else {
        Swal.fire("Server Error", "", "error");
      }
    } else if (res.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
  
};

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

const fillClaim = () => {
  return claim.map(function (item, key) {
      // alert(JSON.stringify(item))
    return (
      <option value={item.id}>
        {item.name}
      </option>
    );
  });
};
  // alert(JSON.stringify(getRolesData))
  // useEffect(() => {
  //   fetchRolesData();
  // }, []);

  // const fetchRolesData = async () => {
  //   try {
  //     let response = await getDataAxios(
  //        `roles/newPenalRolesDisplay/${CompanyId}`
  //       // `rolesclaims/display_all_rolesclaims/${CompanyId}`
  //     );
  //     // console.log("roles in display", response);
  //     if (response.status) {
  //       setRolesData(response.result);
  //       setTempTableData(response.result);
  //     }
  //   } catch (error) {
  //     console.log("error in catch", error);
  //   }
  // }
  // };
  // const fetchRolesData = async () => {
  //   try {
  //     let body = {
  //       company_id: CompanyId,
  //     };
  //     let response = await getDataAxios(`template/displayTemplate`, body);
  //     if (response.status) {
  //       setRolesData(response.result);
  //       setTempTableData(response.result);
  //       // setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("error in catch", error);
  //   }
  // };
  

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
        role_id: roleId,
        claim_id: claimId,
        // createdAt:  moment().format("YYYY-MM-DD HH:mm:ss"),
        updated_at:  moment().format("YYYY-MM-DD HH:mm:ss"),  
        company_id: CompanyId,
        id:id
      };
      let EditResponse = await postData(
        `rolesclaims/edit_roles_data`,
        body
      );
      if (EditResponse.status) {
        swal({
          title: `RolesClaims Updated Successfully`,
          icon: "success",
          button: "ok",
        })
        fetchAllRolesClaims()
          // window.location.reload();
          setEditOpen(false);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };
  const fetchAllRoles=async(cid)=>{
    var body={comId:cid}
     var res=await postData(
      `rolesclaims/display_all_roles`,body
      )
    
      setRoles(res.data)
      
  }
      useEffect (function(){
      fetchAllRoles() 
  },[])
  const fetchAllCompany=async()=>{
    var res=await getDataAxios(
     `company/display_all_company`
     )
   
     setCompany(res.data)
     
 }
     useEffect (function(){
        fetchAllCompany() 
 },[])

 const fetchAllClaim=async(cid)=>{
    
    var res=await postData(
     `rolesclaims/display_all_claims`,{id:cid}
     )
       
     setClaim(res.data)
     
 }
     useEffect (function(){
        fetchAllClaim() 
 },[])
 
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
                        <b>Edit RoleClaims</b>
                        <Form
                          noValidate
                          validated={validated}
                           onSubmit={handleEditSubmit}
                        >
                          <div class="row mt-3">
                            <Row className="mb-3">
                              
                              
                            <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={CompanyId}
                              onChange={(event) => {setCompanyId(event.target.value); 
                                fetchAllRoles(event.target.value); fetchAllClaim(event.target.value)} }
                                
                              placeholder="Company"
                              required
                              >
                              <option >
                                --Select Company--
                              </option>
                              {fillCompany()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                             Select Company
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group as={Col} md="6" controlId="validationCustom07">
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
                          <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>Claim ID</Form.Label>
                            <Form.Select
                              aria-label="Default select example"
                              value={claimId}
                              onChange={(event) =>
                                setClaimId(event.target.value)
                              }
                              placeholder="Claim"
                            >
                              <option selected value=''>
                                --Select Claim
                               
                              </option>
                              {fillClaim()}
                            </Form.Select>
                            <Form.Control.Feedback>
                              Looks good!
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                              Select Claim
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
    fetchAllRoles(row.company_id)
    fetchAllClaim(row.company_id)
    console.log('rowww',row.role_id);
    setEditOpen(true);
    setRoleId(row.role_id);
    setClaimId(row.claim_id);
    setUpdated_At(moment().format("YYYY-MM-DD HH:mm:ss")); 
    setCompanyId(row.company_id)
    setId(row.id)
    
  };
  const handleEditClose = () => {
    setEditOpen(false);
   setRoleId("");
    setClaimId("");
    setCompanyId("");
    setUpdated_At(moment().format("YYYY-MM-DD HH:mm:ss")); 
    setValidated(false);
  };


  

  // const handleDelete = async(id) => {
  //   // alert(id)
  //   var body={id:id}
  //   var result= await postData('rolesclaims/delete_roleclaims',body)
    
  //   if(result.status)
  //   {
  //     swal({
  //       title: `RoleClaims Delete Successfully`,
  //       icon: "success",
  //       button: "ok",
  //     })
  //     fetchAllRolesClaims() 
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
          var result= await postData('rolesclaims/delete_roleclaims',body)
  
        if (result.status) {
          Swal.fire("Deleted!", "", "success");
          fetchAllRolesClaims();
        } else {
          Swal.fire("Server Error", "", "error");
        }
      } else if (res.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

   const handleAddRole = () => {
    props.handleDashComponent(
      "",
      <AddRoleClaims handleDashComponent={props.handleDashComponent} />
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
    // alert(JSON.stringify(showData))
    // console.log('showEmployeejjjjjjjj',showData);
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
        <td>{showData[i].id}</td>
        <td> {showData[i].rName} </td>
        <td> {showData[i].cName} </td>
         <td >{showData[i].created_at}</td>
        <td> {showData[i].updated_at} </td>
        <td> {showData[i].ComName} </td>  
        <td>
          <button
            type="button"
            class="btn btn-success btn-xs"
            style={{ marginLeft: 5, borderRadius: 0 }}
            onClick={() => handleEditClickOpen(showData[i])}
          >
            <i class="mdi mdi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-danger btn-xs"
            style={{ marginLeft: 10, borderRadius: 0,backgroundColor:'red',color:'#fff'}}
            onClick={() => handleDelete(showData[i].id)}
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
                            <h5 class="mt-0">RoleClaims Management</h5>
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
                                    width:150
                                  }}
                                   onClick={() => handleAddRole()}
                                >
                                  {" "}
                                  <i class="mdi mdi-plus"></i>
                                  Add RolesClaims
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
                                <div> ID</div>

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
                                <div>Role ID</div>

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
                                <div>Claim_ID</div>
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
                                  <div>Created_At</div>
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
                                  <div>Updated_At</div>
                                  <img src="images/arrow.png" width="10" />
                                </div>
                            </th>
                            <th>Company_ID</th>
                            <th
                              style={{cursor: "pointer",padding: "0px 15px 0px 0px", }}
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
