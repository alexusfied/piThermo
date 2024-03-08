import { Row, Col, Button } from "react-bootstrap";

interface PageLinksProps {
  links: string[];
  currentPage: number;
  handlePageChange: Function;
}

function PageNav(props: PageLinksProps) {
  const handleClickPageDown = function () {
    if (props.currentPage !== 1) {
      props.handlePageChange(props.currentPage - 1);
    }
  };

  const handleClickPageUp = function () {
    if (props.currentPage !== props.links.length) {
      props.handlePageChange(props.currentPage + 1);
    }
  };

  return (
    <Row className="justify-content-center align-items-center">
      <Col className="d-flex justify-content-center align-items-center">
        <div className="pe-5">{`Seite ${props.currentPage} von ${props.links.length}`}</div>
        <div className="d-flex gap-1">
          <Button
            variant="outline-dark"
            size="sm"
            onClick={handleClickPageDown}
          >
            {"Zurück"}
          </Button>
          <Button variant="outline-dark" size="sm" onClick={handleClickPageUp}>
            {"Vor"}
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default PageNav;
