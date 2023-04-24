import React, { useEffect, useState } from "react";
import {
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import moment from "moment";
import { checkRequire } from "../../../services/Checks";
import Form from "react-bootstrap/Form";
export default function EditRole(props) {
  // console.log("Edit Role Props", props);
  const [getRoleName, setRoleName] = useState(props.item.name);
  const [getCompanyId, setCompanyId] = useState(props.item.company_id);
  const [getRoleId, setRoleId] = useState(props.item.id);
  const [isCheck, setIsCheck] = useState([]);
  const [AllClaims, setAllClaims] = useState([]);
  const [getRoleNameErr, setRoleNameErr] = useState("");
  const [companyNameErr, setCompanyNameErr] = useState("");
  const [claimNameErr, setclaimNameErr] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [companyName, setCompanyName] = useState(props.item.company_id);
  useEffect(() => {
    fetchClaims();
    //fetchSelectedClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      let result = await getDataAxios(`claims/display/${getCompanyId}`);
      // console.log("Claims -----> ", result.result);
      if (result.status) {
        setAllClaims(result.result);
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  // const fetchSelectedClaims = async () => {
  //   try {
  //     let result = await getDataAxios(
  //       `rolesclaims/display/${getCompanyId}/${getRoleId}`
  //     );
  //     // console.log("Claims -----> ", result.result);
  //     if (result.status) {
  //       const data = result.data.map((item) => item.claim_id);
  //       setIsCheck(data);
  //     }
  //   } catch (error) {
  //     console.log("error in catch", error);
  //   }
  // };

  const handleEdit = async (e) => {
    // e.preventDefault();
    var err = false;
    if (!checkRequire(companyName&&getRoleName)) {
      err = true;
      setRoleNameErr("Role name is missing");
     setCompanyNameErr("Company Name is missing")
    }
    if (checkRequire(companyName&&getRoleName)) {
      var a = (
        <p style={{ color: "#10c469", marginTop: "5px", fontSize: ".75rem" }}>
          Looks good!
        </p>
      );
      setRoleNameErr(a);
      setCompanyNameErr(a)
    }
    if (!err) {
      let body = {
        name: getRoleName,
        slug: getRoleName.toLowerCase(),
        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        company_id: companyName,
        id: getRoleId,
      };
      let response = await postDataAxios(
        `roles/edit_roles_data`,
        body
      );
      if (response.status == true) {
        swal({
          title: "Record update successfully",
          icon: "success",
          button: "ok",
        });
        const claimIdArr = Object.values(isCheck).map((item) => {
          return {
            role_id: getRoleId,
            claim_id: item,
            updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
            company_id: getCompanyId,
          };
        });
      //   let responseRolesClaims = await postDataAxios(
      //     `rolesclaims/update/${getRoleId}/${getCompanyId}`,
      //     claimIdArr
      //   );
      //   // alert(responseRolesClaims.status)
      //   if (responseRolesClaims.status == true) {
          
          
      //   }

      //   var clm = (
      //     <span style={{ color: "#10c469", fontSize: ".65rem" }}>
      //       * Looks good! *
      //     </span>
      //   );
      //   setclaimNameErr(clm);
      // }
      
      // else {
      //   swal({
      //     title: "Error occurred in roles.",
      //     icon: "error",
      //     button: "ok",
      //   });
      }
      handleBack(4)
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
    setCompanyName(event.target.value);
  };

  const handleMultiChecked = (event, cid) => {
    const temp = [...isCheck];
    if (event) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] == cid) {
          temp.splice(i, 1);
        }
      }
    } else {
      temp.push(cid);
    }
    setIsCheck(temp);
  };

  const showClaims = () => {
    return AllClaims.map((item, index) => {
      const checked = isCheck.includes(item.id);
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
              checked={checked}
              onChange={(e) => handleMultiChecked(!e.target.checked, item.id)}
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
                  <b>Edit Role</b>
                  <hr />
                  <form>
                    <div class="row">
                      <div class="col-6 mb-2">
                        <label for="simpleinput" class="form-label">
                          Role Name
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
                        <span style={{ color: "#ff5b5b", fontSize: ".75rem" }}>
                          {companyNameErr}
                        </span>
                        </div>
                      <div class="w-100"></div>
                      <div style={{ display: "flex", flexWrap: "wrap" }}></div>
                    </div>
                  </form>
                  <div class="row mt-3">
                    <div class="col-1 mb-2">
                      <button
                        type="button"
                        class="btn btn-sm"
                        style={{
                          background: "#4261F7",
                          color: "#fff",
                          borderRadius: 5,
                        }}
                        onClick={() => handleEdit()}
                      >
                        Update
                      </button>
                    </div>
                    <div class="col-1 mb-2">
                      <button
                        type="button"
                        class="btn btn-sm"
                        style={{
                          background: "#4261F7",
                          color: "#fff",
                          borderRadius: 5,
                        }}
                        onClick={() => handleBack(4)}
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
