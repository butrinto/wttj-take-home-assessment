defmodule Ats.Repo.Migrations.UpdateApplicantsJobForeignKey do
  use Ecto.Migration

  def up do
    # Drop the old constraint
    execute "ALTER TABLE applicants DROP CONSTRAINT applicants_job_id_fkey"

    # Add the new constraint with CASCADE delete
    alter table(:applicants) do
      modify :job_id, references(:jobs, on_delete: :delete_all)
    end
  end

  def down do
    # Rollback: restore the old behavior
    execute "ALTER TABLE applicants DROP CONSTRAINT applicants_job_id_fkey"

    alter table(:applicants) do
      modify :job_id, references(:jobs, on_delete: :nothing)
    end
  end
end
