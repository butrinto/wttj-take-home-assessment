defmodule Ats.Repo.Migrations.CreateJobModifications do
  use Ecto.Migration

  def change do
    create table(:job_modifications) do
      add :job_id, references(:jobs, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :nilify_all)
      add :field_name, :string, null: false
      add :old_value, :text
      add :new_value, :text

      timestamps(updated_at: false)
    end

    create index(:job_modifications, [:job_id])
    create index(:job_modifications, [:user_id])
  end
end
