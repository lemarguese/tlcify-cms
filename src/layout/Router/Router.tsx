import { BrowserRouter, Route, Routes } from "react-router";
import CustomerPage from "../../pages/Customer/CustomerPage.tsx";
import CustomerDetailsPage from "../../pages/CustomerDetails/CustomerDetailsPage.tsx";
import AuthorizationPage from "@/pages/Authorization/AuthorizationPage.tsx";
import ProtectedRoute from "@/layout/ProtectedRoute/ProtectedRoute.tsx";
import { Navigate } from "react-router-dom";

const Router = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<Navigate to='/customers' />}/>
      <Route path='/login' element={<AuthorizationPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/customers'>
          <Route index element={<CustomerPage />} />
          <Route path=':id' element={<CustomerDetailsPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router;
