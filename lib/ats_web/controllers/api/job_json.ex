defmodule AtsWeb.Api.JobJSON do
  @moduledoc "JSON rendering for Job resources."

  alias Ats.Jobs.Job
  alias Ats.Jobs

  @doc """
  Renders a list of jobs.
  """
  @spec index(%{jobs: [%Job{}]}) :: %{data: [map()]}
  def index(%{jobs: jobs}) do
    %{data: for(job <- jobs, do: data(job))}
  end

  @doc """
  Renders a single job.
  """
  @spec show(%{job: %Job{}}) :: %{data: map()}
  def show(%{job: job}) do
    %{data: data(job)}
  end

  @doc """
  Renders applications for a job.
  """
  @spec applications(%{applicants: [map()]}) :: %{data: [map()]}
  def applications(%{applicants: applicants}) do
    %{
      data: Enum.map(applicants, fn applicant ->
        %{
          id: applicant.id,
          application_date: applicant.application_date,
          salary_expectation: applicant.salary_expectation,
          status: applicant.status,
          candidate_name: applicant.candidate.full_name,
          candidate_email: applicant.candidate.email
        }
      end)
    }
  end

  @spec data(%Job{}) :: map()
  defp data(%Job{} = job) do
    %{
      id: job.id,
      title: job.title,
      description: job.description,
      contract_type: Jobs.contract_type(job),
      office: job.office,
      status: job.status,
      work_mode: job.work_mode,
      profession_id: job.profession_id,
      inserted_at: job.inserted_at,
      updated_at: job.updated_at
    }
  end
end
