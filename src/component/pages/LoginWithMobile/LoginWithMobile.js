import React, { useEffect, useState } from "react";
import backimg from "../../../images/bg-auth3.png";
// import { useHistory } from "react-router-dom";
import {
  postDataAxios,
  getDataAxios,
} from "../../../services/FetchNodeServices";
import swal from "sweetalert";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

export default function LoginWithMobile(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  // window.location.reload();
  const [getMobile, setMobile] = useState("");
  const [getLoading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);

  useEffect(() => {
    chkToken();
  }, [props]);

  const chkToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.clear();
      navigate("/LoginMobile", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  function generateOTP() {
    // Declare a string variable
    // which stores all string
    var string = "0123456789";
    let OTP = "";

    // Find the length of string
    var len = string.length;
    for (let i = 0; i < 4; i++) {
      OTP += string[Math.floor(Math.random() * len)];
    }
    // return OTP;
    console.log("OTP===========102", OTP);
    return OTP;
  }

  const handleLoginMobile = async (e) => {
    try {
      setLoading(true);
      if (!getMobile.startsWith("+91")) {
        var FinalMobile = "+91" + getMobile;
      } else {
        var FinalMobile = getMobile;
      }
      var tempOTP = generateOTP();
      var body = {
        mobile: FinalMobile,
        otp: tempOTP,
      };

      var response = await postDataAxios(`usersR/PenalLogin`, body);
      if (response.status == true) {
        let responseTask = await getDataAxios(
          `taskpriority/display/${response.data.company_id}`
        );
        let roleResponse = await getDataAxios(
          `roles/newPenalRoleDisplay/${response.data.company_id}`
        );
        localStorage.setItem("Roles", JSON.stringify(roleResponse.result));
        localStorage.setItem(
          "taskPirority",
          JSON.stringify(responseTask.result)
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("tempToken", response.token);
        localStorage.setItem("otp", JSON.stringify(tempOTP));
        var result = await postDataAxios("usersR/sendotp", body);
        if (result.result) {
          setLoading(false);
          localStorage.setItem("scopes", JSON.stringify(response.scopes));
          localStorage.setItem("rolename", JSON.stringify(response.Rolename));
          navigate({ pathname: `/MobileVerify` });
        }
      } else {
        swal({
          title: `You are not authorized to login`,
          icon: "error",
        }).then(() => {
          localStorage.clear();
          window.location.reload();
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      // event.preventDefault();
      e.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleLoginMobile();
    } else {
      handleLoginMobile();
    }
    setValidated(true);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <div
            className="container"
            style={{
              height: "100vh",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <div className="row justify-content-center"> */}
            <div style={{ width: "40%" }}>
              <div className="text-center mt-1">
                <a href={false}>
                  <img
                    src="images/Off_Logo.png"
                    alt=""
                    height={40}
                    className="mx-auto"
                  />
                </a>
              </div>
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
                <div className="card mt-2">
                  <div className="card-body p-4">
                    <div className="text-center">
                      <h4 className="text-uppercase mt-0">
                        Sign In With Mobile
                      </h4>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSendOtp}
                    >
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustom03"
                        >
                          <Form.Label>Mobile Number</Form.Label>
                          <Form.Control
                            required
                            type="text"
                            placeholder="Mobile number"
                            onChange={(event) => setMobile(event.target.value)}
                            value={getMobile}
                            pattern="[6-9]{1}[0-9]{9}"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid mobile number
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Row>
                      <div className="d-grid text-center">
                        <button
                          className="btn"
                          style={{
                            backgroundColor: "#3742fa",
                            color: "white",
                          }}
                          type="submit"
                        >
                          Verify
                        </button>
                      </div>
                    </Form>
                    {/* <form onSubmit={handleSendOtp} class="was-validated">
                      <div className="mb-2">
                        <label for="simpleinput" class="form-label">
                          Mobile Number
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          value={getMobile}
                          onChange={(event) => setMobile(event.target.value)}
                          name="mobile"
                          id="mobile"
                          required
                          placeholder="Enter Number"
                          // pattern="/^[+]91(9|8|7)\d{9}$/"
                          pattern="[6-9]{1}[0-9]{9}"
                        />
                      </div>
                      <div className="d-grid text-center">
                        <button
                          className="btn"
                          style={{
                            backgroundColor: "#3742fa",
                            color: "white",
                          }}
                          type="submit"
                        >
                          Verify
                        </button>
                      </div>
                    </form> */}
                  </div>
                  {/* end card-body */}
                </div>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
