---

title: 'Building Forms in Fluxnova Modeler'
weight: 25

menu:
  main:
    name: "Forms"
    identifier: "fluxnova-modeler-forms"
    parent: "modeler"
    pre: "How to build Fluxnova Forms using the Fluxnova Modeler."

---

# Overview

The Fluxnova Forms feature allows you to easily design and configure forms. Once configured, they can be [connected to a User Task or Start Event]({{< relref "/user-guide/task-forms/_index.md#fluxnova-forms" >}}) so to implement a task form in your application.

# Quickstart

## Create new Form

To start building a form, in the **File** menu click **Create new Form (Fluxnova Platform or Cloud)**.

{{< img src="img/create-form.png" title="Create new Fluxnova Form file" >}}

## Build your From

Now you can start to build your Fluxnova Form. Add the desired elements from the palette on the left hand side by dragging and dropping them onto the canvas.

{{< img src="img/build-form.png" title="Drag and drop elements to build a Fluxnova Form" >}}

In the properties panel on the right hand side, you can view and edit attributes that apply to the currently selected form element. Please refer to the [Fluxnova Forms Reference]({{< relref "/reference/forms/fluxnova-forms/_index.md#configuration" >}}) to explore all configuration options for form elements.

{{< img src="img/form-properties-panel.png" title="Fluxnova Form Properties Panel" >}}

## Save your Form

To save your state of work, click the **File > Save File As...** button in the top-level menu. Then select a location on your file system to store the form as `.form` file. You can load that file again by clicking **File > Open File...**.

## Connect your Form to a BPMN diagram

You can connect your Fluxnova Form to a User Task or Start Event, so to implement a task form in your application. Refer to the [User Task Forms guide]({{< relref "/user-guide/task-forms/_index.md#fluxnova-forms" >}}) to learn how.
