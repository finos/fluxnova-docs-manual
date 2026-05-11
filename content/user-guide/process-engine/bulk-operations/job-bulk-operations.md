---
title: "Bulk Activate/Suspend Jobs"
weight: 20
menu:
  main:
    identifier: "user-guide-process-engine-bulk-operations-job-bulk-operations"
    parent: "user-guide-process-engine-bulk-operations"
---

Bulk activate/suspend job operations allow applying the same state change (suspend or activate) to **multiple jobs** in a single request.
They are useful when clients need to update large sets of jobs efficiently and still get a detailed outcome per job.

{{< note title="REST API details" class="info" >}}
This page explains the feature from a usage perspective and intentionally avoids endpoint-level REST reference details
(full URL lists, complete request/response schemas, parameter tables, etc.).
{{< /note >}}

# When to use bulk activate/suspend job operations

Bulk activate/suspend is a good fit if you need to:

* suspend a set of jobs during operational maintenance (for example, temporarily pausing retries)
* reactivate suspended jobs after an incident or maintenance window
* apply the same state change to many jobs as part of automation (for example, in response to external signals)
* update job states efficiently while still understanding which individual jobs succeeded or failed

If you only need to change the state of a single job, use the corresponding single-job operation.

# Common behavior

## Independent processing and partial failures

Bulk requests are processed **job-by-job**.
This means one failing item (for example, a job id that does not exist, or an invalid input entry) does not necessarily prevent other items from succeeding.

Clients should always evaluate the **per-job results** returned by the bulk operation.

## Limits and validation

To protect the engine, bulk operations should enforce limits (for example, a maximum number of jobs per request).
Invalid requests should fail fast (for example, missing job ids, malformed payloads, or exceeding limits).

{{< note title="Recommendation" class="info" >}}
For predictable behavior, avoid sending duplicate job ids in the same request.
{{< /note >}}

### Input validation expectations

Typical validation checks include:

* job id must not be empty
* job id must not be `null`
* job id list must not be empty

Depending on API contract, some validations may lead to:
* **request-level failure** (fail fast), or
* **per-item failures** while continuing with other items

(See the scenarios section for typical client-visible outcomes.)

# REST API behavior (high-level)

Bulk activate/suspend uses a **single endpoint** for both operations; the request flag `suspended` determines whether the jobs are suspended or activated.

A typical result entry contains:

* `jobId`
* `status` (for example `success` or `failure`)
* `errorMessage` (present when a job failed)

Example:

```json
[
  { "jobId": "firstJobId",  "status": "success", "errorMessage": null },
  { "jobId": "secondJobId", "status": "failure", "errorMessage": "Job not found" }
]
```

{{< note title="Partial success handling" class="info" >}}
In bulk operations, success is determined per job.
Do not assume that the overall request succeeded for every job when you receive a successful HTTP response.
Always inspect the returned result list.
{{< /note >}}

## Expected HTTP response codes (status-only)
This bulk operation returns **HTTP status only** (no response body).

* **200 OK**: successful activation/suspension
* **404 Not Found**: job id doesn't exist
* **400 Bad Request**: invalid job ids like `null`, blank, or empty

# Supported operations

The following sections describe the available bulk job state operations conceptually.

## Suspend jobs in bulk

Use bulk suspend when a set of jobs should be prevented from being executed temporarily (for example, during maintenance, investigation, or controlled throttling).

Typical usage pattern:

1. Provide a list of job ids to suspend.
2. The engine validates each job id and resolves job details independently.
3. The engine suspends each job that exists and can be modified.
4. Evaluate the per-job results and handle failures selectively.

## Activate jobs in bulk

Use bulk activate when previously suspended jobs should be restored to active execution.

Typical usage pattern:

1. Provide a list of job ids to activate.
2. The engine validates each job id and resolves job details independently.
3. The engine activates each job that exists and can be modified.
4. Evaluate the per-job results and handle failures selectively.

# Scenarios

This section outlines typical client-visible scenarios for bulk activate/suspend jobs.

## Scenario 1: Successful job status update

**Expected behavior:**

* Before suspend: job is visible/active in Cockpit
* After suspend: job appears suspended in Cockpit
* After resume (activate): job returns to active state in Cockpit

**Client guidance:**
Always validate the per-job result list to confirm that each job transitioned to the intended state.

## Scenario 2: Job id doesn't exist

A provided job id does not map to any known job.

**Expected behavior:**
Client receives **404 Not Found**.

* The result entry for that job id indicates `failure`
* `errorMessage` explains the issue (for example, `"Job not found"`)

Other valid job ids in the same request may still succeed.

## Scenario 3: Failure scenarios (generic error message for client to verify input)

A provided job id is empty / blank.

**Expected behavior:**
Client receives **400 Bad Request**.

* The result entry indicates `failure`
* `errorMessage` is intentionally generic enough to prompt client-side verification of input
  (for example, `"Invalid job id"`)

## Scenario 4: Job ids list is empty

Request includes a list with no job ids.

**Expected behavior (fail fast):**
Client receives **400 Bad Request**.

* The request is rejected because there is no work to perform
* Client receives a validation error response indicating the list must not be empty

## Scenario 5: Job id given as null

Request includes a `null` job id entry.

**Expected behavior:**
Client receives **400 Bad Request**.

* The `null` entry fails validation (per-item failure or request-level failure depending on contract)
* If processed per-item, the corresponding result indicates `failure` with an input validation message

# Operational considerations

## Client behavior

* Treat bulk operations as “some may fail”; use smaller batches if needed.
* When receiving a failure response, correct the request and retry rather than blindly retrying.

## Permissions and auditing

Bulk activate/suspend operations should apply the same authorization rules as the equivalent single-job operation.
If your environment requires auditing, ensure both successful and failed items are traceable (for example, by capturing the request context and correlating client logs with server logs).

## Reference
Fluxnova issue: `finos/fluxnova-bpm-platform#46`