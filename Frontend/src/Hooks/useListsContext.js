import { ListsContext } from "../Context/ListsContext"
import { useContext } from "react"

export const useListsContext = () => {
  const context = useContext(ListsContext)

  if(!context) {
    throw Error('useListsContext must be used inside an ListsContextProvider')
  }

  return context
}