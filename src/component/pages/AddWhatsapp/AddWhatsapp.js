import React, { useState ,useEffect} from "react";
import { postDataAxios,postData, getDataAxios } from "../../../services/FetchNodeServices";
import moment from "moment/moment";
import swal from "sweetalert";
import { Button } from "@mui/material";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function AddWhatsapp(props) {
//   const userData = JSON.parse(localStorage.getItem("user"));
  const [id, setId] = useState();
  const [userId, setUserId] = useState();
  const [companyId, setCompanyId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [mobile, setMobile] = useState('');
  const [date, setDate] = useState('');
  const [template, setTemplate] = useState('');
  const[users,setUsers]=useState([])
  const[company,setCompany]=useState([])
  const[customer,setCustomer]=useState([])
  const [Created_At, setCreated_At] = useState("");
//   const [Created_At, setCreated_At] = useState("");

  
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

//   const handleEditSubmit = async (event) => {
//     event.preventDefault();
//     const form = event.currentTarget;
//     if (form.checkValidity() === false) {
//       event.stopPropagation();
//       setcheckvalidate(true);
//     } else if (!checkvalidate) {
//       handleUpdate();
//     } else {
//       handleUpdate();
//     }
//     setValidated(true);
//   };
//   const handleSubmit = async () => {
    // event.preventDefault();
    // const form = event.currentTarget;
    // if (form.checkValidity() === false) {
    //   event.stopPropagation();
    //   setcheckvalidate(true);
    // } else if (!checkvalidate) {
    //   CreateTaskType();
    // } else {
    //   CreateTaskType();
    // }
    // setValidated(true);
    // try {
    //     var body = {
    //       roleId: 'eee',
    //       claimId: 'hhh',
    //       createdAt: 'CompanyId',
    //       updated_at: 'aa',
    //       company_id: 'aa',
    //     };
    //     let response = await postData(`rolesclaims/add_new_rolesclaims_data`, body);
    //      (JSON.stringify(response))
    //     if (response.status) {
    //       swal({
    //         title: `Add task type successfully`,
    //         icon: "success",
    //         button: "ok",
    //       }).then(() => {
    //         setRoleId("");
    //         handleCancel(8);
    //         // window.location.reload();
    //       });
    //     } else {
    //       swal({
    //         title: "Something went wrong.",
    //         icon: "error",
    //         button: "ok",
    //       });
    //     }
    //   } catch (error) {
    //     console.log("error in catch", error);
    //   }
    

//   };

const handleValidate = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleSubmit();
    } else {
      handleSubmit();
    }
    setValidated(true);
  };
  // alert(date)
  const handleSubmit=async()=>{
   
    var body = {
            //   roleId: roleId,
            //   claimId: claimId,
            //   createdAt:  moment().format("YYYY-MM-DD HH:mm:ss"),
            // //   updated_at:moment().format("YYYY-MM-DD HH:mm:ss"),
            //   companyId: CompanyId,
            userid:userId,
            companyid:companyId,
            customerid:customerId,
            mobile:mobile,
            date:Created_At,
            template:template,

            };
            let response = await postDataAxios(`whatsapp/add_new_whatsapp_data`,body);
            //  alert(response.status)
              if (response.result) {
                swal({
                    title: `Whatsapp Added Successfully`,
                    icon: "success",
                    button: "ok",
                  })
                  handleCancel(90.2)

              } else {
                swal({
                  title: "Something went wrong.",
                  icon: "error",
                  button: "ok",
                });
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
//   const CreateTaskType = async () => {
//     try {
//       var body = {
//         roleId: 'eee',
//         claimId: 'hhh',
//         createdAt: 'CompanyId',
//         updated_at: 'aa',
//         company_id: 'aa',
//       };
//       let response = await postDataAxios(`rolesclaims/add_new_rolesclaims_data`, body);
//     //   alert(JSON.stringify(response))
//       if (response.status) {
//         swal({
//           title: `Add task type successfully`,
//           icon: "success",
//           button: "ok",
//         }).then(() => {
//           setRoleId("");
//           handleCancel(8);
//           // window.location.reload();
//         });
//       } else {
//         swal({
//           title: "Something went wrong.",
//           icon: "error",
//           button: "ok",
//         });
//       }
//     } catch (error) {
//       console.log("error in catch", error);
//     }
//   };

  const handleCancel = (option) => {
    props.handleDashComponent(option);
  };

  return (
    <>
      <div>
        <div class="content">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body" style={{ padding: "2%" }}>
                    <b>Add Whatsapp</b>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleValidate}
                    >
                      <div class="row mt-3">                          
                        <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>Company ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={companyId}
                              onChange={(event) => {setCompanyId(event.target.value); 
                                 fetchAllUsers(event.target.value);
                                 fetchAllCustomer(event.target.value); 
                              } }
                              placeholder="Company"
                            >
                              <option selected value=''>
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
                        <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>User ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={userId}
                              onChange={(event) => {setUserId(event.target.value); 
                                // fetchAllRoles(event.target.value); fetchAllClaim(event.target.value)
                              }
                               }
                              placeholder="User"
                            >
                              <option selected value=''>
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

                          

                         

                      </Row>

                      <Row className="mb-3">
                      <Form.Group 
                      as={Col} 
                      controlId="validationCustom07"
                      md="6" 
                      >
                            <Form.Label>Customer ID</Form.Label>
                            <Form.Select
                             required
                              aria-label="Default select example"
                              value={customerId}
                              onChange={(event) => {setCustomerId(event.target.value); 
                                // fetchAllUsers(event.target.value); 
                              } }
                              placeholder="Customer"
                            >
                              <option selected value=''>
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
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Mobile</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Mobile"
                          
                            value={mobile}
                            onChange={(event) => setMobile(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Mobile
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                        
                      <Row className="mb-3">
                        {/* <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Date"
                          
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Date
                          </Form.Control.Feedback>
                        </Form.Group> */}

<Form.Group
                          as={Col}
                          md="6"
                          controlId="validationCustom08"
                        >
                          <Form.Label>Date</Form.Label>
                          <Form.Control
                            required
                            type="date"
                            placeholder="Date"
                            value={Created_At}
                            onChange={(newValue) => {
                              setCreated_At(newValue.target.value);
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
                          md="6"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Template</Form.Label>
                          <Form.Control
                            required
                            as="textarea"
                            rows={3}
                            placeholder="Template"
                          
                            value={template}
                            onChange={(event) => setTemplate(event.target.value)}
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter Template
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
                                Create
                              </Button>

                              <Button
                                variant="secondary"
                                style={{
                                  background: "#C9C9CB",
                                  marginLeft:10,
                                  color: "#fff",
                                  borderRadius: 5,
                                  height: "38px",
                                  borderColor: "white",
                                }}
                                onClick={() => handleCancel(90.2)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                    </Form>
{/* <div>
<Button  onClick={handleSubmit}  fullWidth variant="contained"> Submit</Button>
</div> */}


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
