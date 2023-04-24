import React, { useState, useEffect } from "react";
import backimg from "../../../images/bg-auth3.png";
import {
  postDataAxiosWithoutToken,
  getDataAxios,
  postDataAxios,
} from "../../../services/FetchNodeServices";
// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default function ForgotPassword(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  const [getLoginData, setLoginData] = useState([]);
  const [getEmail, setEmail] = useState("");
  const [getLoading, setLoading] = useState(false);
  const [checkvalidate, setcheckvalidate] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {}, [props]);

  const handleForgotPassword = async () => {
    try {
      var body = { email: getEmail };
      var forgotResult = await postDataAxios(`forgotpass/forgotpassword`, body);
      console.log("forgotResult", forgotResult);
      if (forgotResult.status == true) {
        swal({
          title: `Link send to your account`,
          icon: "success",
          button: "ok",
        }).then(() => {
          navigate({ pathname: `/SentMail` });
        });
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      // event.preventDefault();
      event.stopPropagation();
      setcheckvalidate(true);
    } else if (!checkvalidate) {
      handleForgotPassword();
    } else {
      handleForgotPassword();
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
            <div className="loginwidth">
              <div className="text-center mt-4">
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
                      <h4 className="text-uppercase mt-0">Recover Password</h4>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleForgot}
                    >
                      {/* <div className="mb-2">
                        <p class="mb-0">
                          Please provide the email address that you used when
                          you signed up for your TrueSales account.
                        </p>
                      </div> */}
                      <Row className="mb-3 row">
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="validationCustom01"
                        >
                          <Form.Label> Email address</Form.Label>
                          <Form.Control
                            required
                            type="email"
                            placeholder="Enter your email"
                            value={getEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            pattern="[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                          />
                          <Form.Control.Feedback>
                            Looks good!
                          </Form.Control.Feedback>
                          <Form.Control.Feedback type="invalid">
                            Enter valid email
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
                          Send Email
                        </button>
                      </div>
                    </Form>
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
