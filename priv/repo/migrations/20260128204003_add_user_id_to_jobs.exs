defmodule Ats.Repo.Migrations.AddUserIdToJobs do
  use Ecto.Migration

  def change do
    alter table(:jobs) do
      add :user_id, references(:users, on_delete: :nilify_all)
    end

    create index(:jobs, [:user_id])
  end
end
