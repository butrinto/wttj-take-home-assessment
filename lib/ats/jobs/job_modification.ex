defmodule Ats.Jobs.JobModification do
  @moduledoc """
  Schema for tracking job modifications/changes.
  """
  use Ecto.Schema
  import Ecto.Changeset

  alias Ats.Jobs.Job
  alias Ats.Accounts.User

  schema "job_modifications" do
    field :field_name, :string
    field :old_value, :string
    field :new_value, :string

    belongs_to :job, Job
    belongs_to :user, User

    timestamps(updated_at: false)
  end

  @doc false
  def changeset(job_modification, attrs) do
    job_modification
    |> cast(attrs, [:job_id, :user_id, :field_name, :old_value, :new_value])
    |> validate_required([:job_id, :field_name])
  end
end
