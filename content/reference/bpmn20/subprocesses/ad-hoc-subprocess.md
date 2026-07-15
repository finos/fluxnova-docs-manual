---

title: 'Ad Hoc Subprocess'
weight: 50

menu:
  main:
    identifier: "bpmn-subprocess-ad-hoc"
    parent: "bpmn-subprocess"
    pre: "Model a set of activities that can be executed in any order."

---

An ad hoc subprocess is a subprocess in which the contained activities do not have to be executed in a predefined order. Activities can be activated dynamically at runtime in any order and multiple times. An ad hoc subprocess is useful for modeling case-like scenarios where the flow of work is determined at runtime rather than at design time. In Fluxnova, optional sequence flows between activities are permitted to route work through specific activity sequences.

An ad hoc subprocess has one ordering mode:

*   **Parallel** (default and only supported mode): Multiple activities within the subprocess may be active simultaneously. This allows any activity to be started at any time, regardless of whether other activities have already been started or completed.

The `ordering` attribute is optional and defaults to `"Parallel"`. The value `"Sequential"` is accepted and stored in the model, but it is not enforced by the engine — runtime activation is always parallel.

To enforce sequential execution between activities, use optional sequence flows to connect them within the ad hoc subprocess.

Completion of an ad hoc subprocess is controlled by three settings:

*   `completionCondition` (optional child element) — an expression that is re-evaluated whenever a child activity ends or takes a sequence flow inside the subprocess. When it evaluates to `true`, the subprocess completes.
*   `fluxnova:autoComplete` (optional extension attribute, default: `true`) — applies when no `completionCondition` is defined. If `true`, the subprocess completes automatically once at least one contained activity has been started and no activities are active anymore. If `false`, the subprocess stays open even after all activities have finished and must be completed explicitly via the `completeAdHocSubProcess()` API.
*   `cancelRemainingInstances` (optional attribute, default: `true`) — controls what happens to still-active activities when the completion condition is met. If `true`, they are cancelled and the subprocess completes immediately. If `false`, completion is deferred until all active activities have finished on their own.

Constraints for an ad hoc subprocess:

*   An ad hoc subprocess must not have start or end events (BPMN 2.0 standard).
*   Boundary events on the ad hoc subprocess itself behave the same as for an embedded subprocess.
*   Activities within an ad hoc subprocess may optionally be connected by sequence flows to define activity routing (Fluxnova extension).

An ad hoc subprocess is visualized as a subprocess with a tilde (~) marker at the bottom center:

<div data-bpmn-diagram="../bpmn/ad-hoc-subprocess"></div>

When expanded, the internal activities are shown without connecting sequence flows:

<div data-bpmn-diagram="../bpmn/ad-hoc-subprocess-expanded"></div>

An ad hoc subprocess is represented in XML using the `adHocSubProcess` element. The optional `ordering` attribute defaults to `"Parallel"`; Fluxnova does not enforce sequential ordering at runtime. The optional `completionCondition` child element defines the expression that, when evaluated as `true`, causes the subprocess to complete:

```xml
<bpmn:adHocSubProcess id="Activity_11nc5qc" 
                      ordering="Parallel"
                      cancelRemainingInstances="false"
                      fluxnova:autoComplete="false"
                      camunda:asyncBefore="true">
  <bpmn:extensionElements>
    <fluxnova:properties>
      <fluxnova:property name="activeTasksCollection" value="Task_A,Task_B" />
    </fluxnova:properties>
  </bpmn:extensionElements>
  <bpmn:completionCondition xsi:type="bpmn:tFormalExpression">${approved==true}</bpmn:completionCondition>
  
  <bpmn:userTask id="Task_A" name="Task A" />
  <bpmn:userTask id="Task_B" name="Task B">
    <bpmn:extensionElements>
      <camunda:inputOutput>
        <camunda:inputParameter name="Input_1">value</camunda:inputParameter>
      </camunda:inputOutput>
    </bpmn:extensionElements>
  </bpmn:userTask>
  <bpmn:userTask id="Task_C" name="Task C" />
  
  <!-- Optional sequence flows for routing -->
  <bpmn:sequenceFlow id="Flow_1" sourceRef="Task_A" targetRef="Task_C" />
</bpmn:adHocSubProcess>
```


# Fluxnova Extensions

