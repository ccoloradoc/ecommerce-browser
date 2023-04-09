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

moment.locale('es-mx');

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

function createOptions(suggestedMax, price) {
  return {
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
        suggestedMin: price - (price /4),
        suggestedMax: suggestedMax
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
  }
}

export default function LineGraph({ id, originalPrice, price, historical }) {
  if (historical && historical.length >= 1) {
    let labels = []
    let data = []
    // let previous = {
    //   value: historical[0].value,
    //   date: moment(historical[0].date)
    // }
    // labels.push(previous.date.tz('America/Mexico_City').format("DD/MMMM HH:mm"))
    // data.push(previous.value)

    historical.forEach(element => {

      // if (previous.value == element.value && labels.length > 1) {
      //   labels.pop()
      //   data.pop()
      // }

      labels.push(moment(element.date).tz('America/Mexico_City').format("DD/MMMM HH:mm"))
      data.push(element.value)
    });

    // Tail
    labels.push(moment(new Date()).tz('America/Mexico_City').format("DD/MMMM HH:mm"))
    data.push(price)

    let dataParam = {
      labels,
      datasets: [{
        data: data,
        stepped: true,
      }]
    };

    const options = createOptions(originalPrice, price)

    return (
      <div className="w-full h-24 mt-10 divide-y divide-blue-200">
        <Line id={id} options={options} data={dataParam} />
      </div>
    )
  } else {
    return (
      <></>
    )
  }
}
