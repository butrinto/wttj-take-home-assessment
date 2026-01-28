defmodule Ats.Jobs do
  @moduledoc """
  The Jobs context.
  """

  import Ecto.Query, warn: false
  alias Ats.Repo

  alias Ats.Jobs.Job
  alias Ats.Jobs.JobModification
  alias Ats.Professions.Profession

  @contract_types %{
    FULL_TIME: "Full-Time",
    PART_TIME: "Part-Time",
    TEMPORARY: "Temporary",
    FREELANCE: "Freelance",
    INTERNSHIP: "Internship"
  }

  @doc """
  Returns a job contract type.

  ## Examples

      iex> contract_type(%Job{contract_type: "FULL_TIME"})
      "Full-Time"

  """
  @spec contract_type(%Job{}) :: binary() | nil
  def contract_type(job) do
    @contract_types[job.contract_type]
  end

  @doc """
  Returns a job profession name.

  ## Examples

      iex> profession_name(%Job{profession: %Profession{name: "Software Engineer"}})
      "Software Engineer"
  """
  @spec profession_name(%Job{}) :: binary()
  def profession_name(%Job{profession: %Profession{name: profession_name}}) do
    profession_name
  end

  def profession_name(_job), do: ""

  @doc """
  Returns the list of jobs.

  ## Examples

      iex> list_jobs()
      [%Job{}, ...]

  """
  @spec list_jobs() :: [%Job{}]
  def list_jobs do
    Repo.all(Job) |> Repo.preload(:profession)
  end

  # Public-facing job listings should only show published jobs
  @spec list_published_jobs() :: [%Job{}]
  def list_published_jobs do
    from(j in Job, where: j.status == :published)
    |> Repo.all()
    |> Repo.preload(:profession)
  end

  @spec list_jobs(map()) :: [%Job{}]
  def list_jobs(params) when is_map(params) do
    Job
    |> filter_by_params(params)
    |> Repo.all()
    |> Repo.preload(:profession)
  end

  @spec list_published_jobs(map()) :: [%Job{}]
  def list_published_jobs(params) when is_map(params) do
    from(j in Job, where: j.status == :published)
    |> filter_by_params(params)
    |> Repo.all()
    |> Repo.preload(:profession)
  end

  defp filter_by_params(query, params) do
    query
    |> filter_by_title(params["title"])
    |> filter_by_office(params["office"])
    |> filter_by_work_mode(params["work_mode"])
    |> filter_by_contract_type(params["contract_type"])
  end

  defp filter_by_title(query, nil), do: query
  defp filter_by_title(query, title) when is_binary(title) do
    from j in query, where: ilike(j.title, ^"%#{title}%")
  end

  defp filter_by_office(query, nil), do: query
  defp filter_by_office(query, office) when is_binary(office) do
    from j in query, where: ilike(j.office, ^"%#{office}%")
  end

  defp filter_by_work_mode(query, nil), do: query
  defp filter_by_work_mode(query, work_mode) when is_binary(work_mode) do
    from j in query, where: j.work_mode == ^String.to_existing_atom(work_mode)
  end

  defp filter_by_contract_type(query, nil), do: query
  defp filter_by_contract_type(query, contract_type) when is_binary(contract_type) do
    from j in query, where: j.contract_type == ^String.to_existing_atom(contract_type)
  end

  @doc """
  Gets a single job.

  Raises `Ecto.NoResultsError` if the Job does not exist.

  ## Examples

      iex> get_job!(123)
      %Job{}

      iex> get_job!(456)
      ** (Ecto.NoResultsError)

  """
  @spec get_job!(integer() | binary()) :: %Job{}
  def get_job!(id), do: Repo.get!(Job, id) |> Repo.preload(applicants: [:candidate])

  @doc """
  Creates a job.

  ## Examples

      iex> create_job(%{field: value})
      {:ok, %Job{}}

      iex> create_job(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_job(map()) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def create_job(attrs \\ %{}) do
    %Job{}
    |> Job.changeset(attrs)
    |> Repo.insert()
  end

@doc """
  Updates a job and logs modifications.
  """
  @spec update_job(%Job{}, map(), integer() | nil) ::
          {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def update_job(%Job{} = job, attrs, user_id \\ nil) do
    changeset = Job.changeset(job, attrs)

    if changeset.valid? do
      Ecto.Multi.new()
      |> Ecto.Multi.update(:job, changeset)
      |> Ecto.Multi.run(:log_changes, fn _repo, %{job: updated_job} ->
        log_job_modifications(job, updated_job, user_id)
        {:ok, updated_job}
      end)
      |> Repo.transaction()
      |> case do
        {:ok, %{job: job}} -> {:ok, job}
        {:error, :job, changeset, _} -> {:error, changeset}
      end
    else
      {:error, changeset}
    end
  end

  defp log_job_modifications(old_job, new_job, user_id) do
    fields = [:title, :description, :office, :contract_type, :status, :work_mode]

    Enum.each(fields, fn field ->
      old_value = Map.get(old_job, field)
      new_value = Map.get(new_job, field)

      if old_value != new_value do
        %JobModification{}
        |> JobModification.changeset(%{
          job_id: new_job.id,
          user_id: user_id,
          field_name: to_string(field),
          old_value: to_string(old_value),
          new_value: to_string(new_value)
        })
        |> Repo.insert()
      end
    end)
  end

  @doc """
  Deletes a job.

  ## Examples

      iex> delete_job(job)
      {:ok, %Job{}}

      iex> delete_job(job)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_job(%Job{}) :: {:ok, %Job{}} | {:error, Ecto.Changeset.t()}
  def delete_job(%Job{} = job) do
    Repo.delete(job)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking job changes.

  ## Examples

      iex> change_job(job)
      %Ecto.Changeset{data: %Job{}}

  """
  @spec change_job(%Job{}, map()) :: Ecto.Changeset.t()
  def change_job(%Job{} = job, attrs \\ %{}) do
    Job.changeset(job, attrs)
  end

  @doc """
  Returns the list of modifications for a job.
  """
  @spec list_job_modifications(integer() | binary()) :: [%JobModification{}]
  def list_job_modifications(job_id) do
    from(m in JobModification,
      where: m.job_id == ^job_id,
      order_by: [desc: m.inserted_at],
      preload: [:user]
    )
    |> Repo.all()
  end

end
