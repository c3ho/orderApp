import "../css/Menu.css";
import MenuNavbar from "../components/MenuNavbar";
import MenuCarousel from "../components/Carousel";

const Menu = () => {
  return (
    <div id="menu">
      <MenuCarousel />
      <MenuNavbar />
    </div>
  );
};

export default Menu;
