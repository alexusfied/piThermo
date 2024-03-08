import "./TempGraphs.css";
import { useState } from "preact/hooks";
import TempGraph from "../TempGraph/TempGraph";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

interface TempGraphProps {
  tempsForToday: number[];
}

function TempGraphs(props: TempGraphProps) {
  const monthsPerYearLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ];

  const hoursPerDayLabels = props.tempsForToday.map((_temp, index) =>
    index.toString()
  );

  const [daysPerMonthLabels, setDaysPerMonthLabels] = useState<string[]>([]);
  const [tempsThisYear, setTempsThisYear] = useState<number[]>([]);
  const [tempsThisMonth, setTempsThisMonth] = useState<number[]>([]);

  const tempDataToday = {
    label: "Temperaturen heute",
    data: props.tempsForToday,
  };

  const tempDataThisMonth = {
    label: "Temperaturen diesen Monat",
    data: tempsThisMonth,
  };

  const tempDataThisYear = {
    label: "Temperaturen dieses Jahr",
    data: tempsThisYear,
  };

  const fetchTempsThisMonth = async function () {
    const response = await fetch(
      "http://192.168.1.150/thermoApp.fcgi/temps_this_month",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const avgTempsThisMonth: number[] = [];
    for (const day in data) {
      avgTempsThisMonth.push(data[day]);
    }
    setTempsThisMonth(avgTempsThisMonth);
    setDaysPerMonthLabels(Object.keys(data));
  };

  const fetchTempsThisYear = async function () {
    const response = await fetch(
      "http://192.168.1.150/thermoApp.fcgi/temps_this_year",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const avgTempsThisYear: number[] = [];
    for (const month in data) {
      avgTempsThisYear.push(data[month]);
    }
    setTempsThisYear(avgTempsThisYear);
  };

  return (
    <Tabs defaultActiveKey="today" id="temp-graphs-tabs" className="mb-3">
      <Tab eventKey="today" title="Heute">
        <TempGraph
          labels={hoursPerDayLabels}
          dataset={tempDataToday}
          yAxisTitle="Temperatur in °C"
          xAxisTitle="Uhrzeit in Stunden"
        ></TempGraph>
      </Tab>
      <Tab
        eventKey="current-week"
        title="Dieser Monat"
        onEnter={fetchTempsThisMonth}
      >
        <TempGraph
          labels={daysPerMonthLabels}
          dataset={tempDataThisMonth}
          yAxisTitle="Temperatur in °C"
          xAxisTitle="Tag pro Monat"
        ></TempGraph>
      </Tab>
      <Tab
        eventKey="current-year"
        title="Dieses Jahr"
        onEnter={fetchTempsThisYear}
      >
        <TempGraph
          labels={monthsPerYearLabels}
          dataset={tempDataThisYear}
          yAxisTitle="Temperatur in °C"
          xAxisTitle="Monat pro Jahr"
        ></TempGraph>
      </Tab>
    </Tabs>
  );
}

export default TempGraphs;
