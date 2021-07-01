import { useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import MenuLayout from "../CardDeck";
const link = process.env.REACT_APP_BACKEND_URL;

const MenuNavbar = () => {
  const [breakfast, setBreakfast] = useState([]);
  const [setMeal, setSetMeal] = useState([]);
  const [dailySpecial, setDailySpecial] = useState([]);
  const [noodleSoup, setNoodleSoup] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [congee, setCongee] = useState([]);
  const [curry, setCurry] = useState([]);
  const [bakedCombo, setBakedCombo] = useState([]);
  const [highTea, setHighTea] = useState([]);
  const [menuHeader, setMenuHeader] = useState("");

  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(`${link}/menu/all`);
        let items = await res.json();
        items = items.data;
        setBreakfast(items.filter((item) => item.category === "breakfast"));

        setDailySpecial(
          items.filter((item) => item.category === "daily_special")
        );
        setSetMeal(items.filter((item) => item.category === "set_meal"));
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
  }, []);

  const clickListener = (category) => {
    switch (category) {
      case "dailySpecial":
        setMenuHeader("Daily Special");
        setMenuItems(dailySpecial);
        break;

      case "setMeal":
        setMenuHeader("Set Meals");
        setMenuItems(setMeal);
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
        setMenuItems(noodleSoup);
        break;

      case "curry":
        setMenuHeader("Curry");
        setMenuItems(curry);
        break;

      case "bakedCombo":
        setMenuHeader("Baked Combo");
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
            <Nav.Link onClick={() => clickListener("setMeal")}>
              Set Meals
            </Nav.Link>
            <Nav.Link onClick={() => clickListener("breakfast")}>
              Breakfast
            </Nav.Link>
            <Nav.Link onClick={() => clickListener("congee")}>Congee</Nav.Link>
            <Nav.Link onClick={() => clickListener("noodleSoup")}>
              Noodle Soups
            </Nav.Link>
            <Nav.Link onClick={() => clickListener("curry")}>Curry</Nav.Link>
            <Nav.Link onClick={() => clickListener("bakedCombo")}>
              Baked Combo
            </Nav.Link>
            <Nav.Link onClick={() => clickListener("highTea")}>
              High Tea
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <MenuLayout items={menuItems} header={menuHeader} />
    </>
  );
};

export default MenuNavbar;
