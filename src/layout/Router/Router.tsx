import { BrowserRouter, Route, Routes } from "react-router";
import CustomerPage from "../../pages/Customer/CustomerPage.tsx";
import CustomerDetailsPage from "../../pages/CustomerDetails/CustomerDetailsPage.tsx";
import AuthorizationPage from "@/pages/Authorization/AuthorizationPage.tsx";
import ProtectedRoute from "@/layout/ProtectedRoute/ProtectedRoute.tsx";
import { Navigate } from "react-router-dom";
import TransactionsPage from "@/pages/Transactions/TransactionsPage.tsx";
import InvoiceDetailsPage from "@/pages/InvoiceDetails/InvoiceDetailsPage.tsx";
import InsurancePage from "@/pages/Insurance/InsurancePage.tsx";
import PolicyDetailPage from "@/pages/PolicyDetail/PolicyDetailPage.tsx";
import PaymentPage from "@/pages/Payment/PaymentPage.tsx";
import RenewalPage from "@/pages/Renewal/RenewalPage.tsx";
import AnalyticsPage from "@/pages/Analytics/AnalyticsPage.tsx";
import SettingsPage from "@/pages/Settings/SettingsPage.tsx";
import ForbiddenPage from "@/pages/Forbidden/ForbiddenPage.tsx";
import TransactionsDetailsPage from '@/pages/TransactionsDetails/TransactionsDetailsPage.tsx'
import { permissions } from "@/pages/Settings/utils/settings.tsx";
import UsersPage from "@/pages/Users/UsersPage.tsx";
import InvitationPage from "@/pages/Invitation/InvitationPage.tsx";
import PaymentSuccessfulPage from "@/pages/PaymentSuccessfulPage/PaymentSuccessfulPage.tsx";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/customers"/>}/>
        <Route path="/login" element={<AuthorizationPage/>}/>

        {/* Protected routes */}
        <Route element={<ProtectedRoute requiredPermissions={["read_users", 'invite_users']}/>}>
          <Route path='/users' element={<UsersPage/>}/>
        </Route>

        <Route
          element={<ProtectedRoute requiredPermissions={["read_customers", 'read_customer_details']}/>}>
          <Route path="/customers">
            <Route index element={<CustomerPage/>}/>
            <Route path=":customerId" element={<CustomerDetailsPage/>}/>
          </Route>
        </Route>

        <Route
          element={<ProtectedRoute requiredPermissions={["read_customers", 'read_customer_details', 'read_policy']}/>}>
          <Route path="/customers/:customerId/policy/:policyId" element={<PolicyDetailPage/>}/>
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={["read_payments"]}/>}>
          <Route path="/payments">
            <Route index element={<TransactionsPage/>}/>
            <Route path=':paymentId' element={<TransactionsDetailsPage/>}/>
          </Route>
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={["create_insurances"]}/>}>
          <Route path="/insurances" element={<InsurancePage/>}/>
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={["read_policy"]}/>}>
          <Route path="/policy/:policyId" element={<PolicyDetailPage/>}/>
        </Route>

        <Route path="/billing/:invoiceId" element={<PaymentPage/>}/>
        <Route path="/billing/:invoiceId/success" element={<PaymentSuccessfulPage/>}/>

        <Route element={<ProtectedRoute requiredPermissions={["read_renewals"]}/>}>
          <Route path="/renewals" element={<RenewalPage/>}/>
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={["read_analytics"]}/>}>
          <Route path="/analytics" element={<AnalyticsPage/>}/>
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={["read_invoices"]}/>}>
          <Route path="/invoice/:invoiceId" element={<InvoiceDetailsPage/>}/>
        </Route>

        <Route path='/invite/:invitationToken' element={<InvitationPage/>}/>

        <Route element={<ProtectedRoute requiredPermissions={["update_settings"]}/>}>
          <Route path="/settings" element={<SettingsPage/>}/>
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={permissions}/>}>
          <Route path="/forbidden" element={<ForbiddenPage/>}/>
        </Route>

        <Route path="*" element={<Navigate to='/forbidden'/>}/>
      </Routes>
    </BrowserRouter>
  )
};

export default Router;
