import React, { useState, useEffect } from "react";
import backimg from "../../../images/bg-auth3.png";

export default function SentMail(props) {
  const [getLoading, setLoading] = useState(false);

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
                    <p class="mb-0">
                      Email has been sent to your email link account Check your
                      account for reset password.
                    </p>
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
