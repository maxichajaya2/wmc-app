import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Loader } from "@/shared";
import { ROUTES_PATHS } from "@/constants";

// LAZY LOAD LAYOUTS
const AuthIntranetLayout = lazy(() => import("@/layouts/AuthIntranetLayout"));
const AuthBackOfficeLayout = lazy(() => import("@/layouts/AuthBackOfficeLayout"));
const IntranetLayout = lazy(() => import("@/layouts/intranet/IntranetLayout"));
const DashboardLayout = lazy(
  () => import("@/layouts/back-office/DashboardLayout")
);
// LAZY LOAD PAGES USER
const Login = lazy(() => import("@/modules/intranet/auth/login/page"));
const Register = lazy(() => import("@/modules/intranet/auth/register/page"));
const ConfirmRegister = lazy(() =>
  import("@/modules/intranet/auth/confirm-register/page")
);
const Profile = lazy(() => import("@/modules/intranet/profile/page"));
const TechnicalWorkTray = lazy(() =>
  import("@/modules/intranet/technical-work-tray/page")
);
// LAZY LOAD PAGES ADMIN
const LoginAuth = lazy(() => import("@/modules/back-office/auth/page"));
const Dashboard = lazy(() => import("@/modules/back-office/dashboard/page"));
const Users = lazy(() => import("@/modules/back-office/users/page"));
const Roles = lazy(() => import("@/modules/back-office/roles/page"));
const UsersWeb = lazy(() => import("@/modules/back-office/users-web/page"));
const Categories = lazy(() => import("@/modules/back-office/category/page"));
const Topics = lazy(() => import("@/modules/back-office/topics/page"));
const TechnicalWorks = lazy(() => import("@/modules/back-office/papers/page"));

const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  // Redirect from root to login
  {
    path: ROUTES_PATHS.HOME,
    element: <Navigate to={ROUTES_PATHS.LOGIN} replace />,
  },
  {
    path: ROUTES_PATHS.ADMIN,
    element: <Navigate to={ROUTES_PATHS.LOGIN_ADMIN} replace />,
  },
  {
    path: ROUTES_PATHS.CONFIRM_REGISTER,
    element: lazyLoad(ConfirmRegister),
  },
  // AUTH USER
  {
    element: lazyLoad(AuthIntranetLayout),
    children: [
      { path: ROUTES_PATHS.LOGIN, element: lazyLoad(Login) },
      { path: ROUTES_PATHS.REGISTER, element: lazyLoad(Register) },
    ],
  },
  // AUTH ADMIN
  {
    element: lazyLoad(AuthBackOfficeLayout),
    children: [
      { path: ROUTES_PATHS.LOGIN_ADMIN, element: lazyLoad(LoginAuth) },
    ],
  },
  // USER ROUTES
  {
    element: lazyLoad(IntranetLayout),
    children: [
      { path: ROUTES_PATHS.TECHNICAL_WORK_TRAY, element: lazyLoad(TechnicalWorkTray) },
      { path: ROUTES_PATHS.PROFILE, element: lazyLoad(Profile) },
    ],
  },
  // Dashboard routes
  {
    element: lazyLoad(DashboardLayout),
    children: [
      { path: ROUTES_PATHS.DASHBOARD, element: lazyLoad(Dashboard) },
      { path: ROUTES_PATHS.USERS, element: lazyLoad(Users) },
      { path: ROUTES_PATHS.ROLES, element: lazyLoad(Roles) },
      { path: ROUTES_PATHS.WEB_USERS, element: lazyLoad(UsersWeb) },
      { path: ROUTES_PATHS.CATEGORIES, element: lazyLoad(Categories) },
      { path: ROUTES_PATHS.TOPICS, element: lazyLoad(Topics) },
      { path: ROUTES_PATHS.TECHINICAL_WORKS, element: lazyLoad(TechnicalWorks) },
    ],
  },
  // TODO: Add 404 page
  // { path: '*', element: lazyLoad(NotFound) },
];