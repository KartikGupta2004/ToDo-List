import {useAuthContext} from './useAuthContext'
import {useListsContext} from './useListsContext'
export const useLogout = ()=>{
    const {dispatch} = useAuthContext();
    const {dispatch: listDispatch} = useListsContext();
    const logout = ()=>{
        //Remove user from storage
        localStorage.removeItem('user')

        //Dispatch Logout action
        dispatch({type:'LOGOUT'})
        listDispatch({type: 'SET_LISTS',payload: null})
    }
    return {logout}
}