---

title: 'Diagnostics data'
weight: 290

menu:
  main:
    identifier: "diagnostics-data"
    parent: "user-guide-process-engine"

---



Diagnostics data is constantly collected and can be collected only by you. This allows you to access the collected data through the Java and REST APIs of Fluxnova.
Being able to easily access the collected data is helpful when asking for help in our {{< forumref >}} or when opening issues in our issue tracker as it contains many of the information that are usually necessary to understand your Fluxnova setup.

## How to access the data

### Java API

To fetch the collected data via the Java API, you can use the `ManagementService` class. For example, the following code retrieves the detected JDK vendor and version:

```java
ProcessEngine processEngine = ...;
ManagementService managementService = processEngine.getManagementService();

TelemetryData telemetryData = managementService.getTelemetryData();
Internals productInternals = telemetryData.getProduct().getInternals();

String jdkVendor = productInternals.getJdk().getVendor();
String jdkVersion = productInternals.getJdk().getVersion();
```

### REST API

You can fetch the collected data via the REST API by calling the {{< restref page="getTelemetryData" text="Get Telemetry Data" tag="Telemetry" >}} endpoint.

## Collected data

Below you find the full list of data the diagnostic collector collects, followed by a real-world example. On a conceptual level, they can be categorized into general data, meta/environment data, and usage data.

### General data

The "General Data" category contains information about the process engine:

* Installation - an id that is stored as process engine configuration property
* Product name - the name of the product (i.e., `Fluxnova BPM Runtime`)
* Product version - the version of the process engine (i.e., `1.X.Y`)

### Meta and environment data
The "Meta/Environment Data" category contains information about the environmental setup:

* Database vendor and version
* Application server vendor and version
* JDK vendor and version
* Used Fluxnova Web Applications

The application server information cannot be obtained in an embedded process engine setup where no web application (e.g. Tasklist, Cockpit, REST application) is deployed and used.

In case of Azul Zulu JDK, the vendor will be send as "Oracle Corporation" as it cannot be distinguished programmatically from an Oracle JDK.


### Usage data
The "Usage Data" category contains information about the used features and components of the process engine:

* Commands count - the count of executed commands after the last retrieved data. It could be from the previous 24 hours if the data have been reported then, and the process engine has not been closed during that time. Whenever the process engine is shutdown, the currently collected data is reported immediately.
* Metrics count - the collected metrics are number of root process instance executions started, number of activity instances started or also known as flow node instances, and number of executed decision instances and elements.
The counts are collected from the start of the engine or the last reported time if the engine is already running for more than 24 hours.
* Fluxnova integration - a flag that shows if any of the Fluxnova integrations are used: Spring boot starter, Fluxnova Platform Run, WildFly subsystem or Fluxnova ejb service (e.g. WebSphere/WebLogic Application servers).

### Example

```
{
    "installation": "8343cc7a-8ad1-42d4-97d2-43452c0bdfa3",
    "product": {
      "name": "Fluxnova BPM Runtime",
      "version": "1.0.0",
      "internals": {
        "database": {  
          "vendor": "h2",
          "version": "1.4.190 (2015-10-11)"
        },
        "application-server": {
          "vendor": "Wildfly",
          "version": "WildFly Full 19.0.0.Final (WildFly Core 11.0.0.Final) - 2.0.30.Final"
        },
        "jdk": {
          "version": "14.0.2",
          "vendor": "Oracle Corporation"
        },
        "commands": {
          "StartProcessInstanceCmd": {"count": 40},
          "FetchExternalTasksCmd":  {"count": 100}
        },
        "metrics": {
          "process-instances": { "count": 936 },
          "flow-node-instances": { "count": 6125 },
          "decision-instances": { "count": 140 },
          "executed-decision-elements": { "count": 732 }
        },
        "data-collection-start-date": "2022-11-320T15:53:20.386+0100",
        "fluxnova-integration": [
          "spring-boot-starter",
          "fluxnova-bpm-run"
        ],
        "webapps": [
          "cockpit",
          "admin"
        ]
      }
    }
}
```

## Source code 

In case you want further details, you can have a look at the implementation of the diagnostics topic in [our codebase](https://github.com/finos/fluxnova-bpm-platform/blob/master/engine/src/main/java/org/finos/fluxnova/bpm/engine/impl/diagnostics/DiagnosticsCollector.java). The link leads you to the current `master` version of the feature.

