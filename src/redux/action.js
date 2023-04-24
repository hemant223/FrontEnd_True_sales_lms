export const SET_ADD = "SET_ADD";
export const SET_MINUS = "SET_MINUS";

export const setAdd = (add) => (dispatch) => {
  dispatch({
    type: SET_ADD,
    payload: add,
  });
};

export const setMinus = (minus) => (dispatch) => {
  dispatch({
    type: SET_MINUS,
    payload: minus,
  });
};
