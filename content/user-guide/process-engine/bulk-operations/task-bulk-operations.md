---
title: "Bulk Task Operations"
weight: 20
menu:
  main:
    identifier: "user-guide-process-engine-bulk-operations-task-bulk-operations"
    parent: "user-guide-process-engine-bulk-operations"
---

Task bulk operations allow applying the same kind of action to multiple tasks in a single request.
They are useful when clients need to process lists of tasks efficiently and still get a detailed outcome per task.

{{< note title="REST API details" class="info" >}}
This page explains the feature from a usage perspective and intentionally avoids endpoint-level REST reference details
(full URL lists, complete request/response schemas, parameter tables, etc.).
{{< /note >}}

# When to use task bulk operations

Task bulk operations are a good fit if you need to:

* complete multiple tasks as part of the same business step
* assign many tasks to a user (for example, when rebalancing workload)
* update task metadata (for example, due dates, follow-up dates, priority) in bulk
* add the same comment to a set of tasks (for audit or communication)
* create multiple standalone tasks based on external input

If you only need to operate on a single task, use the corresponding single-task operation.

# Common behavior

## Independent processing and partial failures

Bulk requests are processed item-by-item.
This means one failing item (for example, a task id that does not exist, or missing permissions) does not necessarily prevent other items from succeeding.

Clients should always evaluate the per-task results returned by the bulk operation.

## Limits and validation

To protect the engine, bulk operations should enforce limits (for example, a maximum number of tasks per request).
Invalid requests should fail fast (for example, missing task ids, malformed payloads, or exceeding limits).

{{< note title="Recommendation" class="info" >}}
For predictable behavior, avoid sending duplicate task ids in the same request.
{{< /note >}}

## Interpreting results

Bulk operations return per-task results so you can identify which tasks were processed successfully.

A typical result entry contains:

* `taskId`
* `status` (for example `SUCCESS` or `FAILURE`)
* `errorMessage` (present when a task failed)

Example:

```json
[
  { "taskId": "firstTaskId",  "status": "SUCCESS", "errorMessage": null },
  { "taskId": "secondTaskId", "status": "FAILURE", "errorMessage": "Task not found" }
]
```

{{< note title="Partial success handling" class="info" >}}
In bulk operations, success is determined per task.
Do not assume that the overall request succeeded for every task when you receive a successful HTTP response.
Always inspect the returned result list.
{{< /note >}}

# Supported operations

The following sections describe the available task bulk operations conceptually.

## Create tasks in bulk

Use bulk create when tasks are created based on external input (for example, imported work items), and you want to avoid creating tasks one-by-one.

Typical usage pattern:

1. Submit a list of tasks to be created.
2. The engine validates and creates tasks independently.
3. Evaluate the per-item results and handle failures (for example, validation errors) selectively.

## Add comments in bulk

Use bulk comments when the same note should be attached to multiple tasks (for example, communicating a shared decision or adding an audit note).

Typical usage pattern:

1. Provide a list of comment-create instructions.
2. The engine adds the comment to each task where permitted.
3. Evaluate the result list to identify tasks where comment creation failed.

### Request limit (applies to bulk comment create)
Only **100** comment-create items are supported in a single request.
If **101** items are provided, the request fails.

## Update tasks in bulk

Use bulk update when you need to apply metadata changes to multiple tasks (for example, setting due dates or adjusting priorities).

Typical usage pattern:

1. Provide a list of update instructions (each identifying the task and the fields to change).
2. The engine applies updates per task.
3. Evaluate the result list and retry or correct failures selectively.

### Request limit (applies to bulk task update)
Only **100** task update items are supported in a single request.
If **101** items are provided, the request fails.

{{< note title="Updates are partial" class="info" >}}
Only the fields explicitly provided should be updated.
Fields omitted from an update instruction should remain unchanged.
{{< /note >}}

## Assign tasks in bulk

Use bulk assign when you need to move a group of tasks to a specific user (for example, when shifting work between teams).

Typical usage pattern:

1. Provide a user id and a list of task ids.
2. The engine sets the assignee per task where permitted.
3. Evaluate the result list for authorization errors or missing tasks.

## Complete tasks in bulk

Use bulk complete when tasks can be completed together and you want a consolidated outcome.

Typical usage pattern:

1. Provide a list of task ids to complete.
2. Optionally include variables needed to complete tasks (depending on your use case and API contract).
3. The engine completes tasks independently.
4. Evaluate the result list and resolve failures (for example, missing permissions, suspended tasks, or invalid state).

{{< note title="Parallel execution and mixed results" class="info" >}}
Some bulk operations may execute items in parallel. In such cases, mixed results are possible and are represented using
`207 Multi-Status` with per-item `SUCCESS`/`FAILURE` results.
{{< /note >}}

# Operational considerations

## Client behavior

* Treat bulk operations as “some may fail”; always inspect the per-task results.
* Retry failures selectively (after correcting the cause), rather than retrying the whole bulk request.
* Keep request sizes within configured limits and prefer smaller batches if you experience timeouts.

## Permissions and auditing

Task bulk operations should apply the same authorization rules as the equivalent single-task operation.
If your environment requires auditing, ensure both successful and failed items are traceable (for example, by capturing the request context and correlating client logs with server logs).