var axios = require("axios");
var swal = require("sweetalert");
var ServerURL = "http://localhost:5000";
// var ServerURL = "http://164.52.195.173:5000";
// var ServerURL = "https://admin.truesales.ai";
// var ServerURL = "https://backenddev.truesales.ai";
// var ServerURL = "https://backenddev.truesales.in";

//Get Service Method With Axios
const getDataAxios = async (url, body) => {
  // var Token = JSON.parse(localStorage.getItem("Token"))
  try {
    const result = await axios.get(`${ServerURL}/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        // Authorization: `Bearer ${Token.token}`
      },
      // body: JSON.stringify(body),
    });
    if (result === "Session has Expired Please Login Again") {
      alert("Session has Expired Please Login Again");
      return [];
    } else {
      // console.log(result);
      return result.data;
    }
    // return result.data
    // const result = await response.json();
  } catch (e) {
    console.log("Error in Get Data Service ====59", e);
    return null;
  }
};

// To Send Data In Node
const postDataAxios = async (url, body) => {
  // var Token = JSON.parse(localStorage.getItem("Token"))
  try {
    const result = await axios.post(`${ServerURL}/${url}`, body, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        // Authorization: `Bearer ${Token.token}`
      },
      // body: JSON.stringify(body),
    });
    if (result === "Session has Expired Please Login Again") {
      alert("Session has Expired Please Login Again");
      return [];
    } else {
      // console.log(result);
      return result.data;
    }
    // return result.data
    // const result = await response.json();
  } catch (e) {
    console.log("Error in Get Data Service ====59", e);
    return e;
  }
};

const putDataAxios = async (url, body) => {
  // var Token = JSON.parse(localStorage.getItem("Token"))
  try {
    const result = await axios.put(`${ServerURL}/${url}`, body, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        // Authorization: `Bearer ${Token.token}`
      },
      // body: JSON.stringify(body),
      // body,
    });
    if (result === "Session has Expired Please Login Again") {
      alert("Session has Expired Please Login Again");
      return [];
    } else {
      // console.log(result);
      return result.data;
    }
    // return result.data
    // const result = await response.json();
  } catch (e) {
    console.log("Error in Get Data Service ====59", e);
    return null;
  }
};

const deleteDataAxios = async (url, body) => {
  // var Token = JSON.parse(localStorage.getItem("Token"))
  try {
    const result = await axios.delete(`${ServerURL}/${url}`, body, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        // Authorization: `Bearer ${Token.token}`
      },
      // body: JSON.stringify(body),
      // body,
    });
    if (result === "Session has Expired Please Login Again") {
      alert("Session has Expired Please Login Again");
      return [];
    } else {
      // console.log(result);
      return result.data;
    }
    // return result.data
    // const result = await response.json();
  } catch (e) {
    console.log("Error in Get Data Service ====59", e);
    return null;
  }
};

// const postDataAndImage = async (url, formData, config) => {
//   // var Token = JSON.parse(localStorage.getItem("Token"))
//   try {
//     // console.log(formData);
//     var response = await axios.post(`${ServerURL}/${url}`, formData, config);
//     // const result = await response.json();
//     if (response.data === "Session has Expired Please Login Again") {
//       alert("Session has Expired Please Login Again");
//       return false;
//     } else {
//       // console.log("FETCH SERVICES CONSOLE OF POSTDATAIMAGE", result);
//       // var result = response.data.RESULT;
//       var result = response;
//       return result;
//     }
//   } catch (e) {
//     return null;
//   }
// };

const postDataAndImage = async (Url, body) => {
  try {
    var url = `${ServerURL}/${Url}`;
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
        // Authorization: `Bearer ${await token()}`,
      },
    };

    var response = await axios.post(url, body, config);
    var result = response.data;
    return result;
  } catch (error) {
    if (error.response.status == 401) {
      // alert("Session Expired");
      swal("session Expired!", "Please Login again", "error", {
        buttons: false,
      });
      localStorage.clear();

      setTimeout(() => window.location.replace("/AdminLogin"), 2000);
    } else {
      console.log(error);
    }
  }
};

const postDataAxiosWithoutToken = async (url, body) => {
  try {
    const result = await axios.post(`${ServerURL}/${url}`, body, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (result === "Session has Expired Please Login Again") {
      alert("Session has Expired Please Login Again");
      return [];
    } else {
      // console.log(result);
      return result.data;
    }
    // return result.data
    // const result = await response.json();
  } catch (e) {
    console.log("Error in Get Data Service ====59", e);
    return null;
  }
};




const getData = async (url) => {
  try {
      var response = await fetch(`${ServerURL}/${url}`)
      var result = await response.json()
      return (result)

  } catch (e) {
      return (null)
  }
}


const postData = async (url, body, isFile = false) => { 
  try {
      const headers = {
          headers: {
              "content-type": isFile ? "multipart/form-data" : "application/json",
          }
      }
      var response = await axios.post(`${ServerURL}/${url}`, body, headers)
      var result = await response.data
      return (result)
  }
  catch (error) {
      console.log(error)
      return (false)
  }
}

export {
  ServerURL,
  postDataAxiosWithoutToken,
  getDataAxios,
  postDataAxios,
  postDataAndImage,
  putDataAxios,
  deleteDataAxios,
  postData,
  getData
};
