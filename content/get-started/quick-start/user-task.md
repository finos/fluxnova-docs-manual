---

title: 'Add a User Task to the Process (4/6)'
weight: 40

menu:
  main:
    name: "Involve Humans"
    parent: "get-started-quick-start"
    identifier: "get-started-quick-start-model"
    pre: "Learn the basics of integrating user tasks into a Process and how to build forms with Fluxnova."

---

In this section, you'll learn how to involve humans in your process by using BPMN 2.0 *User Tasks*.

# Add a User Task
We want to modify our process so that we can involve humans.

To do so, open the process in the Fluxnova Modeler.

Select the create/remove space tool (<||>) from the Modeler's left-hand menu, and use it to create space between the Start Event and the "Charge Credit Card" Service Task (click and drag the cursor to the right). 

Next, from the Modeler's left-hand menu, select the activity shape (rounded rectangle) and drag it into position between the Start Event and the "Charge Credit Card" Service Task. Name it *Approve Payment*.
{{< img src="../img/modeler-usertask1.png" >}}

Change the activity type to *User Task* by clicking on it and using the wrench button menu.
{{< img src="../img/modeler-usertask2.png" >}}

# Configure a User Task

Next, open the properties view. If the properties view is not already visible, click on the "Properties Panel" label on the right-hand side of the Modeler canvas.

Select the User Task on the canvas. This will update the selection in the properties view. Scroll to the property named `Assignee`.
Type *demo* to automatically assign the task to the *demo* user once the process runs. 
{{< img src="../img/modeler-usertask3.png" >}}

# Configure a basic form in the User Task
This step will also take place in the properties panel. If the panel is not already visible, click on the "Properties Panel" label on the right-hand side of the Modeler canvas.

Select the User Task on the canvas. This will update the selection in the properties view.

Click on the Tab `Forms` in the properties panel.

This guide uses [Fluxnova Forms]({{< ref "/user-guide/task-forms/#fluxnova-forms" >}}) to add a form to the process. 
We will create a form file called `payment.form`. 
Set the following fields to link this process to the form you are about to create:

* Type: Fluxnova Forms
* Form Ref: payment-form
* Binding: deployment

{{< img src="../img/modeler-usertask-add.png" >}}

Now, create a new form by clicking *File > New File > Form* and add `payment-form` as the `Id` field.

{{< img src="../img/modeler-usertask-form.png" >}}

You can add form fields by dragging and dropping elements from the *FORM ELEMENTS LIBRARY* on the left.
Add the following three form fields:

Field 1:

  * Type: Number
  * Key: amount
  * Field Label: Amount

{{< img src="../img/modeler-usertask4.png" >}}

Field 2:

  * Type: Text Field
  * Key: item
  * Field Label: Item

{{< img src="../img/modeler-usertask5.png" >}}

Field 3:

  * Type: Checkbox
  * Key: approved
  * Label: Approved?

{{< img src="../img/modeler-usertask6.png" >}}

Now, select Fluxnova Platform as the execution platform in the lower left corner of the modeler and hit *Apply*.
{{< img src="../img/modeler-platform-selection.png" >}}
Finally, save the form as `payment.form`.

# Deploy the Process

1. Switch back to the process diagram
2. Click the Deploy button in the Fluxnova Modeler
3. In the deployment panel, select the `payment.form` file under *include additional files*
4. Click *Deploy*

{{< img src="../img/modeler-deploy-form.png" >}}


# Work on the Task

Go to Tasklist ([http://localhost:8080/fluxnova/app/tasklist/](http://localhost:8080/fluxnova/app/tasklist/)) and log in with the credentials "demo / demo".
Click on the {{< glyphicon name="list-alt" text=" Start process" >}} button to start a process instance. This opens a dialog where you can select *Payment Retrieval* from the list. Now you can set variables for the process instance using a generic form.

{{< img src="../img/start-form-generic.png" >}}

The generic form can be used whenever you have not added a dedicated form for a User Task or a Start Event.
Click on the *Add a variable* button to create a new row. Fill in the form as shown in the screenshot. When you're done, click *Start*.

{{< note class="info" title="Hint" >}}
If you don't see any tasks in your Tasklist, you might need a filter. Add one by clicking *Add a simple filter* on the left.
{{< /note >}}

You should now see the *Approve Payment* task in your Tasklist. Select the task and click on the *Diagram* tab. This displays the process diagram highlighting the User Task that's waiting to be worked on.

{{< img src="../img/diagram.png" >}}

To work on the task, select the *Form* tab. Because we defined the variables in the Form Tab in the Fluxnova Modeler, the Tasklist has automatically generated form fields for us.

{{< img src="../img/task-form-generated.png" >}}

{{< note title="Next Step" class="info" >}}
Next, we'll make the process more dynamic and only show a User Task in certain situations. Let's have a look how you can [add Gateways to your Process]({{< ref "/get-started/quick-start/gateway/" >}}).
{{< /note >}}

{{< get-tag repo="fluxnova-get-started-quickstart" tag="Step-3" >}}
