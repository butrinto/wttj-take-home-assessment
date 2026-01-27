import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JobList } from "./pages/JobList";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { SignOut } from "./pages/SignOut";

import "./index.css";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signout" element={<SignOut />} />

        <Route path="/" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobList />} />
        <Route path="/jobs/new" element={<JobList />} />
        <Route path="/jobs/:jobId/apply" element={<JobList />} />
        <Route path="/jobs/:id/edit" element={<JobList />} />
      </Routes>
    </BrowserRouter>
  );
};
