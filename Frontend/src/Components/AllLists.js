import React, { useEffect, useState } from "react";
import { useListsContext } from "../Hooks/useListsContext";
import {useAuthContext} from "../Hooks/useAuthContext"
import ListDetails from "./ListDetails";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from "react-router-dom";

function AllLists() {
  const { lists, dispatch } = useListsContext();
  const {user} =useAuthContext()
  const location = useLocation();
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const fetchLists = async () => {
      const response = await fetch("/api/lists",{
        headers:{
          'Authorization':`Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const json = await response.json();
        dispatch({ type: "SET_LISTS", payload: json });
      }
    };

    if(user){
      fetchLists();
    }
    // Trigger toast message based on URL parameter 'status'
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status === 'success_create' && !toastShown) {
      toast.success("Your Task is added!!");
      setToastShown(true);
      // Clear the URL parameter after showing the toast
      clearUrlStatus();
    } else if (status === 'success_update' && !toastShown) {
      toast.success("Your Task is updated!!");
      setToastShown(true);
      // Clear the URL parameter after showing the toast
      clearUrlStatus();
    }
  }, [dispatch, location.search, toastShown,user]);

  // Function to clear the URL parameter 'status'
  const clearUrlStatus = () => {
    const params = new URLSearchParams(location.search);
    params.delete('status');
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-HomeBg min-h-screen">
        <div className="h-fit flex flex-col pl-10 pb-10">
          {lists && lists.length > 0 ? (
            lists.map((list) => <ListDetails list={list} key={list._id} />)
          ) : (
            <div className="flex flex-col justify-center items-center min-h-screen">
              <p className="text-5xl text-white">No List. Create one</p>
              <Link to="/create">
                <button className="bg-orange-600 text-white px-3 py-2 rounded-lg mt-3 text-3xl hover:bg-orange-500">
                  Create
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AllLists;
