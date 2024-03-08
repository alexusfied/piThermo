import { Spinner, Tooltip, OverlayTrigger } from "react-bootstrap";

interface SingleTempProps {
  temp: string;
  descriptorIcon: string;
  iconTooltip: string;
}

function SingleTemp(singleTempProps: SingleTempProps) {
  const renderTooltip = function (props: any) {
    return (
      <Tooltip id="icon-tooltip" {...props}>
        {singleTempProps.iconTooltip}
      </Tooltip>
    );
  };

  return (
    <div>
      {singleTempProps.temp ? (
        <div className="d-flex gap-4 ps-4">
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <img src={singleTempProps.descriptorIcon} height="20"></img>
          </OverlayTrigger>
          <p>{`${singleTempProps.temp}°C`}</p>
        </div>
      ) : (
        <Spinner animation="border" role="status" variant="light"></Spinner>
      )}
    </div>
  );
}

export default SingleTemp;
