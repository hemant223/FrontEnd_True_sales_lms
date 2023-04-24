import { event } from "jquery";
import moment from "moment";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { checkRequire } from "../../../services/Checks";
import {
    getDataAxios,
    postDataAxios,
} from "../../../services/FetchNodeServices";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";

export default function AddTaskStatus(props) {
    const userData = JSON.parse(localStorage.getItem("user"));
    const [companyId, setCompanyId] = useState('')
    const [isCheck, setIsCheck] = useState([]);
    const [taskStatus, setTaskStatus] = useState("");
    const [taskColor, setTaskColor] = useState('')
    const [validated, setValidated] = useState(false);
    const [checkvalidate, setcheckvalidate] = useState(false);
    const [Assign, setAssign] = useState("");
    const [Customer, setCustomer] = useState("");
    const [getErrCustomerId, setErrCustomerId] = useState("");
    const [companyList, setCompanyList] = useState([]);


    useEffect(() => {
        fetchCompany();
    }, []);

    // const handleSubmit = async (e) => {
    //     var err = false;
    //     if (!checkRequire(getClaimName)) {
    //         err = true;
    //         setRoleNameErr("Role name is missing");
    //         setclaimNameErr("");
    //     }
    //     if (checkRequire(getClaimName)) {
    //         var a = (
    //             <p style={{ color: "#10c469", marginTop: "5px", fontSize: ".75rem" }}>
    //                 Looks good!
    //             </p>
    //         );
    //         setRoleNameErr(a);
    //     }

    //     if (!err) {
    //         let body = {
    //             name: getClaimName,
    //             slug: slug.toLowerCase(),
    //             created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    //             company_id: companyId,
    //             parent_id:parentId
    //         };
    //         let response = await postDataAxios(`claims/add`, body);
    //         if (response.status == true) {
    //             swal({
    //                 title: "Record save successfully",
    //                 icon: "success",
    //                 button: "ok",
    //             }).then(() => {
    //                 setClaimName("");
    //                 setIsCheck([]);
    //                 setRoleNameErr("");
    //                 setclaimNameErr("");
    //             });
    //             window.location.reload()
    //             const claimIdArr = Object.values(isCheck).map((item) => {
    //                 return {
    //                     role_id: response.result.insertId,
    //                     claim_id: item,
    //                     created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    //                     updated_at: null,
    //                     company_id: companyId,



    //                 };
    //             });

    //             if (isCheck.length <= 0) {
    //                 setclaimNameErr("* Claims is required to check *");
    //             } else {


    //                 var clm = (
    //                     <span style={{ color: "#10c469", fontSize: ".65rem" }}>
    //                         * Looks good! *
    //                     </span>
    //                 );
    //                 setclaimNameErr(clm);
    //             }
    //         } else {
    //             swal({
    //                 title: "Error occurred in roles.",
    //                 icon: "error",
    //                 button: "ok",
    //             });
    //         }
    //     }
    // };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setcheckvalidate(true);
        } else if (!checkvalidate) {
            handleAdd();
        } else {
            handleAdd();
        }
        setValidated(true);
    };


    const handleAdd = async () => {
        try {
            var err = false;
            if (!err) {
                var body = {
                    name: taskStatus,
                    color:taskColor,
                    company_id: companyId,
                  
                };
                // alert(JSON.stringify(body))
                const result = await postDataAxios("taskstatus/add_new_task_status_data", body);
                if (result.status == true) {
                    swal({
                        title: `Task Status Added Successfully`,
                        icon: "success",
                        button: "ok",
                    })
                    // window.location.reload()
                    handleBack(80.2)

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
    
    // const fetchCliams = async () => {
    //     try {
    //         let result = await getDataAxios(`claims/display_all_claims_data`);
    //         if (result.status) {
    //             setAllClaims(result.data);
    //         }
    //     } catch (error) {
    //         console.log("error in catch", error);
    //     }
    // };


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

    const handleMultiChecked = (event, cid) => {
        const { checked } = event.target;
        let id = cid;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== id));
        }
    };

    // const showClaims = () => {
    //     return AllClaims.map((item, index) => {
    //         return (
    //             <>
    //                 <div
    //                     class="form-check mb-2  form-check-primary"
    //                     style={{ marginRight: 40, width: 150 }}
    //                 >
    //                     <input
    //                         class="form-check-input"
    //                         type="checkbox"
    //                         value={item.id}
    //                         id={item.id}
    //                         checked={isCheck.includes(item.id)}
    //                         onChange={(event) => handleMultiChecked(event, item.id)}
    //                     />
    //                     <label class="form-check-label" for="customckeck1">
    //                         {item.slug}
    //                     </label>
    //                 </div>
    //             </>
    //         );
    //     });
    // };

    const handleBack = (option) => {
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
                                        <b>Add Task Status</b>
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
                                                        <Form.Label>Task Status name</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="Enter Claim name"
                                                            value={taskStatus}
                                                            onChange={(event) =>
                                                                setTaskStatus(event.target.value)
                                                            }
                                                        />
                                                        <Form.Control.Feedback>
                                                            Looks good!
                                                        </Form.Control.Feedback>
                                                        <Form.Control.Feedback type="invalid">
                                                            Task Status name is missing!
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group
                                                        as={Col}
                                                        md="6"
                                                        controlId="validationCustom01"
                                                    >
                                                        <Form.Label>Color Code</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            placeholder="Enter Slug"
                                                            value={taskColor}
                                                            onChange={(event) =>
                                                                setTaskColor(event.target.value)
                                                            }
                                                        />
                                                        <Form.Control.Feedback>
                                                            Looks good!
                                                        </Form.Control.Feedback>
                                                        <Form.Control.Feedback type="invalid">
                                                            Color is missing!
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
                                                            value={companyId}
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
                                                    <Button
                                                        variant="secondary"
                                                        style={{
                                                            background: "#C9C9CB",
                                                            color: "#fff",
                                                            borderRadius: 5,
                                                            height: "38px",
                                                            borderColor: "white",
                                                        }}
                                                        onClick={() => handleBack(80.2)}
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
            </div>
        </>
    );
}
