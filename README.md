# Technical Test for Fullstack Developer - Application Tracking System

Welcome to the Fullstack Developer Job Application Tracking System! This REST API backend, built with Elixir Phoenix, is designed to assist in conducting technical tests for fullstack developer candidates.

This application is a simplified job board.
An unregistered user is able to list all jobs and can apply to a job.
It provides a platform to manage job offers and track candidate information.

A registered user can create, edit, and delete job offers.
On each job offer, a registered user can see the list of candidates who have applied to the job.

## Repository Structure

This is a monorepo containing both backend and frontend:

- **Backend (root):** Phoenix/Elixir REST API
- **Frontend (`/frontend`):** React 19 application with TypeScript

## Installation

1. Clone the repository
2. Navigate to the project directory: `cd technical-test-fullstack-main`
3. Install language versions and dependencies:

   We suggest you use asdf (or another version manager) to manage Erlang, Elixir and Node versions.

   To install asdf, visit <http://asdf-vm.com/guide/getting-started.html>.

   Add the required plugins:

   ```bash
   asdf plugin add erlang https://github.com/asdf-vm/asdf-erlang.git
   asdf plugin add elixir https://github.com/asdf-vm/asdf-elixir.git
   asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
   ```

   Then install the versions specified in the `.tool-versions` file:

   ```bash
   asdf install
   ```

   You can now install the Elixir dependencies:

   ```bash
   mix deps.get
   ```

4. Set up the database and update the configuration in `config/dev.exs` or start a Docker container with the `docker-compose.yml` file included in the project.
5. Create and migrate the database: `mix ecto.setup`
6. Run the tests: `mix test`
7. Start the Phoenix server: `mix phx.server`
8. Frontend Setup:

   ```bash
   cd frontend
   corepack enable
   yarn install
   yarn dev  # Starts on http://localhost:5173
   ```

## Exercise

We are glad to introduce you to this technical test which will help us better understand your skills and competencies related to our tech stack. In this exercise, we will use our in-house built Applicant Tracking System (ATS) application developed with Phoenix Elixir and React.

The goal of this test is to simulate real-world scenarios where you will need to add new features to an existing application and fix some bugs. You have to implement at least 1 backend feature, 1 bug fix, and complete the frontend requirements. Your work will be evaluated based on your approach, your understanding of the problem and the quality of your code.

### Backend Features

Here are three potential features you could add:

1. **Job search function:** Add a feature that allows all users to search for jobs. This should include being able to search using various parameters like job title, office, work_mode, etc. You have to implement the backend functionality.

2. **Modification log:** Implement a change log for each job update. The system should keep track of who made a modification, as well as the fields and values that were changed. You have to implement the backend functionality.

3. **Application notifications:** Whenever a user applies for a job, the job's creator should receive an email notifying them of this new application. You do not need to actually send an email in the development environment. It is sufficient to simulate or mock this functionality in some way.

### Backend Bugs

Here are some bugs you might fix:

1. **Job visibility:** Currently, all job postings are visible to all users, regardless of their status. The expected behavior is that only job postings with a status of "published" should be visible to non-logged in users.

2. **Deleting job postings:** As a recruiter (registered user), it is currently impossible to delete a job posting if someone has already applied. We want recruiters to have the ability to delete a job posting, even if there are applicants.

3. **Application duplication:** Users are currently able to apply to the same job multiple times. We need to implement a restriction to prevent multiple applications to the same job by the same user.

### Frontend Requirements

The frontend folder contains a basic React 19 + TypeScript setup with a minimal routing structure and placeholder views. **You are required to complete the following:**

1. **Implement at least one view using Welcome UI:**

   The routing is already set up with three placeholder pages. Choose and implement **at least one** of them using `welcome-ui` components (already installed):

   - **Job List Page (`/`):** Display all jobs with proper styling and a search
   - **Job Detail Page (`/jobs/:id`):** Show complete job information (including modification log)
   - **Job Creation Form (`/jobs/new`):** Form to create a new job posting

2. **Fix the TypeScript Bug:**

   There is a TypeScript type issue in one of the frontend files that needs to be fixed. The application may compile, but the types are incorrect and could lead to runtime errors. Identify and fix this issue.

3. **Testing:**

   - Write at least **2 meaningful unit tests** using the provided test setup (Vitest + React Testing Library)
   - Test should cover important functionality (component behavior, user interactions, etc.)
   - Tests should pass: `yarn test`

### Evaluation Criteria

**Backend (40%):**

- Code quality and organization
- Proper use of Phoenix/Elixir patterns and conventions
- Database design and query optimization
- Error handling and edge cases
- Test coverage

**Frontend (40%):**

- React best practices and component architecture
- Proper use of hooks and state management
- Code organization and reusability
- UI/UX quality with welcome-ui
- Testing quality and coverage
- TypeScript usage and type safety

**Overall (20%):**

- Git commit history and messages
- Code documentation and comments
- Problem-solving approach
- Attention to requirements

### Notes

- Take your time and demonstrate your abilities
- Focus on code quality over quantity
- Don't hesitate to add comments explaining your decisions
- If you run out of time, prioritize completing the required tasks over optional ones
- You can add additional libraries if needed, but justify your choices

Happy coding and good luck!
