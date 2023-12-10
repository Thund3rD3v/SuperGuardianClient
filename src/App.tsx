import { useRecoilValue } from "recoil";
import authState from "./atoms/auth";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

function App() {
  const auth = useRecoilValue(authState);

  if (auth.valid) {
    return <Dashboard />;
  }

  return <Login />;
}

export default App;
