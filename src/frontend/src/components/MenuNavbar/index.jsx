import { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import MenuLayout from "../CardDeck";

const MenuNavbar = () => {
  const link = `http://localhost:4000/menu/all`;

  const [breakfast, setBreakfast] = useState([]);
  const [dailySpecial, setDailySpecial] = useState([]);
  const [noodleSoups, setNoodleSoup] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [congee, setCongee] = useState([]);
  const [curry, setCurry] = useState([]);
  const [bakedCombo, setBakedCombo] = useState([]);
  const [highTea, setHighTea] = useState([]);
  const [menuHeader, setMenuHeader] = useState("");

  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(link);
        let items = await res.json();
        items = items.data;
        setBreakfast(items.filter((item) => item.category === "breakfast"));

        setDailySpecial(
          items.filter((item) => item.category === "daily_special")
        );
        setNoodleSoup(items.filter((item) => item.category === "noodle_soup"));
        setCongee(items.filter((item) => item.category === "congee"));
        setCurry(items.filter((item) => item.category === "curry"));
        setBakedCombo(items.filter((item) => item.category === "bakedCombo"));
        setHighTea(items.filter((item) => item.category === "high_tea"));

        // Set default
        document.getElementById("fb").click();
      } catch (err) {
        console.log(err);
      }
    }
    getItems();
  }, [link]);

  const clickListener = (category) => {
    switch (category) {
      case "dailySpecial":
        setMenuHeader("Daily Special");
        setMenuItems(dailySpecial);
        break;

      case "setMeals":
        setMenuHeader("Set Meals");
        break;

      case "breakfast":
        setMenuHeader("Breakfast");
        setMenuItems(breakfast);
        break;

      case "congee":
        setMenuHeader("Congee");
        setMenuItems(congee);
        break;

      case "noodleSoup":
        setMenuHeader("Noodle Soup");
        setMenuItems(noodleSoups);
        break;

      case "curry":
        setMenuHeader("Curry");
        setMenuItems(curry);
        break;

      case "bakedCombo":
        setMenuHeader("Backed Combo");
        setMenuItems(bakedCombo);
        break;

      case "highTea":
        setMenuHeader("High Tea");
        setMenuItems(highTea);
        break;

      default:
        setMenuHeader("Daily Special");
        setMenuItems(dailySpecial);
        break;
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg" id="menuNavbar">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link id="fb" onClick={() => clickListener("daily_special")}>
              Daily Specials
            </Nav.Link>
            <Nav.Link onClick={() => clickListener("set_meals")}>
              Set Meals 出前一丁
            </Nav.Link>
            <Nav.Link onClick={() => clickListener("breakfast")}>
              Breakfast
            </Nav.Link>
            <Nav.Link>Congee</Nav.Link>
            <Nav.Link onClick={() => clickListener("noodle_soup")}>
              Noodle Soups
            </Nav.Link>
            <Nav.Link>Curry</Nav.Link>
            <Nav.Link>Baked Combo</Nav.Link>
            <Nav.Link>High Tea</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <MenuLayout items={menuItems} header={menuHeader} />
    </>
  );
};

export default MenuNavbar;
