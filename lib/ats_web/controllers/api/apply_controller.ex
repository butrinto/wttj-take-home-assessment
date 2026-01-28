defmodule AtsWeb.Api.ApplyController do
  use AtsWeb, :controller

  alias Ats.Applicants
  alias Ats.Jobs
  alias Ats.Repo
  alias Ats.Candidates.Candidate
  alias Ats.Applicants.Applicant
  import Ecto.Query

  action_fallback AtsWeb.FallbackController

  @doc """
  Create a new job application.

  Expects application parameters in the request body. Returns success message with job ID.
  """
  @spec create(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def create(conn, %{"job_id" => job_id, "apply" => apply_params}) do
    job = Jobs.get_job!(job_id)

    # Check if candidate with this email or phone already applied to this job
    email = apply_params["email"]
    phone = apply_params["phone"]

    duplicate_application =
      from(a in Applicant,
        join: c in Candidate, on: c.id == a.candidate_id,
        where: a.job_id == ^job_id and (c.email == ^email or c.phone == ^phone),
        limit: 1
      )
      |> Repo.one()

    if duplicate_application do
      conn
      |> put_status(:unprocessable_entity)
      |> json(%{
        errors: %{
          application: ["You have already applied to this job with this email or phone number"]
        }
      })
    else
      case Applicants.create_apply(Map.merge(apply_params, %{"job_id" => job_id})) do
        {:ok, _apply} ->
          conn
          |> put_status(:created)
          |> json(%{
            data: %{
              message: "Application submitted successfully",
              job_id: job.id
            }
          })

        {:error, %Ecto.Changeset{} = changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> json(%{errors: translate_errors(changeset)})
      end
    end
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Regex.replace(~r"%{(\w+)}", msg, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end
end
