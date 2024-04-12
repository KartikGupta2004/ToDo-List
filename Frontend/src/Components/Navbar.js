import React from "react";
import { LuListTodo } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useLogout } from "../Hooks/useLogout";
import { useAuthContext } from "../Hooks/useAuthContext";
function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };
  return (
    <>
      <nav className="flex items-center text-xl justify-between mt-1 border-b-2 border-black pb-2">
        <Link to="/">
          <section className="flex items-center ml-2 text-orange-700">
            <LuListTodo className="mr-2" />
            <p>ToDo</p>
          </section>
        </Link>
        <ul className="flex space-x-20">
          <Link to="/">
            <li>Home</li>
          </Link>
          <Link to="/about">
            <li>About Us</li>
          </Link>
          <Link to="/create">
            <li>New List</li>
          </Link>
          {user && (
            <Link to="/all-Lists">
              <li>All Lists</li>
            </Link>
          )}
        </ul>
        {user && (
          <div>
            <span className="text-lg mr-3">{user.email}</span>
            <button
              className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-400 mr-3"
              onClick={handleClick}
            >
              Log out
            </button>
          </div>
        )}
        {!user && (
          <Link to="/login">
            <button className="bg-orange-600 text-white px-3 py-2 rounded-lg mr-2 hover:bg-orange-400">
              Sign In
            </button>
          </Link>
        )}
      </nav>
    </>
  );
}

export default Navbar;
