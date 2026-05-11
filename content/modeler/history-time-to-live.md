---

title: 'History Time To Live'
weight: 30

menu:
  main:
    identifier: "history-time-to-live"
    parent: "modeler"

---

Each execution of a model resource (BPMN, DMN, and CMMN) generates historic data during execution that is stored in the database. In Fluxnova, [history cleanup](https://docs.fluxnova.finos.org/user-guide/process-engine/history/) removes this historic data from the database based on a defined **history time to live (HTTL)**.

Going forward, you must configure HTTL in one of the following ways:

- Define HTTL per model directly in Desktop Modeler.
- Set a default HTTL via an engine configuration.
- Switch off the HTTL check via an engine configuration if history cleanup is not used.

## Values

Process instances are only cleaned up if their corresponding definition has a valid time to live (TTL). Use the `historyTimeToLive` extension attribute of the process definition to define the TTL for all its instances:

`<process id="oneTaskProcess" name="The One Task Process" isExecutable="true" fluxnova:historyTimeToLive="5"></process>`

TTL can also be defined in ISO-8601 date format. The function only accepts the notation to define the number of days.

`<process id="oneTaskProcess" name="The One Task Process" isExecutable="true" fluxnova:historyTimeToLive="P5D"></process>`

Refer to the [Fluxnova documentation regarding case definitions](https://docs.fluxnova.finos.org/user-guide/process-engine/history/history-cleanup/#process-decision-case-definitions) for additional details.

Time to live must be defined under **History cleanup** in the properties panel on the right side of the screen.

## History time to live not configured

{{< img outdated="true" src="../img/history-time-to-live.png" title="History Time To Live" >}}

In the screenshot above, note that the time to live must be defined under **History cleanup** in the properties panel on the right side of the screen.

## References

- [History documentation](https://docs.fluxnova.finos.org/user-guide/process-engine/history)