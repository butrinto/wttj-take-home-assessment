defmodule Ats.JobsTest do
  use Ats.DataCase

  alias Ats.Jobs

  describe "jobs" do
    alias Ats.Jobs.Job

    import Ats.JobsFixtures

    @invalid_attrs %{
      contract_type: nil,
      description: nil,
      office: nil,
      status: nil,
      title: nil
    }

    test "list_jobs/0 returns all jobs" do
      job = job_fixture()
      assert Jobs.list_jobs() |> Enum.map(& &1.id) == [job.id]
    end

    test "get_job!/1 returns the job with given id" do
      job = job_fixture()
      assert Jobs.get_job!(job.id).id == job.id
    end

    test "create_job/1 with valid data creates a job" do
      valid_attrs = %{
        contract_type: "FULL_TIME",
        description: "Elixir dev backend",
        office: "Paris",
        status: "draft",
        title: "Dev Backend",
        work_mode: "onsite"
      }

      assert {:ok, %Job{} = job} = Jobs.create_job(valid_attrs)
      assert job.contract_type == :FULL_TIME
      assert job.description == "Elixir dev backend"
      assert job.office == "Paris"
      assert job.status == :draft
      assert job.title == "Dev Backend"
      assert job.work_mode == :onsite
    end

    test "create_job/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Jobs.create_job(@invalid_attrs)
    end

    test "update_job/2 with valid data updates the job" do
      job = job_fixture()

      update_attrs = %{
        contract_type: "PART_TIME",
        description: "Elixir dev backend senior",
        office: "Barcelone",
        status: "published",
        title: "Dev Backend",
        work_mode: "hybrid"
      }

      assert {:ok, %Job{} = job} = Jobs.update_job(job, update_attrs)
      assert job.contract_type == :PART_TIME
      assert job.description == "Elixir dev backend senior"
      assert job.office == "Barcelone"
      assert job.status == :published
      assert job.title == "Dev Backend"
      assert job.work_mode == :hybrid
    end

    test "update_job/2 with invalid data returns error changeset" do
      job = job_fixture()
      assert {:error, %Ecto.Changeset{}} = Jobs.update_job(job, @invalid_attrs)
      assert job.id == Jobs.get_job!(job.id).id
    end

    test "delete_job/1 deletes the job" do
      job = job_fixture()
      assert {:ok, %Job{}} = Jobs.delete_job(job)
      assert_raise Ecto.NoResultsError, fn -> Jobs.get_job!(job.id) end
    end

    test "change_job/1 returns a job changeset" do
      job = job_fixture()
      assert %Ecto.Changeset{} = Jobs.change_job(job)
    end

    test "list_jobs/1 filters by title" do
      job1 = job_fixture(%{title: "Backend Engineer"})
      job2 = job_fixture(%{title: "Frontend Developer"})

      results = Jobs.list_jobs(%{"title" => "backend"})
      job_ids = Enum.map(results, & &1.id)

      assert job1.id in job_ids
      refute job2.id in job_ids
    end

    test "list_jobs/1 filters by office" do
      job1 = job_fixture(%{office: "Paris"})
      job2 = job_fixture(%{office: "London"})

      results = Jobs.list_jobs(%{"office" => "Paris"})
      job_ids = Enum.map(results, & &1.id)

      assert job1.id in job_ids
      refute job2.id in job_ids
    end

    test "list_jobs/1 filters by multiple params" do
      job1 = job_fixture(%{title: "Backend Engineer", office: "Paris"})
      job2 = job_fixture(%{title: "Backend Engineer", office: "London"})
      job3 = job_fixture(%{title: "Frontend Developer", office: "Paris"})

      results = Jobs.list_jobs(%{"title" => "backend", "office" => "Paris"})
      job_ids = Enum.map(results, & &1.id)

      assert job1.id in job_ids
      refute job2.id in job_ids
      refute job3.id in job_ids
    end

    test "list_published_jobs/1 filters by title and status" do
      published = job_fixture(%{title: "Backend Engineer", status: :published})
      draft = job_fixture(%{title: "Backend Engineer", status: :draft})

      results = Jobs.list_published_jobs(%{"title" => "backend"})
      job_ids = Enum.map(results, & &1.id)

      assert published.id in job_ids
      refute draft.id in job_ids
    end
  end
end
