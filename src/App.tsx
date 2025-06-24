import 'antd/dist/reset.css'; // para Ant Design v5+
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Dashboard from "./modules/dashboard/Dashboard";
import routes from "./core/menuRoutes";
import { useState } from "react";
import AuthRoutes from "./auth/AuthRoutes";


function App() {
  const [ count, setCount ] = useState(0);
  const increment = () => setCount(count + 1);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path ='/login' element={(<p>Login</p>)} />
          <Route path="/" element={<AuthRoutes><Dashboard /></AuthRoutes>}>
            {routes.map( route => 
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} />
            )}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
