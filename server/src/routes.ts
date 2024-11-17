import authRoute from "./modules/auth/auth.route";
import divisionRoute from "./modules/division/division.route";

const routes = [
  {
    path: "/division",
    route: divisionRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
];

export default routes;
