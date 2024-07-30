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
import {
  fetchCurrentTemp,
  fetchAvgTempTotal,
  fetchHighestTempTotal,
  fetchLowestTempTotal,
  fetchTodaysTemps,
} from "./services/temperatureService";

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
  const [currentTemp, setCurrentTemp] = useState<string>("");
  const [avgTempTotal, setAvgTempTotal] = useState<string>("");
  const [highestTempTotal, setHighestTempTotal] = useState<string>("");
  const [lowestTempTotal, setLowestTempTotal] = useState<string>("");
  const [todaysTemps, setTodaysTemps] = useState<number[]>([]);
  const [searchResponse, setSearchResponse] = useState<SearchResponsePaginated>(
    {
      body: [],
    }
  );
  const [searchResponseVisible, setSearchResponseVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCurrentTemp().then((currentTemp) => setCurrentTemp(currentTemp));
    fetchAvgTempTotal().then((avgTempTotal) => setAvgTempTotal(avgTempTotal));
    fetchHighestTempTotal().then((highestTempTotal) =>
      setHighestTempTotal(highestTempTotal)
    );
    fetchLowestTempTotal().then((lowestTempTotal) =>
      setLowestTempTotal(lowestTempTotal)
    );
    fetchTodaysTemps().then((todaysTemps) => setTodaysTemps(todaysTemps));
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
