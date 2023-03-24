import Greeting from "./Greeting";
import NavItems from "./NavItems";

const Navbar = () => {
  return (
    <nav className="p-4 flex justify-between items-center">
      <Greeting />
      <NavItems />
    </nav>
  );
};

export default Navbar;

