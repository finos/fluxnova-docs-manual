---

title: "Variables in the REST API"
weight: 50

menu:
  main:
    identifier: "rest-api-overview-variables"
    parent: "rest-api-overview"

---

In the REST API, [process variables]({{< relref "/user-guide/process-engine/variables.md" >}}) are represented by JSON objects of the following
form:

```json
{
  "type": "String",
  "value": "Some value",
  "valueInfo": {}

}
```

The REST API supports the [Value Types]({{< relref "/user-guide/process-engine/variables.md#supported-variable-values" >}}) supported by the process engine.

# valueInfo Flags

In addition to type-specific metadata, `valueInfo` supports the following common flags:

* `transient`: Marks a variable as transient (not persisted).
* `restricted`: Marks a variable as restricted and subject to restricted-variable authorization checks.

Example:

```json
{
  "type": "String",
  "value": "sensitive value",
  "valueInfo": {
    "restricted": true,
    "transient": false
  }
}
```


# Capitalization of Type Names

In the REST API, the type names start with a capital letter, i.e., `String` instead of `string`.


# Serialized and Deserialized Object Values

Object Values are instances of (non primitive) Java types. When working with the REST API, it is
generally advisable to work with the serialized value of a variable. In that case the value is
retrieved from the database and directly returned in the http response. If the client you are
building is not a Java Applications by itself, make sure you use a text-based
[serialization dataformat]({{< relref "/user-guide/process-engine/variables.md#object-value-serialization" >}}) (such as XML or JSON).

{{< note title="" class="info" >}}
  To retrieve the serialized form of a variable, use the `deserializeValues=false` GET parameter.
{{< /note >}}


# Serialize Variables of type Object in REST API

In the REST API, [process variables]({{< relref "/user-guide/process-engine/variables.md" >}}) of type Object can be serialized in JSON or XML format.

Serializing Object into JSON format:

```json
	{
	   "variables": {
	      "aVariable": {
	         "value": "{\"somekey\": \"somevalue\"}",
	         "type": "Object",
	         "valueInfo": {
	            "objectTypeName": "com.fluxnova.SomeClass",
	            "serializationDataFormat": "application/json"
	         }
	      }
	   }
	}
```

Serializing Object into XML format:

```json
	{
	   "variables": {
	      "aVariable": {
	         "value": "<somekey>somevalue</somekey>",
	         "type": "Object",
	         "valueInfo": {
	            "objectTypeName": "com.fluxnova.SomeClass",
	            "serializationDataFormat": "application/xml"
	         }
	      }
	   }
	}
```


# Restricted Variables in REST

Restricted variables use permission checks on the dedicated Variable resource in addition to normal variable scope resolution. The authorization resource id must be the wildcard `*`.

## Read behavior

For read operations, restricted variables follow filtering semantics. If the caller has no Read Restricted permission for a restricted variable, that variable is omitted from response payloads where filtering applies.

This affects list and query-style variable responses most notably, where non-readable restricted variables are not returned.

## Write behavior

For create, update, and delete operations on restricted variables, missing Create Restricted, Update Restricted, or Delete Restricted permission results in an authorization error.

## Practical endpoint guidance

When using variable endpoints, apply the following expectations:

* List/query variables: expect partial results when some restricted variables are not readable.
* Read variable details: expect restricted content to be hidden when Read Restricted permission is missing and filtering applies.
* Create/update/delete variable operations: expect authorization errors when the corresponding restricted-variable permission is not granted.

For permission modeling, see [Authorization Service]({{< ref "/user-guide/process-engine/authorization-service.md" >}}). For conceptual behavior, see [Process Variables]({{< ref "/user-guide/process-engine/variables.md" >}}).

