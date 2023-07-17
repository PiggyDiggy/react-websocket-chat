import { useSelector } from "react-redux";

import type { RootState } from "./store";
import { Chat } from "./pages/Chat";
import { Login } from "./pages/Login";

const App = () => {
  const loggedIn = useSelector((state: RootState) => state.self.loggedIn);

  return loggedIn ? <Chat /> : <Login />;
};

export default App;
