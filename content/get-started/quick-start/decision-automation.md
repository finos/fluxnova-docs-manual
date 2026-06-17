---

title: 'Leverage business rules (6/6)'
weight: 60

menu:
  main:
    name: "Decision Automation"
    parent: "get-started-quick-start"
    identifier: "get-started-quick-start-decision-automation"
    pre: "Learn how to integrate DMN decision tables in the Process."

---

In this section, you'll learn how to add decision automation to your process by using [BPMN 2.0 *Business Rule Tasks*]({{< ref "/reference/bpmn20/tasks/business-rule-task/" >}}) and [DMN 1.3 Decision Tables]({{< ref "/reference/dmn/" >}}).

# Add a Business Rule Task to the Process
Use the Fluxnova Modeler to open the Payment Retrieval process then click on the Approve Payment Task. Change the activity type to *Business Rule Task* in the wrench button menu.

{{< img src="../img/modeler-businessrule-task1.png" >}}

Next, link the Business Rule Task to a DMN table by changing `Implementation` to `DMN` and `Decision Ref` to `approve-payment` in the properties panel. In order to retrieve the result of the evaluation and save it automatically as a process instance variable in our process, we also need to change the `Result Variable` to `approved` and use `singleEntry` as the `Map Decision Result` in the properties panel.

{{< img src="../img/modeler-businessrule-task2.png" >}}

Save your changes and deploy the updated process using the `Deploy` Button in the Fluxnova Modeler.

# Create a DMN table using the Fluxnova Modeler
First, create a new DMN diagram by clicking *File > New File > DMN Diagram*.
{{< img src="../img/modeler-new-dmn-diagram.png" >}}

Now the newly created diagram will already have a decision element added to it. Select it by clicking it and then give it a name of *Approve Payment* and an ID of `approve-payment` (the decision ID must match the the `Decision Ref` in your BPMN process).
{{< img src="../img/modeler-new-dmn-diagram-properties.png" >}}

Next, create a new DMN table by clicking the table button.
{{< img src="../img/modeler-new-dmn-table.png" >}}

# Specify the DMN table
First, specify the input expressions for the DMN table. In this example, we'll decide whether a payment is approved based on the item name. Your rules can also make use of the FEEL Expression Language, JUEL or Script. If you like, you can [read more about Expressions in the DMN Engine]({{< ref "/user-guide/dmn-engine/expressions-and-scripts/" >}}).

Double click *Input* to configure the input column. Use `Item` as the *Input Label* and `item` as the *Input Expression*:
{{< img src="../img/modeler-dmn2.png" >}}

Next, set up the output column. Use `Approved` as the *Output Label* and `approved` as the *Output Name* for the output column "Approved":
{{< img src="../img/modeler-dmn3.png" >}}

Let's create some rules by clicking on the plus icon on the left side of the DMN table. We should also change the Output Column to the Data Type `boolean`:
{{< img src="../img/modeler-dmn4.png" >}}

After setup, your DMN table should look like this:
{{< img src="../img/modeler-dmn5.png" >}}

# Deploy the DMN table
To deploy the Decision Table, click on the Deploy button in the Fluxnova Modeler, give it Deployment Name "Payment Retrieval Decision", then hit the Deploy button.
{{< img src="../img/modeler-dmn6.png" >}}

# Verify the Deployment with Cockpit
Now, use Cockpit to see if the decision table was successfully deployed. Go to [http://localhost:8080/fluxnova/app/cockpit/](http://localhost:8080/fluxnova/app/cockpit/). Log in with the credentials *demo / demo*. Navigate to the "Decisions" section. Your decision table *Approve Payment* should be listed as deployed decision definition.

{{< img src="../img/cockpit-approve-payment.png" >}}

# Inspect using Cockpit and Tasklist

Next, use Tasklist to start two new Process Instances and verify that depending on your input, the Process Instance will be routed differently.
To do so, go to [http://localhost:8080/fluxnova/app/tasklist/](http://localhost:8080/fluxnova/app/tasklist/). Log in with *demo / demo*.

Click on the {{< glyphicon name="list-alt" text=" Start process" >}} button to start a process instance and choose the `Payment` process.
Use the generic form to add the variables as follows:
{{< img src="../img/tasklist-dmn1.png" >}}

Hit the Start Instance button.

Next, click again on the {{< glyphicon name="list-alt" text=" Start process" >}} button to start another process instance and choose the `Payment` process.
Use the generic form to add the variables as follows:
{{< img src="../img/tasklist-dmn2.png" >}}

You'll see that depending on the input, the worker will either charge or not charge the credit card.
You can also verify that the DMN tables were evaluated by using Fluxnova Cockpit. Go to [http://localhost:8080/fluxnova/app/cockpit/](http://localhost:8080/fluxnova/app/cockpit/). Log in with the credentials *demo / demo*. Navigate to the "Decisions" section and click on Approve Payment. Check the different Decision Instances that were evaluated by clicking on the ID in the table.

A single DMN table that was executed could look like this in Fluxnova Cockpit:
{{< img src="../img/cockpit-dmn-table.png" >}}

{{< note title="Success!" class="info" >}}
Congratulations! You've successfully completed the Fluxnova Platform Quick Start. Ready to continue? We recommend the [Fluxnova Platform documentation](https://docs.fluxnova.finos.org/manual/latest/).
{{< /note >}}


{{< get-tag repo="fluxnova-get-started-quickstart" tag="Step-5" >}}
