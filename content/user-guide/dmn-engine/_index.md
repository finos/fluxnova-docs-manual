---

title: "DMN Engine"
weight: 200

menu:
  main:
    identifier: "user-guide-dmn-engine"
    parent: "user-guide"

---

The Fluxnova DMN engine is a Java library which can evaluate DMN decision tables.
It implements version 1.3 of the OMG [DMN](http://www.omg.org/spec/DMN/1.3) standard to the extent documented in the [DMN reference].

The DMN engine can be used as library embedded in an
application or in combination with Fluxnova. This section
covers how to embed the library and use it to evaluate decisions. For more
information on the integration in Fluxnova, please see the
[corresponding section][platform]. You can read more about the DMN 1.3 standard
in the [DMN reference].

A complete example how to embed the decision engine and test
decisions can be found on [GitHub].


[platform]: {{< relref "/user-guide/process-engine/decisions/_index.md" >}}
[DMN reference]: {{< relref "/reference/dmn/_index.md" >}}
[GitHub]: https://github.com/finos/fluxnova-bpm-examples/tree/master/dmn-engine/dmn-engine-java-main-method
