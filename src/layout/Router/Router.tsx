import { createBrowserRouter, RouterProvider } from "react-router";
import CustomerPage from "../../pages/Customer/CustomerPage.tsx";
import CustomerDetailsPage from "../../pages/CustomerDetails/CustomerDetailsPage.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    Component: CustomerDetailsPage,
    children: [
      {
        path: 'customers', Component: CustomerPage, children: [
          { path: ':id', Component: CustomerDetailsPage }
        ]
      },
    ],
  }
])

const Router = () => {
  return <RouterProvider router={router}/>
}

export default Router;
