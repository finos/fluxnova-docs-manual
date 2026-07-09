---

title: 'Extension Elements'
weight: 60

menu:
  main:
    identifier: "user-guide-cmmn-model-api-extension-elements"
    parent: "user-guide-cmmn-model-api"

---


[Custom extension elements]({{< relref "/reference/cmmn11/custom-extensions/_index.md" >}}) are a standardized way to extend the CMMN model.
The [Fluxnova extension elements]({{< relref "/reference/cmmn11/custom-extensions/fluxnova-elements.md" >}}) are fully implemented in the CMMN model API but unknown extension elements can also easily be accessed and added.

Every CMMN `CmmnElement` can have a child element of the type `extensionElements`.
This element can contain all sorts of extension elements. To access the
extension elements you have to call the `getExtensionElements()` method and, 
if no such child element exists, you must create one first.

```java
HumanTask humanTask = modelInstance.newInstance(HumanTask.class);
ExtensionElements extensionElements = humanTask.getExtensionElements();
if (extensionElements == null) {
  extensionElements = modelInstance.newInstance(ExtensionElements.class);
  humanTask.setExtensionElements(extensionElements);
}
Collection<ModelElementInstance> elements = extensionElements.getElements();
```

After that you can add or remove extension elements to the collection.

```java
FluxnovaCaseExecutionListener listener = modelInstance.newInstance(FluxnovaCaseExecutionListener.class);
extensionElements.getElements().add(listener);
extensionElements.getElements().remove(listener);
```

You can also access a query-like interface to filter the extension elements.

```java
extensionElements.getElementsQuery().count();
extensionElements.getElementsQuery().list();
extensionElements.getElementsQuery().singleResult();
extensionElements.getElementsQuery().filterByType(FluxnovaCaseExecutionListener.class).singleResult();
```

Additionally, there are some shortcuts to add new extension elements. You can use
the `namespaceUri` and the `elementName` to add your own extension elements. Or
you can use the `class` of a known extension element type, e.g., the Fluxnova
extension elements. The extension element is added to the CMMN element and returned
so that you can set attributes or add child elements.

```java
ModelElementInstance element = extensionElements.addExtensionElement("http://example.com/cmmn", "myExtensionElement");
FluxnovaCaseExecutionListener listener = extensionElements.addExtensionElement(FluxnovaCaseExecutionListener.class);
```
