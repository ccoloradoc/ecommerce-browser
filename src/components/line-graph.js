import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import moment from "moment-timezone"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        axis: 'x'
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
        borderColor: "#12b5d2",
        fill: "start",
        backgroundColor: "#bbf0f3",
      },
      point: {
        radius: 2,
        hitRadius: 5,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        display: true,
        ticks: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
  };

const mockLabels = ["January", "February", "March", "April", "May", "June", "July", "AU"];
export const mockData = [10, 15, 20, 12, 24, 17, 15,22]

export default function LineGraph({ id, historical }) {
    let data = []
    let labels = []
    if (historical && historical.length > 1) {
        historical.forEach(element => {
            labels.push(moment(element.date).tz('America/Mexico_City').format("DD/MMMM HH:mm"))
            data.push(element.value)
        });
    } else {
        labels = mockLabels
        data = mockData
    }

    let dataParam = {
        labels,
        datasets: [{
            data: data,
            stepped: true,
        }]
    };

    return (
        <div className="w-full h-24 mt-10 divide-y divide-blue-200">
            <Line id={id} options={options} data={dataParam} />
        </div>
    )
}
