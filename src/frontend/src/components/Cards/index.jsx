import { Card } from "react-bootstrap";

const MenuCard = (props) => {
  const { id, name, chinese, price } = props.item;
  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{`${id}. ${name}, ${chinese}`}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {`${chinese}`}
          </Card.Subtitle>
          <br />
          {`$${price}`}
        </Card.Body>
      </Card>
    </>
  );
};

export default MenuCard;