<table class="table table-striped">
  <tr>
    <th>Attributes</th>
    <td>
      <a href="{{< ref "/reference/bpmn20/custom-extensions/extension-attributes.md#asyncbefore" >}}">camunda:asyncBefore</a>,
      <a href="{{< ref "/reference/bpmn20/custom-extensions/extension-attributes.md#asyncafter" >}}">camunda:asyncAfter</a>,
      <a href="{{< ref "/reference/bpmn20/custom-extensions/extension-attributes.md#exclusive" >}}">camunda:exclusive</a>,
      <a href="{{< ref "/reference/bpmn20/custom-extensions/extension-attributes.md#jobpriority" >}}">camunda:jobPriority</a>,
      <code>fluxnova:autoComplete</code> — Boolean (default: <code>true</code>). When no <code>completionCondition</code> is defined, controls whether the subprocess completes automatically once at least one activity has started and no activities are active anymore. Must be specified as an attribute on the <code>adHocSubProcess</code> element; the <code>camunda:autoComplete</code> alias is also accepted.
    </td>
  </tr>
  <tr>
    <th>Extension Elements</th>
    <td>
      <a href="{{< ref "/reference/bpmn20/custom-extensions/extension-elements.md#failedjobretrytimecycle" >}}">camunda:failedJobRetryTimeCycle</a>,
      <a href="{{< ref "/reference/bpmn20/custom-extensions/extension-elements.md#inputoutput" >}}">camunda:inputOutput</a>,
      <code>fluxnova:properties</code> — Custom property container supporting <code>activeTasksCollection</code> property
    </td>
  </tr>
  <tr>
    <th>Extension Properties</th>
    <td>
      <code>fluxnova:property name="activeTasksCollection"</code> — Specifies the activities to auto-start when the ad hoc subprocess enters: a comma-separated list of activity IDs (e.g., <code>Task_A,Task_B</code>), or an expression or variable reference resolving to a <code>String</code> or <code>Collection</code> of activity IDs (e.g., <code>${taskList}</code>). Only starter activities may be listed — activities of a startable type with no incoming sequence flow inside the subprocess. If not specified or empty, the subprocess enters idle state awaiting manual activity triggering via the <code>triggerAdHocActivities()</code> API.
    </td>
  </tr>
  <tr>
    <th>Constraints</th>
    <td>
      The <code>camunda:exclusive</code> attribute is only evaluated if the attribute
      <code>camunda:asyncBefore</code> or <code>camunda:asyncAfter</code> is set to <code>true</code>.
      <br/><br/>
      The <code>cancelRemainingInstances</code> attribute (default: <code>true</code>) controls whether active activities are cancelled when the <code>completionCondition</code> evaluates to true. If set to <code>false</code>, completion is deferred until all active activities have finished.
      <br/><br/>
      The <code>fluxnova:autoComplete</code> value must be a valid boolean; any other value fails deployment. Supplying <code>autoComplete</code> as an extension <em>property</em> inside <code>fluxnova:properties</code> is not supported and also fails deployment — it must be an attribute on the <code>adHocSubProcess</code> element.
      <br/><br/>
      Only startable activity types can be activated inside an ad hoc subprocess: tasks of any type, call activities, embedded subprocesses, and transactions. Events, gateways, and compensation handlers cannot be started directly.
    </td>
  </tr>
</table>


# Fluxnova Implementation Details

## Core Components

- **AdHocSubProcessActivityBehavior** — Main behavior implementation
  - Evaluates `completionCondition` after each child activity completes
  - Auto-completes when no completion condition is set, `fluxnova:autoComplete` is `true` (default), at least one activity has started, and no active children remain
  - Re-evaluates condition on child completion, on sequence flow transitions inside the subprocess, and on final completion
  - If condition is false (or `autoComplete` is `false` with no condition), subprocess stays open indefinitely
- **TriggerAdHocActivitiesCmd** & `RuntimeService.triggerAdHocActivities()` — Dynamic activity triggering
  - Allows activating starter activities after subprocess entry (not BPMN 2.0 standard)
  - Supports per-activity variable mapping
  - Validates activities are startable and not already active
- **CompleteAdHocSubProcessCmd** & `RuntimeService.completeAdHocSubProcess()` — Manual completion API
  - Bypasses completionCondition entirely (forced/manual override)
  - Supports optional variable setting at completion
  - Cancels still-active inner activities when `cancelRemainingInstances` is `true` (default); fails with an error if activities are active and `cancelRemainingInstances` is `false`

### REST Endpoints
- `POST /engine-rest/execution/{id}/ad-hoc-activities/trigger` — trigger activities with per-activity variables
- `POST /engine-rest/execution/{id}/ad-hoc-activities/complete` — complete with optional variables

## Fluxnova-Specific Deviations from BPMN 2.0

| Feature                   | BPMN 2.0 Standard                | Fluxnova Implementation                                      |
|--------------------------|-----------------------------------|--------------------------------------------------------------|
| Initial activity selection| All startable activities auto-start| Uses `activeTasksCollection` extension property               |
| Runtime activity triggering| No mechanism defined              | `triggerAdHocActivities()` API allows selective activation    |
| Per-activity variables    | Not supported                     | Each triggered activity receives its own variable map         |
| Manual completion         | No API                            | `completeAdHocSubProcess()` forcibly completes regardless     |
| Completion variables      | Variables set via condition only   | Optional variables can be set at completion time              |
| Automatic completion      | Driven by `completionCondition` only | `fluxnova:autoComplete` attribute controls auto-completion when no condition is defined; `false` keeps the subprocess open until explicitly completed |

## Key Behaviors

- **Idle state possible** — If no `activeTasksCollection` defined or is empty, subprocess enters idle state awaiting `triggerAdHocActivities()`
- **Condition holds open** — If `completionCondition` evaluates to false after any child finishes, subprocess remains open
- **Automatic completion** — With no `completionCondition`, the subprocess completes automatically once at least one activity has started and none remain active, unless `fluxnova:autoComplete="false"` is set
- **Deferred completion** — With `cancelRemainingInstances="false"`, a met completion condition does not cancel active activities; the subprocess completes once they have all finished
- **Manual override** — The complete API is a forced exit mechanism independent of condition evaluation
- **Active tasks collection** — The `activeTasksCollection` property specifies which activities auto-start when the ad hoc subprocess enters: a comma-separated list (e.g., `Task_A,Task_B`) or an expression resolving to a `String` or `Collection` of activity IDs (e.g., `${taskList}`). Only starter activities (startable type, no incoming sequence flow inside the subprocess) can be listed
- **Multi-instance support** — Ad hoc subprocesses support `multiInstanceLoopCharacteristics` for creating multiple instances of the entire ad hoc subprocess


# Additional Resources

*   [BPMN 2.0 Specification: Ad Hoc Sub-Process (Section 10.6)](https://www.omg.org/spec/BPMN/2.0/)
