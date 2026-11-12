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

# Variable Instance Business Keys

Variable-instance and historic-variable-instance query responses include the `businessKey` of the process instance that owns the variable.

The list endpoints also support filtering by business key:

* `businessKey` matches an exact business key.
* `businessKeyLike` matches a pattern; use `%` as a wildcard for starts-with, ends-with, or contains matches.

For example, `/engine-rest/variable-instance?businessKey=order-123` returns runtime variable instances for the matching process instance, and `/engine-rest/history/variable-instance?businessKeyLike=order-%` filters historic variable instances by a business key that starts with `order-`.

# valueInfo Flags

In addition to type-specific metadata, `valueInfo` supports the following common flags:

* `transient`: Marks a variable as transient (not persisted).
* `restricted`: Marks a variable as restricted and subject to restricted-variable authorization checks.

For updates, the `restricted` flag in the request determines the resulting restriction state. Include `"restricted": true` in `valueInfo` on every update that should leave the variable restricted. If the flag is `false` or omitted, the updated variable becomes unrestricted. Changing the value or restriction state of an existing restricted variable requires Update Restricted permission; an unchanged resubmission that retains `true` does not change either.

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

For restricted runtime-variable reads, variables are filtered from response payloads when the caller has neither Read Restricted nor Update Restricted permission. Update Restricted implies Read Restricted for runtime variables. Historic variables remain governed by Read History Restricted. Normal process or task access permissions still apply.

This affects list and query-style variable responses most notably, where non-readable restricted variables are not returned.

## Write behavior

Changing the value or restriction state of an existing restricted variable requires Update Restricted permission. Creating a restricted variable requires Create Restricted; deleting one requires Delete Restricted. Missing permission results in an authorization error. Update Restricted does not grant Read History Restricted or Delete History Restricted.

## Practical endpoint guidance

When using variable endpoints, apply the following expectations:

* List/query variables: expect partial results when some restricted variables are not readable.
* Read variable details: expect restricted content to be hidden when Read Restricted permission is missing and filtering applies.
* Create/update/delete variable operations: expect authorization errors when the corresponding restricted-variable permission is not granted.

For permission modeling, see [Authorization Service]({{< ref "/user-guide/process-engine/authorization-service.md" >}}). For conceptual behavior, see [Process Variables]({{< ref "/user-guide/process-engine/variables.md" >}}).
