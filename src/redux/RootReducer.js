const initialState = {
  cart: {},
  user: {},
  hName: { tn: "Dashboard" },
};

function RootReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_CART":
      // console.log("action dot payload ====>  10", action.payload[0]);
      state.cart = action.payload[0];
      // console.log("state dot CART in ROOT REDUCERRRR ---> 11111", state.cart);
      return {
        cart: state.cart,
        user: state.user,
        ...state,
      };
    case "REMOVE_ITEM":
      state.cart = new Object();
      return {
        cart: state.cart,
        user: state.user,
        ...state,
      };
    // state.cart = new Object();
    // console.log("REMOVE ITEM", state.cart)

    case "ADD_CART_CUSTOMER":
      state.cart[action.payload[0]] = action.payload[1];
      return {
        cart: state.cart,
        user: state.user,
        ...state,
      };
    case "REMOVE_ITEM_CUSTOMER":
      delete state.cart[action.payload[0]];
      return {
        cart: state.cart,
        user: state.user,
        ...state,
      };
    case "HEADERTITLE":
      state.hName["tn"] = action.payload;
    // console.log("ADD title in REDUX new tn  "+state.hName.tn)
    // return state.hName;

    default:
      return state;
  }
}

export default RootReducer;
