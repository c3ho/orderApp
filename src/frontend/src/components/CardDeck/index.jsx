import { CardDeck } from "react-bootstrap";
import MenuCard from "../Cards";

const MenuLayout = (props) => {
  const { items, header } = props;

  return (
    <>
      <hr id="hr" />
      <h3 id="menuHeader">{header}</h3>
      <CardDeck id="deck">
        {items.map((item) => (
          <MenuCard item={item} key={item.id} />
        ))}
      </CardDeck>
    </>
  );
};

export default MenuLayout;
