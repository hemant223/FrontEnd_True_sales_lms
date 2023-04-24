import "./App.css";
import AdminRouter from "./AdminRouter";
import { Provider } from "react-redux";
import { createStore } from "redux";
import RootReducer from "./redux/RootReducer";

export const store = createStore(RootReducer);
function App(props) {
  return (
    <>
      <Provider store={store}>
        <AdminRouter />
      </Provider>
    </>
  );
}

export default App;




