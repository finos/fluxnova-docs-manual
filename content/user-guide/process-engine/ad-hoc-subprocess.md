---

title: 'Ad Hoc Subprocess'
weight: 65

menu:
  main:
    identifier: "user-guide-process-engine-ad-hoc-subprocess"
    parent: "user-guide-process-engine"

---

This section describes how to work with ad hoc subprocesses at runtime in Fluxnova. For modeling information, see the [Ad Hoc Subprocess Reference]({{< ref "/reference/bpmn20/subprocesses/ad-hoc-subprocess.md" >}}).

# Finding the Ad Hoc Subprocess Execution

To interact with an ad hoc subprocess at runtime, you need to find its execution ID. The ad hoc subprocess creates a separate execution scope that you can query using the `ExecutionQuery` API:

```java
import java.util.*;
import org.finos.fluxnova.bpm.engine.RuntimeService;
import org.finos.fluxnova.bpm.engine.runtime.Execution;
import org.finos.fluxnova.bpm.engine.runtime.ProcessInstance;

RuntimeService runtimeService = processEngine.getRuntimeService();

// Start or locate your process instance
ProcessInstance pi = runtimeService.startProcessInstanceByKey("myProcess");

// Find the ad hoc subprocess scope execution by its BPMN activity ID
Execution adHocExecution = runtimeService.createExecutionQuery()
  .processInstanceId(pi.getId())
  .activityId("adHocSubProcess")  // BPMN id of the adHocSubProcess element
  .singleResult();

// Now you have the execution ID for triggering activities or completing
String adHocExecutionId = adHocExecution.getId();
```

The `adHocSubProcess` activity ID refers to the `id` attribute of the `<bpmn:adHocSubProcess>` element in your BPMN model.

# Ordering

Fluxnova ad hoc subprocesses support **parallel ordering only**. When an ad hoc subprocess is active, multiple child activities can execute concurrently.

The `ordering` attribute is optional and defaults to `"Parallel"`. A value of `"Sequential"` is accepted and stored in the model, but it is not enforced by the engine — runtime activation is always parallel.

To enforce sequential execution between specific activities, use optional sequence flows to connect them within the ad hoc subprocess. For example:

```xml
<bpmn:adHocSubProcess id="AdHocProc" ordering="Parallel">
  <bpmn:userTask id="Task_A" name="Task A" />
  <bpmn:userTask id="Task_B" name="Task B" />
  <bpmn:userTask id="Task_C" name="Task C" />
  
  <!-- Enforce Task_A → Task_C sequence -->
  <bpmn:sequenceFlow id="Flow_1" sourceRef="Task_A" targetRef="Task_C" />
</bpmn:adHocSubProcess>
```

In this example, `Task_A` and `Task_B` can run in parallel, but `Task_C` cannot start until `Task_A` completes.



Ad hoc subprocesses in Fluxnova support dynamic activity triggering, which allows you to activate specific activities at runtime independently of the initial configuration. This is useful for implementing case management scenarios where work tasks are activated on-demand.

## Using triggerAdHocActivities()

The `RuntimeService.triggerAdHocActivities()` method allows you to activate one or more activities within an ad hoc subprocess execution:

```java
RuntimeService runtimeService = processEngine.getRuntimeService();

// Build per-activity variables (keyed by activity id)
Map<String, Map<String, Object>> activityVariables = new HashMap<>();
activityVariables.put("taskA", Map.of("priority", "HIGH", "owner", "alex"));
activityVariables.put("taskB", Map.of("source", "manual"));

// Trigger multiple activities with their respective variables
runtimeService.triggerAdHocActivities(
  adHocExecution.getId(),
  Arrays.asList("taskA", "taskB"),
  activityVariables
);
```

## REST Endpoint for Triggering Activities

```
POST /engine-rest/execution/{id}/ad-hoc-activities/trigger
```

### Request Body

```json
{
  "activities": [
    {
      "activityId": "Task_A",
      "variables": {
        "myStringVar": { "value": "hello", "type": "String" },
        "myIntVar": { "value": 42, "type": "Integer" },
        "myBoolVar": { "value": true, "type": "Boolean" }
      }
    },
    {
      "activityId": "Task_B",
      "variables": {
        "myStringVar": { "value": "world", "type": "String" }
      }
    }
  ]
}
```

### Response

Returns `204 No Content` on successful trigger.

Validation is all-or-nothing: if any entry is invalid — a duplicate or unknown activity ID, an activity that is not startable or is already active, or variables supplied for an activity not listed in the request — the whole request fails with `400 Bad Request` and no activities are started. The same response is returned if the execution is not currently waiting in an ad hoc subprocess.

# Manual Completion

In addition to the `completionCondition` defined in the process model, Fluxnova allows manual completion of ad hoc subprocesses via the runtime API. This provides a way to forcibly exit an ad hoc subprocess regardless of its completion condition state.

## Using completeAdHocSubProcess()

The `RuntimeService.completeAdHocSubProcess()` method allows you to manually complete an ad hoc subprocess:

```java
RuntimeService runtimeService = processEngine.getRuntimeService();

// Complete without variables
runtimeService.completeAdHocSubProcess(executionId);

// Complete with variables
Map<String, Object> variables = new HashMap<>();
variables.put("approved", true);
variables.put("reason", "All required tasks completed");
runtimeService.completeAdHocSubProcess(executionId, variables);
```

