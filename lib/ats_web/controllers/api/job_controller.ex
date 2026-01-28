defmodule AtsWeb.Api.JobController do
  use AtsWeb, :controller

  alias Ats.Jobs
  alias Ats.Jobs.Job

  action_fallback AtsWeb.FallbackController

  @doc """
  List all jobs.
  """
  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, params) do
    # Authorised users see all jobs; public users see only published. Both can filter by search params.
    jobs =
      if conn.assigns[:current_user] do
        Jobs.list_jobs(params)
      else
        Jobs.list_published_jobs(params)
      end

    render(conn, :index, jobs: jobs)
  end

  @doc """
  Create a new job.

  Expects job parameters in the request body. Returns the created job.
  """
  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, %{"job" => job_params}) do
    user_id = if conn.assigns[:current_user], do: conn.assigns[:current_user].id, else: nil
    job_params_with_user = Map.put(job_params, "user_id", user_id)

    with {:ok, %Job{} = job} <- Jobs.create_job(job_params_with_user) do
      conn
      |> put_status(:created)
      |> render(:show, job: job)
    end
  end

  @doc """
  Get a single job by ID.
  """
  @spec show(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def show(conn, %{"id" => id}) do
    job = Jobs.get_job!(id)
    render(conn, :show, job: job)
  end

  @doc """
  Get applications for a job by ID.
  """
  @spec applications(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def applications(conn, %{"id" => id}) do
    job = Jobs.get_job!(id)
    applicants = Ats.Repo.preload(job, applicants: [:candidate]).applicants

    render(conn, :applications, applicants: applicants)
  end

  @doc """
  Get modifications for a job by ID.
  """
  @spec modifications(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def modifications(conn, %{"id" => id}) do
    modifications = Jobs.list_job_modifications(id)

    render(conn, :modifications, modifications: modifications)
  end

  @doc """
  Update a job by ID.

  Expects job parameters in the request body. Returns the updated job.
  """
  @spec update(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def update(conn, %{"id" => id, "job" => job_params}) do
    job = Jobs.get_job!(id)
    user_id = if conn.assigns[:current_user], do: conn.assigns[:current_user].id, else: nil

    with {:ok, %Job{} = job} <- Jobs.update_job(job, job_params, user_id) do
      render(conn, :show, job: job)
    end
  end

  @doc """
  Delete a job by ID.
  """
  @spec delete(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def delete(conn, %{"id" => id}) do
    job = Jobs.get_job!(id)

    with {:ok, %Job{}} <- Jobs.delete_job(job) do
      send_resp(conn, :no_content, "")
    end
  end
end
