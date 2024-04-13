import React, { useState } from "react";
import {useListsContext} from '../Hooks/useListsContext'
import { ToastContainer, toast } from 'react-toastify';
import { Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthContext } from "../Hooks/useAuthContext";
function Create() {
  const {dispatch} = useListsContext()
  const {user} =useAuthContext()
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [navigate,setNavigate]=useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user){
      setError('You must be logged in')
      return;
    }
    // Parse the date input value
    const parsedDate = new Date(date);

    // Format the date as YYYY/MM/DD
    const formattedDate = `${parsedDate.getFullYear()}-${(
      parsedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")}`;

    // Check if note is empty
    const noteToSend = note.trim() !== "" ? note : "-";

    const list = { title, dueDate: formattedDate, note: noteToSend };
    const response = await fetch("/api/lists", {
      method: "POST",
      body: JSON.stringify(list),
      headers: {
        "Content-Type": "application/json",
        'Authorization':`Bearer ${user.token}`
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      if (json.emptyFields) {
        setEmptyFields(json.emptyFields);
      }
    }
    if (response.ok) {
      setTitle("");
      setDate("");
      setNote("");
      setError(null);
      setEmptyFields([])
      dispatch({type:'CREATE_LIST',payload:json})
      toast.success("Your task is added");
      setNavigate(`/all-Lists?status=success_create`);
    }
  };

  const adjustTextareaHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const handleClick = (e) => {
    e.preventDefault();
    setTitle("");
    setDate("");
    setNote("");
    setError(null);
  };
  return (
    <>
      <ToastContainer/>
      <div className="min-h-screen py-5 flex flex-col justify-center items-center bg-HomeBg text-white">
        <h1 className="text-3xl font-semibold mb-2">Add a New To Do</h1>
        <form className="create flex flex-col bg-orange-200 px-12 py-16 rounded-lg text-black">
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`text-2xl resize-none h-fit w-full mr-3 overflow-hidden outline-none px-3 py-2 mb-5 rounded-md border-2 border-gray-300 ${emptyFields.includes('Title') ? 'error' : ''}`}
            placeholder="Title"
            onInput={adjustTextareaHeight}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`text-2xl px-3 py-2 mb-5 rounded-md border-2 outline-none border-gray-300 ${emptyFields.includes('Date') ? 'error' : ''}`}
          />
          <textarea
            className={`resize-none h-fit w-full outline-none text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300 overflow-hidden ${emptyFields.includes('Note') ? 'error' : ''}`}
            placeholder="Note"
            value={note}
            onInput={adjustTextareaHeight}
            onChange={(e) => setNote(e.target.value)}
            
          />
          <div className="flex mt-3">
            <button
              className="bg-orange-600 text-white px-3 py-1 text-xl rounded-lg hover:bg-orange-500 mr-3"
              onClick={handleClick}
            >
              Clear
            </button>
            <button
              className="bg-orange-600 text-white px-3 py-1 text-xl rounded-lg hover:bg-orange-500"
              onClick={handleSubmit}
            >
              Create
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
      {navigate&& <Navigate to={navigate}/>}
    </>
  );
}

export default Create;
