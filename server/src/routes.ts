import authRoute from "./modules/auth/auth.route";
import candidateRoute from "./modules/candidate/candidate.route";
import divisionRoute from "./modules/division/division.route";
import jobRoute from "./modules/job/job.route";

const routes = [
  {
    path: "/division",
    route: divisionRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/job",
    route: jobRoute,
  },
  {
    path: "/candidate",
    route: candidateRoute,
  },
];

export default routes;
