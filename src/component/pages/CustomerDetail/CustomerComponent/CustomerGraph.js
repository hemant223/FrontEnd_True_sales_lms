import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import moment from "moment/moment";
import { useEffect } from "react";
import { postDataAxios } from "../../../../services/FetchNodeServices";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

export default function CustomerGraph(props) {
  // console.log("props in admin customer graph", props);
  const [filterData, setfilterData] = useState({ labels: [], datasets: [] });
  const [getTotalLength, setTotalLength] = useState();

  const options = {
    transitions: {
      zoom: {
        animation: {
          duration: 0,
        },
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
      },
    },

    scales: {
      y: {
        max: getTotalLength,
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  useEffect(() => {
    try {
      TotalCalls();
      handleCurrentMonth();
    } catch (e) {
      // console.log("eeee in manager customer graph", e);
    }
  }, [props]);

  const TotalCalls = async () => {
    try {
      let body = { startDate: props.startdate, endDate: props.enddate };
      let result = await postDataAxios(
        `customers/displayfilter/${props.item.id}/${props.item.company_id}`,
        body
      );
      // console.log("result---handlefilter-->😘😘---->", result.data.length);
      if (result.status == true) {
        setTotalLength(
          result.data.length == (1 || 2 || 3 || 4 || 5 || 6 || 7)
            ? 8
            : result.data.length
        );
      }
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  const handleCurrentMonth = async () => {
    try {
      let body = { startDate: props.startdate, endDate: props.enddate };
      let result = await postDataAxios(
        `calls/Filtercurrentmonth/${props.item.id}/${props.item.company_id}`,
        body
      );
      // console.log('length of all data12 --->', result.data)
      var valueObj = {};
      Object.values(result.data).map((item) => {
        for (var key in item) {
          if (!valueObj[key]) {
            valueObj[key] = [];
          }
          valueObj[key].push(item[key]);
        }
      });
      var datasets = [];
      for (let key in valueObj) {
        datasets.push({
          label: key,
          data: valueObj[key],
          backgroundColor:
            key == "Answered"
              ? ["#447CEC"]
              : "Answered" && key == "Not Connected"
              ? ["#EF7829"]
              : "Not Connected" && key == "Connected"
              ? ["#E33899"]
              : " Connected" && key == "whatsapp"
              ? ["#10C469"]
              : " whatsapp" && key == "Missed"
              ? ["#E80505"]
              : " Missed",
          borderwidth: 1,
          barThickness: 25,
          barPercentage: 0.1,
          categoryPercentage: 0.5,
        });
      }

      var date = Object.keys(result.data);
      var dateMap = date.map((Dt) => {
        return moment(Dt).format("Do MMM");
      });
      var obj = { labels: dateMap, datasets };
      setfilterData(obj);
    } catch (error) {
      console.log("error in catch", error);
    }
  };

  return (
    <div>
      {filterData.datasets.length == 0 && filterData.labels.length == 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          No interaction yet
        </div>
      ) : (
        <Bar options={options} data={filterData} />
      )}
    </div>
  );
}
