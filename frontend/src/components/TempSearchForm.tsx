import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "preact/hooks";

interface submitData {
  date: string;
  minTemp: string;
  maxTemp: string;
}

interface TempSearchFormProps {
  writeSearchResponseToParent: Function;
  showResponse: Function;
  resetCurrentPage: Function;
}

function TempSearchForm(props: TempSearchFormProps) {
  const [inputDate, setInputDate] = useState("");
  const [inputMinTemp, setInputMinTemp] = useState("");
  const [inputMaxTemp, setInputMaxTemp] = useState("");

  const handleSubmit = async function (event: any, requestData: submitData) {
    event.preventDefault();
    props.resetCurrentPage();
    const response = await fetch(
      "http://raspberrypi.local/thermoApp.fcgi/search_temp_pagination",
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      }
    );

    const responseData = await response.json();
    console.log(responseData.body);
    props.writeSearchResponseToParent(responseData);
    props.showResponse();
  };

  // Helpfer function for sanitizing temp input
  const sanitizeTempInput = function (tempInput: string) {
    let tempInputSanitized = tempInput;
    if (tempInputSanitized.includes(",")) {
      const tempInputSplitted = tempInputSanitized.split(",");
      tempInputSanitized = `${tempInputSplitted[0]}.${tempInputSplitted[1]}`;
    }
    return tempInputSanitized;
  };

  return (
    <Form
      onSubmit={(e: any) =>
        handleSubmit(e, {
          date: inputDate,
          minTemp: inputMinTemp,
          maxTemp: inputMaxTemp,
        })
      }
    >
      <Row className="pb-4">
        <Col className="d-flex justify-content-center">
          <Form.Group className="w-50">
            <Form.Label>Datum</Form.Label>
            <Form.Control
              type="date"
              onChange={(e) => {
                let tempInput = sanitizeTempInput(
                  (e.target as HTMLInputElement).value
                );
                setInputDate(tempInput);
              }}
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="pb-4">
        <Col className="d-flex gap-2 justify-content-center">
          <Form.Group className="w-25">
            <Form.Label>Von</Form.Label>
            <Form.Control
              type="text"
              placeholder="-20°C"
              onChange={(e) => {
                let tempInput = sanitizeTempInput(
                  (e.target as HTMLInputElement).value
                );
                setInputMinTemp(tempInput);
              }}
            ></Form.Control>
          </Form.Group>
          <Form.Group className="w-25">
            <Form.Label>Bis</Form.Label>
            <Form.Control
              type="text"
              placeholder="50°C"
              onChange={(e) =>
                setInputMaxTemp((e.target as HTMLInputElement).value)
              }
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="outline-dark" type="submit">
            Suchen
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default TempSearchForm;
