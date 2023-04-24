import React, { useState, useEffect } from "react";
import backimg from "../../../images/bg-auth3.png";
// import { useHistory } from "react-router-dom";
import { postDataAxios } from "../../../services/FetchNodeServices";
import OTPInput, { ResendOTP } from "otp-input-react";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

export default function MobileVerify(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [getLoading, setLoading] = useState(false);

  // window.history.back(0);
  useEffect(() => {
    chkToken();
  }, [props]);

  const chkToken = async () => {
    const token = localStorage.getItem("token");
    const tempToken = localStorage.getItem("tempToken");
    if (!token && !tempToken) {
      navigate("/LoginMobile", { replace: true });
    } else if (!tempToken) {
      // console.log("in else if condition", tempToken);
      navigate("/LoginMobile", { replace: true });
    }
  };

  const handleDashborad = (option) => {
    navigate("/", { replace: true });
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

  const handleResend = async (e) => {
    localStorage.removeItem("otp");
    try {
      // e.preventDefault();
      var userData = JSON.parse(localStorage.getItem("user"));
      var tempOTP = generateOTP();
      var body = {
        mobile: userData.mobile,
        otp: tempOTP,
      };
      localStorage.setItem("otp", JSON.stringify(tempOTP));
      var result = await postDataAxios("usersR/sendotp", body);
      if (result.result) {
        swal({
          title: `OTP sent again`,
          icon: "success",
          button: "ok",
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("tempToken");
    const tempOTP = JSON.parse(localStorage.getItem("otp"));
    console.log("tempOTP", tempOTP);
    if (tempOTP == OTP) {
      localStorage.setItem("token", token);
      localStorage.removeItem("tempToken");
      handleDashborad(1);
      // window.location.reload();
    } else {
      swal({
        title: `Invalid Otp`,
        icon: "error",
        button: "ok",
      });
    }
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
                      <h4 className="text-uppercase mt-0">Verify OTP</h4>
                    </div>
                    <form onSubmit={handleVerify} class="was-validated">
                      <div className="mb-2">
                        <label for="simpleinput" class="form-label">
                          Enter OTP
                        </label>
                        <OTPInput
                          value={OTP}
                          onChange={setOTP}
                          autoFocus
                          OTPLength={4}
                          otpType="number"
                          disabled={false}
                          secure
                        />
                      </div>
                      <div className="mb-2">
                        <ResendOTP
                          maxTime={30}
                          onResendClick={(e) => handleResend(e)}
                        />
                      </div>
                      {/* <div className="mb-2">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          className="form-control"
                          type="password"
                          required=""
                          id="password"
                          placeholder="Enter your password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div> */}
                      {/* <div className="mb-2">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="checkbox-signin"
                            defaultChecked=""
                          />
                          <label
                            className="form-check-label"
                            htmlFor="checkbox-signin"
                          >
                            Remember me
                          </label>
                        </div>
                      </div> */}
                      <div className="d-grid text-center">
                        <button
                          className="btn"
                          style={{
                            backgroundColor: "#3742fa",
                            color: "white",
                          }}
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
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
