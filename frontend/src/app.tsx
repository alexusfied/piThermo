import "./app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import tempIcon from "./assets/temperature-high.svg";
import topIcon from "./assets/arrow-to-top.svg";
import bottomIcon from "./assets/arrow-to-bottom.svg";
import averageIcon from "./assets/tachometer-alt-average.svg";
import { useEffect, useState } from "preact/hooks";
import { Container, Row, Col } from "react-bootstrap";
import TempSearchForm from "./components/TempSearchForm";
import TempSearchResponse from "./components/TempSearchResponse";
import TempGraphs from "./components/TempGraphs/TempGraphs";
import SingleTemp from "./components/SingleTemp";

interface SearchResponsePaginated {
  body: {
    [index: number]: temperature[];
  };
}

interface temperature {
  date: string;
  temperature: string;
}

export function App() {
  // Store the current temperature to display it
  const [currentTemp, setCurrentTemp] = useState("");
  const [avgTempTotal, setAvgTempTotal] = useState("");
  const [highestTempTotal, setHighestTempTotal] = useState("");
  const [lowestTempTotal, setLowestTempTotal] = useState("");
  const [todaysTemps, setTodaysTemps] = useState([]);
  const [searchResponse, setSearchResponse] = useState<SearchResponsePaginated>(
    {
      body: [],
    }
  );
  const [searchResponseVisible, setSearchResponseVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Async function, which fetches the current temperature
  const fetchCurrentTemp = async function () {
    try {
      const response = await fetch(
        "http://raspberrypi.local/thermoApp.fcgi/current_temp",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setCurrentTemp(data.temp.toString());

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("There has been a problem with the request:", error);
    }
  };

  const fetchAvgTempTotal = async function () {
    const response = await fetch(
      "http://raspberrypi.local/thermoApp.fcgi/avg_temp_total",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setAvgTempTotal(data.temp.toString());
  };

  const fetchHighestTempTotal = async function () {
    const response = await fetch(
      "http://raspberrypi.local/thermoApp.fcgi/highest_temp_total",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setHighestTempTotal(data.temp.toString());
  };

  const fetchLowestTempTotal = async function () {
    const response = await fetch(
      "http://raspberrypi.local/thermoApp.fcgi/lowest_temp_total",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setLowestTempTotal(data.temp.toString());
  };

  // Fetch the temps for today for displaying them in the temp chart
  const fetchTodaysTemps = async function () {
    try {
      const response = await fetch(
        "http://raspberrypi.local/thermoApp.fcgi/todays_temps",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setTodaysTemps(data.temperatures);

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("There has been a problem with the request:", error);
    }
  };

  // This effect hook executes the fetchCurrentTemp function only once, when the page loads
  useEffect(() => {
    fetchCurrentTemp();
    fetchAvgTempTotal();
    fetchHighestTempTotal();
    fetchLowestTempTotal();
    fetchTodaysTemps();
  }, []);

  return (
    <Container fluid className="p-5 min-vh-100">
      <Row className="text-center gap-4 justify-content-start align-items-start">
        <Col lg={4} className="bg-turquoise rounded shadow p-5">
          <Row className="pb-5">
            <Col>
              <TempSearchForm
                writeSearchResponseToParent={(
                  response: SearchResponsePaginated
                ) => setSearchResponse(response)}
                showResponse={() => setSearchResponseVisible(true)}
                resetCurrentPage={() => setCurrentPage(1)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <TempSearchResponse
                isVisible={searchResponseVisible}
                triggerVisibility={(visible: boolean) =>
                  setSearchResponseVisible(visible)
                }
                response={searchResponse}
                currentPage={currentPage}
                handlePageChange={(newPage: number) => setCurrentPage(newPage)}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={2}>
          <Row className="bg-purple rounded shadow p-4 mb-3 flex-column">
            <Col className="pb-2">
              <SingleTemp
                descriptorIcon={tempIcon}
                temp={currentTemp}
                iconTooltip="Aktuelle Temperatur"
              ></SingleTemp>
            </Col>
            <Col className="pb-2">
              <SingleTemp
                descriptorIcon={averageIcon}
                temp={avgTempTotal}
                iconTooltip="Durchschnitt insgesamt"
              ></SingleTemp>
            </Col>
            <Col className="pb-2">
              <SingleTemp
                descriptorIcon={topIcon}
                temp={highestTempTotal}
                iconTooltip="Höchste gemessene Temperatur"
              ></SingleTemp>
            </Col>
            <Col>
              <SingleTemp
                descriptorIcon={bottomIcon}
                temp={lowestTempTotal}
                iconTooltip="Niedrigste gemessene Temperatur"
              ></SingleTemp>
            </Col>
          </Row>
        </Col>
        <Col lg={4} className="bg-orange rounded shadow p-5">
          <TempGraphs tempsForToday={todaysTemps}></TempGraphs>
        </Col>
      </Row>
      <Row className="mt-5">
        <div className="text-start">
          UIcons by <a href="https://www.flaticon.com/uicons">Flaticon</a>
        </div>
      </Row>
    </Container>
  );
}
