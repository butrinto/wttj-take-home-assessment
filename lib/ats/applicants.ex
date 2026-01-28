defmodule Ats.Applicants do
  @moduledoc """
  The Applicants context.
  """

  import Ecto.Query, warn: false

  alias Ats.Repo
  alias Ats.Applicants.Applicant
  alias Ats.Applicants.Apply
  alias Ats.Jobs
  require Logger

  @doc """
  Returns the list of applicants.

  ## Examples

      iex> list_applicants()
      [%Applicant{}, ...]

  """
  @spec list_applicants() :: [%Applicant{}]
  def list_applicants do
    Repo.all(Applicant)
  end

  @doc """
  Gets a single applicant.

  Raises `Ecto.NoResultsError` if the Applicant does not exist.

  ## Examples

      iex> get_applicant!(123)
      %Applicant{}

      iex> get_applicant!(456)
      ** (Ecto.NoResultsError)

  """
  @spec get_applicant!(integer() | binary()) :: %Applicant{}
  def get_applicant!(id), do: Repo.get!(Applicant, id)

  @doc """
  Creates a applicant.

  ## Examples

      iex> create_applicant(%{field: value})
      {:ok, %Applicant{}}

      iex> create_applicant(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_applicant(map()) :: {:ok, %Applicant{}} | {:error, Ecto.Changeset.t()}
  def create_applicant(attrs \\ %{}) do
    %Applicant{}
    |> Applicant.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a applicant.

  ## Examples

      iex> update_applicant(applicant, %{field: new_value})
      {:ok, %Applicant{}}

      iex> update_applicant(applicant, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec update_applicant(%Applicant{}, map()) ::
          {:ok, %Applicant{}} | {:error, Ecto.Changeset.t()}
  def update_applicant(%Applicant{} = applicant, attrs) do
    applicant
    |> Applicant.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a applicant.

  ## Examples

      iex> delete_applicant(applicant)
      {:ok, %Applicant{}}

      iex> delete_applicant(applicant)
      {:error, %Ecto.Changeset{}}

  """
  @spec delete_applicant(%Applicant{}) :: {:ok, %Applicant{}} | {:error, Ecto.Changeset.t()}
  def delete_applicant(%Applicant{} = applicant) do
    Repo.delete(applicant)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking applicant changes.

  ## Examples

      iex> change_applicant(applicant)
      %Ecto.Changeset{data: %Applicant{}}

  """
  @spec change_applicant(%Applicant{}, map()) :: Ecto.Changeset.t()
  def change_applicant(%Applicant{} = applicant, attrs \\ %{}) do
    Applicant.changeset(applicant, attrs)
  end

  @doc """
  Creates an applicant and candidate together in a transaction.

  ## Examples

      iex> create_apply(%{field: value})
      {:ok, %{candidate: %{}, applicant: %{}}}

      iex> create_apply(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  @spec create_apply(map()) ::
          {:ok, map()}
          | {:error, Ecto.Changeset.t()}

  def create_apply(attrs \\ %{}) do
    changeset = Apply.changeset(%Apply{}, attrs)
    if changeset.valid? do
      candidate = Apply.to_candidate(changeset)
      job_id = attrs["job_id"]

      Ecto.Multi.new()
      |> Ecto.Multi.insert(:candidate, candidate)
      |> Ecto.Multi.insert(:applicant, fn %{candidate: %{id: candidate_id}} ->
        attrs
        |> Map.merge(%{"candidate_id" => candidate_id})
        |> Map.update!("job_id", &String.to_integer(&1))
        |> Applicant.new_changeset()
      end)
      |> Ecto.Multi.run(:send_notification, fn _repo, %{candidate: candidate, applicant: applicant} ->
        send_application_notification(job_id, candidate)
        {:ok, :notification_sent}
      end)
      |> Ats.Repo.transaction()
      |> case do
        {:ok, %{candidate: candidate, applicant: applicant}} ->
          {:ok, %{candidate: candidate, applicant: applicant}}
        {:error, _} ->
          {:error, changeset}
      end
    else
      # Annotate the action so the UI shows errors
      changeset = %{changeset | action: :create}
      {:error, changeset}
    end
  end

  defp send_application_notification(job_id, candidate) do
    job = Jobs.get_job!(job_id) |> Repo.preload(:user)

    if job.user do
      # Mock email notification log
      Logger.info("""
      --> EMAIL NOTIFICATION
      To: #{job.user.email}
      Subject: New Application for #{job.title}

      Job: #{job.title}
      Applicant: #{candidate.full_name}
      Email: #{candidate.email}
      Phone: #{candidate.phone}
      """)
    else
      Logger.warning("Job #{job_id} has no associated user - cannot send notification")
    end
  end
end
