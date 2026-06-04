---

title: 'Evaluate, Deploy and Test the decision table'
weight: 40

menu:
  main:
    name: "Evaluate and Deploy the Decision Table"
    parent: "get-started-dmn"
    identifier: "get-started-dmn-deploy"
    pre: "Use Java Code to evaluate the decision table, then deploy the web application to Apache Tomcat and verify the result in Cockpit."

aliases: [/dmn11/deploy/]
---

In this step, we use Java Code to evaluate the decision table. Then we deploy the web application to Apache Tomcat and verify the result in Cockpit.

# Evaluate the Decision Table

To directly evaluate the decision table after deployment, add the following method to your Application class:

```java
package org.finos.fluxnova.bpm.getstarted.dmn;

@ProcessApplication("Dinner App DMN")
public class DinnerApplication extends ServletProcessApplication {

  protected final static Logger LOGGER = Logger.getLogger(DinnerApplication.class.getName());

  @PostDeploy
  public void evaluateDecisionTable(ProcessEngine processEngine) {

    DecisionService decisionService = processEngine.getDecisionService();

    VariableMap variables = Variables.createVariables()
      .putValue("season", "Spring")
      .putValue("guestCount", 10);

    DmnDecisionTableResult dishDecisionResult = decisionService.evaluateDecisionTableByKey("dish", variables);
    String desiredDish = dishDecisionResult.getSingleEntry();

    LOGGER.log(Level.INFO, "\n\nDesired dish: {0}\n\n", desiredDish);
  }

}
```

{{< get-tag repo="fluxnova-get-started-dmn" tag="Step-4" >}}

# Build the Web Application with Maven

Select the `pom.xml` in the Package Explorer, perform a right-click and select `Run As / Maven Install`. This will generate a WAR file named `dinner-dmn-0.1.0-SNAPSHOT.war` in the `target/` folder of your Maven project.

{{< note title="Hint" class="info" >}}
If the `dinner-dmn-0.1.0-SNAPSHOT.war` file is not visible after having performed the Maven build, you need to refresh the project (F5) in eclipse.
{{< /note >}}


# Deploy to Apache Tomcat

In order to deploy the process application, copy-paste the `dinner-dmn-0.1.0-SNAPSHOT.war` from your Maven project to the `$CAMUNDA_HOME/server/apache-tomcat/webapps` folder.

Check the log file of the Apache Tomcat server. If you see the following log message, the deployment was successful:

<pre class="console">
INFO org.finos.fluxnova.commons.logging.BaseLogger.logInfo
ENGINE-07015 Detected @ProcessApplication class 'org.finos.fluxnova.bpm.getstarted.dish.DishApplication'
INFO org.finos.fluxnova.commons.logging.BaseLogger.logInfo
ENGINE-08024 Found processes.xml file at ../webapps/dinner-dmn-0.1.0-SNAPSHOT/WEB-INF/classes/META-INF/processes.xml
INFO org.finos.fluxnova.commons.logging.BaseLogger.logInfo
ENGINE-08023 Deployment summary for process archive 'dinner-dmn':

        dinnerDecisions.dmn

INFO org.finos.fluxnova.bpm.getstarted.dmn.DinnerApplication.evaluateDecisionTable 

Desired dish: Stew

INFO org.finos.fluxnova.commons.logging.BaseLogger.logInfo
ENGINE-08050 Process application Dinner App DMN successfully deployed
</pre>


# Verify the Deployment with Cockpit

Now, use Cockpit to check if the decision table is successfully deployed. Go to [http://localhost:8080/fluxnova/app/cockpit](http://localhost:8080/fluxnova/app/cockpit). Log in with *demo / demo*. Go to "Decisions" section. Your decision table *Dish* should be listed as deployed decision definition.

{{< img src="../img/cockpit-dish-dmn.png" >}}


# Verify the Evaluation with Cockpit

Click on the decision *Dish*. This opens a dialog where you see when the decision table was evaluated.

{{< img src="../img/cockpit-decision-overview-dish-dmn.png" >}}

If you click on the id, you can see the historic data of the evaluation. The matched rules are highlighted and the input and output values are listed in the table below.

{{< img src="../img/cockpit-decision-history-dish-dmn.png" >}}

Verify that the 5th rule was matched and the output value for the desired dish is "Stew".

# Next Steps

Congratulations, you have now successfully set up a project with your first DMN decision table.

Next,

* see how you can evaluate the decision using the [REST API](https://docs.fluxnova.finos.org/rest/fluxnova-bpm-platform/7.23/#tag/Decision-Definition/operation/evaluateDecisionByKey),
* learn more about DMN by reading the [DMN Reference]({{< ref "/reference/dmn/">}}),
* learn more about the [Decision API exposed by Fluxnova Process Engine]({{< ref "/user-guide/process-engine/decisions/" >}}),
* check how you can invoke the decision from a [BPMN Business Rule Task]({{< ref "/reference/bpmn20/tasks/business-rule-task/" >}}),
* Bonus Step: [Decision Requirements Graph](../drg) 
