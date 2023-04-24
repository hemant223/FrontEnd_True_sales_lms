import { event } from "jquery";
import moment from "moment";
import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import { checkRequire } from "../../../services/Checks";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import Form from "react-bootstrap/Form";

export default function AddRole(props) {
  // const userData = JSON.parse(localStorage.getItem("user"));
  // const [companyId, setCompanyId] = useState(userData.company_id);
  const [AllClaims, setAllClaims] = useState([]);
  const [isCheck, setIsCheck] = useState([]);
  const [getRoleName, setRoleName] = useState("");
  const [getRoleNameErr, setRoleNameErr] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyList,setCompanyList]=useState([])
  const [claimNameErr, setclaimNameErr] = useState("");
const [companyNameErrr,setCompanyErrr]=useState('')
  // useEffect(() => {
  //   fetchCliams();
  // }, []);

  const handleSubmit = async (e) => {
    var err = false;
    if (!checkRequire(getRoleName&&companyName)) {
      err = true;
      setRoleNameErr("Role name is missing");
      setCompanyErrr("Company Name is missing");
    }
    if (checkRequire(getRoleName&&companyName)) {
      var a = (
        <p style={{ color: "#10c469", marginTop: "5px", fontSize: ".75rem" }}>
          Looks good!
        </p>
      );
      setRoleNameErr(a);
      setCompanyErrr(a)
    }

    
    if (!err) {
      let body = {
        name: getRoleName,
        slug: getRoleName.toLowerCase(),
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: companyName,
      };
      let response = await postDataAxios(`roles/add`, body);
      // alert(JSON.stringify(response));
      if (response.status == true) {
        swal({
          title: "Add Data  in Roles.",
          icon: "success",
          button: "ok",
        });
        handleBack(4)
      } else {
        swal({
          title: "Error occurred in Company.",
          icon: "error",
          button: "ok",
        });
      }
    }
  };

  // const fetchCliams = async () => {
  //   try {
  //     let result = await getDataAxios(`claims/display/${companyId}`);
  //     if (result.status) {
  //       setAllClaims(result.result);
  //     }
  //   } catch (error) {
  //     console.log("error in catch", error);
  //   }
  // };

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
      var joy = await getDataAxios('company/display_all_company')
      setCompanyList(joy.data)

  }
  useEffect(function () {
      fetchAllCompanyId()

  }, [])

  // Fill Company  Name
  const fillCompanyName = () => {
    return companyList.map((item) => {
        return (

            <option value={item.id}> {item.name}</option>

        )
    })

}

  // Handle Change Company //
  const handleChangeCompany = async (event) => {
setCompanyName(event.target.value)
}

  const showClaims = () => {
    return AllClaims.map((item, index) => {
      return (
        <>
          <div
            class="form-check mb-2  form-check-primary"
            style={{ marginRight: 40, width: 150 }}
          >
            <input
              class="form-check-input"
              type="checkbox"
              value={item.id}
              id={item.id}
              checked={isCheck.includes(item.id)}
              onChange={(event) => handleMultiChecked(event, item.id)}
            />
            <label class="form-check-label" for="customckeck1">
              {item.slug}
            </label>
          </div>
        </>
      );
    });
  };

  const handleBack = (option) => {
    props.handleDashComponent(option);
  };

  return (
    <>
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <b>Add Role</b>
                  <hr />
                  <form>
                    <div class="row">
                      <div class="col-6 mb-2">
                        {/* <img src={getRoleNameErr} width="12px" height="12px" /> */}
                        <label for="simpleinput" class="form-label">
                          Role name
                        </label>
                        <input
                          type="text"
                          id="simpleinput"
                          class="form-control"
                          value={getRoleName}
                          onChange={(event) => setRoleName(event.target.value)}
                        />
                        <span style={{ color: "#ff5b5b", fontSize: ".75rem" }}>
                          {getRoleNameErr}
                        </span>
                      </div>
                      <div class="col-6 mb-2">
                        {/* <img src={getRoleNameErr} width="12px" height="12px" /> */}
                        
                        
                        


                        <Form.Label>Comapny Name</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={companyName}
                          onChange={
                            handleChangeCompany
                          }
                          placeholder="Select Company Name"
                          required
                        >
                          <option selected value="">
                          Select Company Name
                          </option>
                       {fillCompanyName()}
                        </Form.Select>
                        <span style={{ color: "#ff5b5b", fontSize: ".75rem" }}>
                          {companyNameErrr}
                        </span>



                      </div>
                      <div class="w-100"></div>
                      <div class="col-12">
                        <div></div>
                      </div>
                    </div>
                  </form>

                  <div class="col-xl-6 mt-3">
                    <div class="button-list">
                      <button
                        onClick={() => handleSubmit()}
                        class="btn btn-sm waves-effect waves-light"
                        style={{
                          background: "#4261F7",
                          color: "#fff",
                          borderRadius: 5,
                          height: "38px",
                        }}
                      >
                        Create
                      </button>
                      <button
                        onClick={() => handleBack(4)}
                        class="btn btn-sm waves-effect waves-light"
                        style={{
                          background: "#C9C9CB",
                          color: "#fff",
                          borderRadius: 5,
                          height: "38px",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
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
