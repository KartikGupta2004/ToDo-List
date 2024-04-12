import { createContext, useReducer } from "react";

export const ListsContext = createContext();

export const listsReducer = (state, action) => {
  switch (action.type) {
    case "SET_LISTS":
      return {
        lists: action.payload,
      };
    case "CREATE_LIST":
      return {
        lists: [action.payload, ...state.lists],
      };
    case "DELETE_LIST":
      return {
        lists: state.lists.filter((l) => l._id !== action.payload._id),
      };
    case "UPDATE_LIST":
      return {
        lists: state.lists.map((list) =>
          list._id === action.payload._id ? action.payload : list
        ),
      };
    default:
      return state;
  }
};

export const ListsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(listsReducer, {
    lists: [],
  });

  return (
    <ListsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ListsContext.Provider>
  );
};
