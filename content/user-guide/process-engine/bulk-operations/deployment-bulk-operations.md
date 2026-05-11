---
title: "Bulk Delete Deployments"
weight: 30
menu:
  main:
    identifier: "user-guide-process-engine-bulk-operations-deployment-bulk-delete"
    parent: "user-guide-process-engine-bulk-operations"
---

Bulk delete deployment operations allow deleting **multiple deployments** in a single request.
They are useful when clients need to remove sets of deployments efficiently and still get a detailed outcome per deployment.

{{< note title="REST API details" class="info" >}}
This page explains the feature from a usage perspective and intentionally avoids endpoint-level REST reference details
(full URL lists, complete request/response schemas, parameter tables, etc.).
{{< /note >}}

# When to use bulk delete deployments

Bulk delete is a good fit if you need to:

* remove many deployments as part of an automated cleanup procedure
* roll back a set of deployments created by an import or CI/CD pipeline
* delete deployments across tenants or environments (subject to authorization)
* process large lists of deployments efficiently while still understanding which individual deletes succeeded or failed

If you only need to delete a single deployment, use the corresponding single-deployment operation.

# Common behavior

## Independent processing and partial failures

Bulk requests are processed **deployment-by-deployment**.
This means one failing item (for example, a deployment id that does not exist, missing permissions, or a conflict due to referenced data) does not necessarily prevent other items from succeeding.

Clients should always evaluate the **per-deployment results** returned by the bulk operation.

## Limits and validation

To protect the engine, bulk operations should enforce limits (for example, a maximum number of deployments per request).
Invalid requests should fail fast (for example, missing deployment ids, malformed payloads, or exceeding limits).

{{< note title="Recommendation" class="info" >}}
For predictable behavior, avoid sending duplicate deployment ids in the same request.
{{< /note >}}

### Input validation expectations

Typical validation checks include:

* deployment id must not be empty
* deployment id must not be `null`
* deployment id list must not be empty

Depending on the API contract, some validations may lead to:
* **request-level failure** (fail fast), or
* **per-item failures** while continuing with other items

## Interpreting results

Bulk delete operations return per-deployment results so you can identify which deployments were deleted successfully.

A typical result entry contains:

* `deploymentId`
* `status` (for example `SUCCESS` or `FAILURE`)
* `errorMessage` (present when a deployment failed)

Example:

```json
[
  { "deploymentId": "firstDeploymentId",  "status": "SUCCESS", "errorMessage": null },
  { "deploymentId": "secondDeploymentId", "status": "FAILURE", "errorMessage": "Deployment not found" }
]
```

{{< note title="Partial success handling" class="info" >}}
In bulk operations, success is determined per deployment.
Do not assume that the overall request succeeded for every deployment when you receive a successful HTTP response.
Always inspect the returned result list.
{{< /note >}}

# Supported operation

## Delete deployments in bulk

Use bulk delete when multiple deployments must be removed together and you want a consolidated outcome.

Typical usage pattern:

1. Provide a list of deployment ids to delete.
2. Set any request flags that should apply to the delete operation.
3. The engine resolves and validates each deployment independently.
4. The engine deletes each deployment where permitted and possible.
5. Evaluate the per-item results and handle failures selectively.

{{< note title="Behavior notes" class="info" >}}
Deletion semantics (for example, cascade behavior, treatment of running instances, or referential constraints) follow the same rules as the equivalent single-deployment delete operation.
{{< /note >}}

## Request flags apply to the entire set
For bulk delete deployments, whatever request inputs/flags are set will be applicable for the **entire set**.

For example, if `skipCustomListeners=true` and `cascade=true`, those values will apply for **all** deployment ids in the request.

# Scenarios

This section outlines typical client-visible scenarios for bulk delete deployments.

## Scenario 1: Successful deployment deletion

**Expected behavior:**

* Each provided deployment id that exists and can be deleted is removed
* The result entry indicates `SUCCESS` for each deleted deployment

## Scenario 2: Deployment id doesn't exist

A provided deployment id does not map to any known deployment.

**Expected behavior:**

* The result entry for that deployment id indicates `FAILURE`
* `errorMessage` explains the issue (for example, `"Deployment not found"`)

Other valid deployment ids in the same request may still succeed.

## Scenario 3: Failure scenarios (generic error message for client to verify input)

A provided deployment id is empty.

**Expected behavior:**

* The result entry indicates `FAILURE`
* `errorMessage` is intentionally generic enough to prompt client-side verification of input
  (for example, `"Invalid deployment id"`)

## Scenario 4: Deployment ids list is empty

Request includes a list with no deployment ids.

**Expected behavior (fail fast):**

* The request is rejected because there is no work to perform
* Client receives a validation error response indicating the list must not be empty

## Scenario 5: Deployment id given as null

Request includes a `null` deployment id entry.

**Expected behavior:**

* The `null` entry fails validation (per-item failure or request-level failure depending on contract)
* If processed per-item, the corresponding result indicates `FAILURE` with an input validation message

# Operational considerations

## Client behavior

* Treat bulk operations as “some may fail”; always inspect the per-deployment results.
* Retry failures selectively (after correcting the cause), rather than retrying the whole bulk request.
* Keep request sizes within configured limits and prefer smaller batches if you experience timeouts.

## Permissions and auditing

Bulk delete operations should apply the same authorization rules as the equivalent single-deployment operation.
If your environment requires auditing, ensure both successful and failed items are traceable (for example, by capturing the request context and correlating client logs with server logs).