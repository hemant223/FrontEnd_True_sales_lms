import { SET_ADD, SET_MINUS } from "./actions";

const initialState = {
  add: 0,
  minus: 0,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ADD:
      return { ...state, add: action.payload };
    case SET_MINUS:
      return { ...state, minus: action.payload };
    default:
      return state;
  }
}

export default userReducer;
