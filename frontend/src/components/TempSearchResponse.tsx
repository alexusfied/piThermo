import { Table, Row, Col } from "react-bootstrap";
import PageNav from "./PageNav";

interface temperature {
  date: string;
  temperature: string;
}

interface SearchResponsePaginated {
  body: {
    [index: number]: temperature[];
  };
}

interface TempSearchResponseProps {
  isVisible: boolean;
  triggerVisibility: Function;
  response: SearchResponsePaginated;
  currentPage: number;
  handlePageChange: Function;
}

function TempSearchResponse(props: TempSearchResponseProps) {
  return (
    <div style={props.isVisible ? "visibility: visible" : "visibility:hidden;"}>
      {props.response.body[1] ? (
        <>
          <Row>
            <Col>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Temperatur</th>
                  </tr>
                </thead>
                <tbody>
                  {props.response.body[props.currentPage].map((temperature) => {
                    return (
                      <tr>
                        <td>{temperature.date}</td>
                        <td>{temperature.temperature}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col>
              <PageNav
                links={Object.keys(props.response.body)}
                currentPage={props.currentPage}
                handlePageChange={props.handlePageChange}
              ></PageNav>
            </Col>
          </Row>
        </>
      ) : (
        <p>Keine passenden Einträge gefunden</p>
      )}
    </div>
  );
}

export default TempSearchResponse;
