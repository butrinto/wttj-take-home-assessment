defmodule AtsWeb.Api.JobControllerTest do
  use AtsWeb.ConnCase
  import Ats.JobsFixtures
  import Ats.AccountsFixtures

  describe "index" do
    test "unauthenticated user sees only published jobs", %{conn: conn} do
      published_job = job_fixture(%{status: :published})
      draft_job = job_fixture(%{status: :draft})

      conn = get(conn, ~p"/api/jobs")
      response_jobs = json_response(conn, 200)["data"]
      job_ids = Enum.map(response_jobs, & &1["id"])

      assert published_job.id in job_ids
      refute draft_job.id in job_ids
    end

    test "authenticated user sees all jobs", %{conn: conn} do
      user = user_fixture()
      token = Phoenix.Token.sign(AtsWeb.Endpoint, "user auth", user.id)
      conn = put_req_header(conn, "authorization", "Bearer #{token}")

      published_job = job_fixture(%{status: :published})
      draft_job = job_fixture(%{status: :draft})

      conn = get(conn, ~p"/api/jobs")
      response_jobs = json_response(conn, 200)["data"]
      job_ids = Enum.map(response_jobs, & &1["id"])

      assert published_job.id in job_ids
      assert draft_job.id in job_ids
    end
  end
end
