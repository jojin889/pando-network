import { GET_USERS } from "../actions/users.action";
// pour choper TOUS les userS

const initialState = {};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case GET_USERS:
            return action.payload
        default:
            return state;
    }
}