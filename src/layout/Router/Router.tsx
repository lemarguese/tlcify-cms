import { BrowserRouter, Route, Routes } from "react-router";
import CustomerPage from "../../pages/Customer/CustomerPage.tsx";
import CustomerDetailsPage from "../../pages/CustomerDetails/CustomerDetailsPage.tsx";

const Router = () => {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<CustomerPage />} />
      <Route path='/customers'>
        <Route index element={<CustomerPage />} />
        <Route path=':id' element={<CustomerDetailsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router;
