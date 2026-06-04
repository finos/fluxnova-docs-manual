---

title: 'Model, Evaluate and Deploy a Decision Requirements Graph'
weight: 50

menu:
  main:
    name: "Decision Requirements Graph"
    parent: "get-started-dmn"
    identifier: "get-started-dmn-drg"
    pre: "Model a Decision Requirements Graph based on the decision table, adjust the Java Code to evaluate it and deploy the web application."

aliases: [/dmn11/drg/]
---

In this step, we extend the previous example by a second decision *Beverages* which uses the *Dish* decision table as input. We model this dependency between the decisions within a Decision Requirements Graph (DRG) using the Fluxnova Modeler. Then, we adjust the Application class to evaluate the *Beverages* decision, deploy the web application to Apache Tomcat and verify the result in Cockpit.

{{< note title="Decision Requirements Graph vs. Decision Requirements Diagram" class="info" >}}
The visual representation of a Decision Requirements Graph (DRG) is called Decision Requirements Diagram (DRD). In the context of the Fluxnova Modeler, we name it DRD because we use the visual representation to model the DRG.
{{< /note >}}

# Switch from Decision Table to DRD

Open the *Dish* decision table from the previous step. Click on the button "View DRD" to see the Decision Requirements Diagram (DRD). It contains a single decision with the name *Dish*.

{{< img src="../img/modeler-drd-step1.png" >}}

# Set the Name and the Id of the DRD

Click somewhere on the canvas and open the Property Panel on the right. Change the [id]({{< ref "/reference/dmn/drg/#decision-requirements-graph-id" >}}) of the DRD to "dinnerDecisions". Next, change the [name]({{< ref "/reference/dmn/drg/#decision-requirements-graph-name" >}}) of the DRD to "Dinner Decisions".


{{< img src="../img/modeler-drd-step2.png" >}}

# Create a new Decision in the DRD

Click on the decision icon of the palette to create a new decision. Then, double-click on the decision and type *Beverages* to set the name. Change the type of the decision to *Decision Table* by clicking on the wrench icon next to the "Beverages" decision and selecting "Decision Table". Use the Property Panel on the right side again to set the id to "beverages".

{{< img src="../img/modeler-drd-step3.png" >}}

Next, connect the *Dish* decision to the *Beverages* decision to indicate that the *Dish* decision is a [required decision]({{< ref "/reference/dmn/drg/#required-decisions" >}}) of the *Beverages* decision. That means that it is used as an input for the decision and the output value "desiredDish" can be accessed there.

{{< img src="../img/modeler-drd-step4.png" >}}

Click on the top left icon of the *Beverages* decision to open the decision table.

# Configure the Decision Table and add the Rules

Configure the *Beverages* decision table so that it has:

* one input with label "Dish", input expression "desiredDish" and type "string",
* second input with label "Guests with children", input expression "guestsWithChildren" and type "boolean",
* an output with label "Beverages", name "beverages" and type "string",
* the hit policy "COLLECT" (with collect operator *LIST*).

Then, fill the table with the rules.

{{< img src="../img/modeler-drd-step5.png" >}}

Save your changes and replace the existing DMN file in the `src/main/resources` folder.

{{< get-tag repo="fluxnova-get-started-dmn" tag="Step-5" >}}

# Evaluate the Decision

To evaluate the *Beverages* decision, we extend the existing method in your Application class and add a new variable "guestsWithChildren".

```java
package org.finos.fluxnova.bpm.getstarted.dmn;

@ProcessApplication("Dinner App DMN")
public class DinnerApplication extends ServletProcessApplication
{

  protected final static Logger LOGGER = Logger.getLogger(DinnerApplication.class.getName());

    @PostDeploy
    public void evaluateDecisionTable(ProcessEngine processEngine) {

      DecisionService decisionService = processEngine.getDecisionService();

      VariableMap variables = Variables.createVariables()
        .putValue("season", "Spring")
        .putValue("guestCount", 10)
        .putValue("guestsWithChildren", false);

      DmnDecisionTableResult dishDecisionResult = decisionService.evaluateDecisionTableByKey("dish", variables);
      String desiredDish = dishDecisionResult.getSingleEntry();

      LOGGER.log(Level.INFO, "\n\nDesired dish: {0}\n\n", desiredDish);

      DmnDecisionTableResult beveragesDecisionResult = decisionService.evaluateDecisionTableByKey("beverages", variables);
      List<Object> beverages = beveragesDecisionResult.collectEntries("beverages");

      LOGGER.log(Level.INFO, "\n\nDesired beverages: {0}\n\n", beverages);
    }

}
```

{{< get-tag repo="fluxnova-get-started-dmn" tag="Step-6" >}}

# Build and Deploy the Web Application

Build the web application with Maven and replace the `dinner-dmn-0.1.0-SNAPSHOT.war` in the `$CAMUNDA_HOME/server/apache-tomcat/webapps` folder.

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

INFO org.finos.fluxnova.bpm.getstarted.dmn.DinnerApplication.evaluateDecisionTable 

Desired beverages: [Guiness, Water]

INFO org.finos.fluxnova.commons.logging.BaseLogger.logInfo
ENGINE-08050 Process application Dinner App DMN successfully deployed
</pre>

# Verify the Evaluation with Cockpit

Now, open [Cockpit](http://localhost:8080/fluxnova/app/cockpit) and go to the "Decisions" section.

{{< img src="../img/cockpit-decision-overview-beverages-dmn.png" >}}

Then, click on the decision *Beverages* and select an id to see the historic data of the evaluation.

{{< img src="../img/cockpit-decision-history-beverages-dmn.png" >}}

Verify that both rules were matched and the output value for the beverages is "Guiness" and "Water".

Note that the *Dish* decision is evaluated as part of the evaluation of the *Beverages* decision. It provides the value "Stew" for the input expression "desiredDish".

# Next Steps

Next,

* learn more about DRG by reading the [DMN Reference]({{< ref "/reference/dmn/drg" >}}),
* learn more about [DMN in Cockpit](https://docs.fluxnova.finos.org/manual/webapps/cockpit/dmn/) and specialized views for DRGs (Enterprise Feature)