The manual completion bypasses the `completionCondition` entirely. If child activities are still active, the outcome depends on the `cancelRemainingInstances` attribute: with `true` (the default) the active activities are cancelled and the subprocess completes; with `false` the call fails with an error until all child activities have finished.

## REST Endpoint for Completion

```
POST /engine-rest/execution/{id}/ad-hoc-activities/complete
```

### Request Body

```json
{
  "variables": {
    "approved": {
      "value": true,
      "type": "Boolean"
    },
    "reason": {
      "value": "All required tasks completed",
      "type": "String"
    }
  }
}
```

### Response

Returns `204 No Content` on successful completion.

Returns `400 Bad Request` if the execution is not currently waiting in an ad hoc subprocess, or if child activities are still active and `cancelRemainingInstances` is set to `false`.

# Initial Activity Selection

By default, activities specified in the `activeTasksCollection` property are automatically started when the ad hoc subprocess enters. If `activeTasksCollection` is not specified or is empty, the subprocess enters an idle state and awaits manual activity triggering.

## Specifying Initial Activities

```xml
<bpmn:adHocSubProcess id="AdHocProc" ordering="Parallel">
  <bpmn:extensionElements>
    <fluxnova:properties>
      <fluxnova:property name="activeTasksCollection" value="Task_A,Task_B" />
    </fluxnova:properties>
  </bpmn:extensionElements>
  ...
</bpmn:adHocSubProcess>
```

In this example, both `Task_A` and `Task_B` are automatically activated when the ad hoc subprocess starts.

The `activeTasksCollection` value can also be an expression or variable reference that resolves to a `String` of comma-separated activity IDs or a `Collection` of activity IDs:

```xml
<fluxnova:property name="activeTasksCollection" value="${taskList}" />
```

Only *starter activities* can be listed: activities of a startable type (tasks of any type, call activities, embedded subprocesses, and transactions) that have no incoming sequence flow inside the ad hoc subprocess. Listing any other activity, or a value that resolves to something other than a `String` or `Collection`, causes the subprocess to fail on entry with an error.

# Completion Condition

The `completionCondition` element defines an expression that determines when the ad hoc subprocess completes. This is re-evaluated each time a child activity completes.

## Example Completion Conditions

```xml
<!-- Complete when at least 2 tasks have been completed -->
<completionCondition xsi:type="bpmn:tFormalExpression">
  ${nrOfCompletedInstances >= 2}
</completionCondition>

<!-- Complete when a specific variable flag is true -->
<completionCondition xsi:type="bpmn:tFormalExpression">
  ${approved==true}
</completionCondition>

<!-- Complete when all tasks are finished -->
<completionCondition xsi:type="bpmn:tFormalExpression">
  ${nrOfCompletedInstances==nrOfInstances}
</completionCondition>
```

If the `completionCondition` evaluates to `false`, the ad hoc subprocess remains open indefinitely, awaiting either the condition to become `true` or manual completion via `completeAdHocSubProcess()`.

# Automatic Completion

When no `completionCondition` is defined, the optional `fluxnova:autoComplete` extension attribute (default: `true`) controls whether the ad hoc subprocess completes automatically:

- **`true`** (default) — The subprocess completes automatically once at least one contained activity has been started and no activities are active anymore
- **`false`** — The subprocess stays open even after all activities have finished; it must be completed explicitly via `completeAdHocSubProcess()` or the corresponding REST endpoint

```xml
<bpmn:adHocSubProcess id="AdHocProc" fluxnova:autoComplete="false">
  ...
</bpmn:adHocSubProcess>
```

Setting `autoComplete="false"` is useful when activities are triggered on demand over a longer period and the subprocess should remain available for further activity triggering even while no activity is currently running.

Note the following:

- `autoComplete` must be specified as an attribute on the `adHocSubProcess` element (the `camunda:autoComplete` alias is also accepted). Supplying it as a `fluxnova:property` extension property fails at deployment
- The value must be a valid boolean (`true` or `false`); any other value fails at deployment
- A defined `completionCondition` is still evaluated as usual, regardless of the `autoComplete` setting

# Cancellation Behavior

The `cancelRemainingInstances` attribute (default: `true`) controls what happens to active child activities when the completion condition is met:

- **`true`** (default) — All still-active child activities are cancelled and the subprocess completes immediately
- **`false`** — Active child activities are not cancelled; the subprocess defers completion until all of them have finished

The attribute also affects manual completion via `completeAdHocSubProcess()`: with `true`, active child activities are cancelled; with `false`, the call fails while child activities are still active.

```xml
<bpmn:adHocSubProcess id="AdHocProc" 
                      ordering="Parallel"
                      cancelRemainingInstances="false">
  ...
</bpmn:adHocSubProcess>
```

# Multi-Instance Ad Hoc Subprocesses

Ad hoc subprocesses support `multiInstanceLoopCharacteristics`, allowing you to create multiple instances of the entire ad hoc subprocess:

```xml
<bpmn:adHocSubProcess id="AdHocProc" ordering="Parallel">
  <bpmn:multiInstanceLoopCharacteristics>
    <bpmn:loopCardinality xsi:type="bpmn:tFormalExpression">3</bpmn:loopCardinality>
  </bpmn:multiInstanceLoopCharacteristics>
  <bpmn:completionCondition xsi:type="bpmn:tFormalExpression">
    ${nrOfCompletedInstances >= nrOfInstances}
  </bpmn:completionCondition>
  ...
</bpmn:adHocSubProcess>
```

This creates three parallel instances of the ad hoc subprocess, each with its own set of child activities.
