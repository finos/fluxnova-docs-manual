---

title: 'Extension Attributes'
weight: 60

menu:
  main:
    identifier: "user-guide-dmn-model-api-extension-attributes"
    parent: "user-guide-dmn-model-api"

---


[Custom extensions]({{< relref "/reference/dmn/custom-extensions/_index.md" >}}) are a standardized way to extend the DMN model.
The [Fluxnova extension attributes]({{< relref "/reference/dmn/custom-extensions/fluxnova-attributes.md" >}}) are fully implemented in the DMN model API.

Every DMN `Decision` element can have the attributes `historyTimeToLive` and `versionTag`.
To access the extension attributes, you have to call the `Decision#getFluxnovaHistoryTimeToLiveString()` and 
`Decision#getVersionTag()` methods. 

```java
String historyTimeToLive = decision.getFluxnovaHistoryTimeToLiveString();
String versionTag = decision.getVersionTag();
```
To set attributes, use `Decision#setFluxnovaHistoryTimeToLiveString()` and `Decision#setVersionTag()`
```java
decision.setFluxnovaHistoryTimeToLiveString("1000");
decision.setVersionTag("1.0.0");
```

Every `Input` element can have an `inputVariable` attribute.
This attribute specifies the variable name which can be used to access the result of the input expression in an input entry expression.
It can be set and fetched similarly, calling `Input#setFluxnovaInputVariable()` and `Input#getFluxnovaInputVariable()`:

```java
input.setFluxnovaInputVariable("fluxnovaInput");
String fluxnovaInput = input.getFluxnovaInputVariable();
```
