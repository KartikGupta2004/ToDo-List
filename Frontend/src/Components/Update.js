import React, { useState } from "react";
import {useListsContext} from '../Hooks/useListsContext'
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams,Navigate } from 'react-router-dom';
const Update = () => {
    const {dispatch} = useListsContext()

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [navigate,setNavigate]=useState("");
  const { id } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();

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
    const response = await fetch("/api/lists/" + id, {
      method: "PATCH",
      body: JSON.stringify(list),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setTitle("");
      setDate("");
      setNote("");
      setError(null);
      setEmptyFields([])
      toast.success("Your task is updated");
      dispatch({type:'UPDATE_LIST',payload:json})
      setNavigate(`/all-Lists?status=success_update`);
    }
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
        <div className="min-h-screen flex flex-col justify-center items-center bg-HomeBg text-white">
        <h1 className="text-3xl font-semibold mb-2">Update Your List</h1>
        <form className="create flex flex-col bg-orange-200 px-12 py-16 rounded-lg text-black">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={emptyFields.includes('Title') ? 'error text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300' : 'text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300'}
            placeholder="Title"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={emptyFields.includes('Date') ? 'error text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300' : 'text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300'}
          />
          <textarea
            className={emptyFields.includes('Note') ? 'error text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300' : 'text-2xl px-3 py-2 mb-5 rounded-md border-2 border-gray-300'}
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            cols="30"
            rows="1"
            
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
              Update
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
      {navigate&&<Navigate to={navigate}/>}
    </>
    );
}
 
export default Update;