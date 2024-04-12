import { useState, useEffect } from "react";
import { useListsContext } from "../Hooks/useListsContext";
import { useAuthContext } from "../Hooks/useAuthContext";
import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  isTomorrow,
} from "date-fns";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdAdd } from "react-icons/io";
const ListDetails = ({ list }) => {
  const { user } = useAuthContext();
  const { dispatch } = useListsContext();
  const [isDeleted, setIsDeleted] = useState(false);
  const [steps, setSteps] = useState([]);
  const [completed, setCompleted] = useState(
    localStorage.getItem(`completed_${list._id}`) === "true"
  );
  const [saveStatus, setSaveStatus] = useState(Array(steps.length).fill(false));

  // const {steps:ListSteps} =list;

  useEffect(() => {
    // Populate steps with ListSteps when the component mounts
    setSteps(list.steps || []);
    setSaveStatus(Array(list.steps ? list.steps.length : 0).fill(false));
  }, [list.steps]);

  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch("/api/lists/" + list._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_LIST", payload: json });
      if (!isDeleted) toast.success("Your task is deleted");
      localStorage.removeItem(`completed_${list._id}`);
    }
  };

  function formatDate(date) {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  }
  useEffect(() => {
    localStorage.setItem(`completed_${list._id}`, completed);
  }, [completed, list._id]);
  const handleComplete = async () => {
    setCompleted((completed) => !completed);
    if (!completed) toast("Woahhh!! Task Completed");
  };

  //To Delete Completed task EOD
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(23, 59, 59, 0); // Set to midnight of the current day

      if (now >= midnight) {
        if (localStorage.getItem(`completed_${list._id}`) === "true") {
          setIsDeleted(true);
          handleClick();
          localStorage.removeItem(`completed_${list._id}`); // This should handle the deletion
        }
        clearInterval(intervalId); // Clear the interval after midnight
      }
    }, 1000 * 60); // Check every minute

    return () => clearInterval(intervalId); // Cleanup
  }, [list._id]); // Depend on list id to ensure correct behavior

  const addStep = () => {
    setSteps([...steps, { text: "", completed: false }]);
    setSaveStatus([...saveStatus, false]);
  };

  const handleTextChange = (index, newText) => {
    const newSteps = [...steps];
    newSteps[index].text = newText;
    setSteps(newSteps);
  };

  const toggleCompleted = (index) => {
    const newSteps = [...steps];
    newSteps[index].completed = !newSteps[index].completed;
    setSteps(newSteps);
    handleToggleSteps(index);
    if(newSteps[index].completed)
    toast("Woahhh!! Step Completed");
  };

  const adjustTextareaHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  const handleSaveSteps = async (index) => {
    try {
      if (steps[index].text === "") {
        toast.error("Step shouldn't be empty");
        return;
      }
  
      // Check if the step has been saved before
      const isNewStep = !saveStatus[index];
  
      const response = await fetch(`/api/lists/${list._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ steps }),
      });
  
      const updatedList = await response.json();
  
      if (response.ok) {
        // Show toast message only if it's a new step or if changes were made
        if (isNewStep || steps[index].text !== list.steps[index].text) {
          toast.success("Step saved successfully");
        }
  
        dispatch({ type: "UPDATE_LIST", payload: updatedList });
  
        // Update save status
        const newSaveStatus = [...saveStatus];
        newSaveStatus[index] = true;
        setSaveStatus(newSaveStatus);
      } else {
        throw new Error("Failed to save step");
      }
    } catch (error) {
      console.error("Error saving step:", error);
      toast.error("Failed to save step");
    }
  };
  
  const handleToggleSteps = async (index) => {
    try {
        const response = await fetch(`/api/lists/${list._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ steps }),
      });
  
      const updatedList = await response.json();
  
      if (response.ok) {
        dispatch({ type: "UPDATE_LIST", payload: updatedList });
        // Update save status
        const newSaveStatus = [...saveStatus];
        newSaveStatus[index] = true;
        setSaveStatus(newSaveStatus);
      } else {
        throw new Error("Failed to mark the step as completed");
      }
    } catch (error) {
      console.error("Error saving step:", error);
      toast.error("Failed to mark the step as completed, pls retry");
    }
  };

  const handleDeleteStep = async (stepId) => {
    try {
      // Find the index of the step with the given ID
      const index = steps.findIndex((step) => step._id === stepId);
      if (index === -1) {
        // Step not found, handle the error
        throw new Error("Step not found");
      }
  
      // Remove the step from the steps array
      const updatedSteps = [...steps];
      updatedSteps.splice(index, 1);
  
      // Update the local state with the updated steps array
      setSteps(updatedSteps);
      setSaveStatus((prev) => prev.filter((_, i) => i !== index));
  
      // Send a PATCH request to update the list in the database
      const response = await fetch(`/api/lists/${list._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ steps: updatedSteps }),
      });
      const deleteList = await response.json();
      if (response.ok) {
        toast.success("Step deleted successfully");
        dispatch({ type: "UPDATE_LIST", payload: deleteList });
      } else {
        throw new Error("Failed to delete step");
      }
    } catch (error) {
      console.error("Error deleting step:", error);
      toast.error("Failed to delete step");
    }
  };
  

  return (
    <>
      <div className="list-details w-3/4 mt-5">
        <div className={completed ? "line-through" : ""}>
          <h4 className="font-bold">{list.title}</h4>
          <div>
            <div>
            {(steps.length > 0 ? steps : list.steps).map((step, index) => (
                  <div key={index} className="flex items-start mt-2">
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => toggleCompleted(index)}
                      className="rounded-full mr-3"
                    />
                    <textarea
                      onInput={adjustTextareaHeight}
                      value={step.text}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      className={`resize-none h-fit w-full border-none outline-none ${
                        step.completed ? "line-through" : ""
                      }`}
                    />
                    {!completed && <div className="flex">
                    <button
                      className="bg-orange-600 text-white px-2 py-1 text-md rounded-lg hover:bg-orange-500 mr-3"
                      onClick={() => handleSaveSteps(index)}
                      disabled={saveStatus[index]}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 text-md rounded-lg hover:bg-red-500 mr-3"
                      onClick={() => handleDeleteStep(step._id)}
                    >
                      Delete
                    </button>
                    </div>}
                  </div>
                ))}
            </div>
          </div>
          <p>
            <strong>Due Date: </strong>
            {formatDate(list.dueDate)}
          </p>
          {list.note === "-" ? (
            " "
          ) : (
            <p>
              <strong>Note: </strong>
              {list.note}
            </p>
          )}
          <p>
            <strong>Created At:</strong>{" "}
            {formatDistanceToNow(new Date(list.createdAt), { addSuffix: true })}
          </p>
          {list.createdAt !== list.updatedAt ? (
            <p>
              <strong>Updated:</strong>{" "}
              {formatDistanceToNow(new Date(list.updatedAt), {
                addSuffix: true,
              })}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="flex items-center bg-red-600 text-white px-2 py-1 text-lg rounded-lg hover:bg-red-500 mr-3"
            onClick={addStep}
          >
            <IoMdAdd className="mr-1" />
            New step
          </button>
          <button
            className="bg-green-600 mr-3 text-white px-2 py-1 text-lg rounded-lg hover:bg-green-500"
            onClick={handleComplete}
          >
            {completed ? "Completed" : "Mark as completed"}
          </button>
          <NavLink to={`/update/${list._id}`}>
            <button className="bg-orange-600 text-white px-2 py-1 text-lg rounded-lg mr-3 hover:bg-orange-500">
              Update
            </button>
          </NavLink>
          <button
            className="bg-red-600 text-white px-2 py-1 text-lg rounded-lg hover:bg-red-500"
            onClick={handleClick}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default ListDetails;
