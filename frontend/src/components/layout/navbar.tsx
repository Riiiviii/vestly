import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="bg-transparent my-5 w-full px-4 sm:px-8 lg:px-16">
      <div className="flex justify-between items-center pb-4">
        <div>
          <Button
            variant="logo"
            aria-label="Vestly home"
            render={<Link to="/" />}
          >
            <span>
              Vest
              <span>
                <i className="">ly</i>
              </span>
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
