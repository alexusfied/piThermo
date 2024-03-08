import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Chart,
} from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);
Chart.defaults.color = "#000000";
Chart.defaults.backgroundColor = "#878181";
Chart.defaults.borderColor = "#878181";
Chart.defaults.elements.line.borderWidth = 2;
Chart.defaults.elements.point.radius = 2.5;

interface TempGraphProps {
  labels: string[];
  dataset: {
    label: string;
    data: number[];
  };
  yAxisTitle: string;
  xAxisTitle: string;
}

function TempGraph(props: TempGraphProps) {
  return (
    <Line
      data={{
        labels: props.labels,
        datasets: [props.dataset],
      }}
      options={{
        scales: {
          x: {
            title: {
              display: true,
              text: [props.xAxisTitle],
            },
          },
          y: {
            title: {
              display: true,
              text: [props.yAxisTitle],
            },
          },
        },
      }}
    ></Line>
  );
}

export default TempGraph;
