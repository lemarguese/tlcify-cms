import { BrowserRouter, Route, Routes } from "react-router";
import CustomerPage from "../../pages/Customer/CustomerPage.tsx";
import CustomerDetailsPage from "../../pages/CustomerDetails/CustomerDetailsPage.tsx";
import AuthorizationPage from "@/pages/Authorization/AuthorizationPage.tsx";
import ProtectedRoute from "@/layout/ProtectedRoute/ProtectedRoute.tsx";
import { Navigate } from "react-router-dom";
import TransactionsPage from "@/pages/Transactions/TransactionsPage.tsx";
import TransactionsDetailsPage from "@/pages/TransactionsDetails/TransactionsDetailsPage.tsx";
import InsurancePage from "@/pages/Insurance/InsurancePage.tsx";
import PolicyDetailPage from "@/pages/PolicyDetail/PolicyDetailPage.tsx";
import PaymentPage from "@/pages/Payment/PaymentPage.tsx";
import RenewalPage from "@/pages/Renewal/RenewalPage.tsx";

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
      <Route element={<ProtectedRoute />}>
        <Route path='/payments'>
          <Route index element={<TransactionsPage />}/>
          <Route path=':id' element={<TransactionsDetailsPage />}/>
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/insurances'>
          <Route index element={<InsurancePage />}/>
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/policy/:policyId'>
          <Route index element={<PolicyDetailPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/billing/:customerId'>
          <Route index element={<PaymentPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/renewals'>
          <Route index element={<RenewalPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path='/analytics'>
          <Route index element={<RenewalPage />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
}

export default Router;
