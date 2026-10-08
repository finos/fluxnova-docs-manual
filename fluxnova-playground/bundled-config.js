'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch (e) {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

/**
 * Checks whether node is of specific bpmn type.
 *
 * @param {ModdleElement} node
 * @param {String} type
 *
 * @return {Boolean}
 */
function is(node, type) {

  if (type.indexOf(':') === -1) {
    type = 'bpmn:' + type;
  }

  return (
    (typeof node.$instanceOf === 'function')
      ? node.$instanceOf(type)
      : node.$type === type
  );
}

/**
 * Checks whether node has any of the specified types.
 *
 * @param {ModdleElement} node
 * @param {Array<String>} types
 *
 * @return {Boolean}
 */
function isAny(node, types) {
  return types.some(function(type) {
    return is(node, type);
  });
}

var index_esm = /*#__PURE__*/Object.freeze({
	__proto__: null,
	is: is,
	isAny: isAny
});

var require$$1$1 = /*@__PURE__*/getAugmentedNamespace(index_esm);

var helper$1 = {};

var hasRequiredHelper$1;

function requireHelper$1 () {
	if (hasRequiredHelper$1) return helper$1;
	hasRequiredHelper$1 = 1;
	const {
	  is
	} = require$$1$1;

	/**
	 * @typedef { import('../lib/types.js').ModdleElement } ModdleElement
	 *
	 * @typedef { import('../lib/types.js').RuleFactory } RuleFactory
	 * @typedef { import('../lib/types.js').RuleDefinition } RuleDefinition
	 */


	/**
	 * Create a checker that disallows the given element type.
	 *
	 * @param { string } type
	 *
	 * @return { RuleFactory } ruleFactory
	 */
	function checkDiscouragedNodeType(type, ruleName) {

	  /**
	   * @type { RuleFactory }
	   */
	  return function() {

	    function check(node, reporter) {

	      if (is(node, type)) {
	        reporter.report(node.id, 'Element type <' + type + '> is discouraged');
	      }
	    }

	    return annotateRule(ruleName, {
	      check
	    });

	  };

	}

	helper$1.checkDiscouragedNodeType = checkDiscouragedNodeType;


	/**
	 * Find a parent for the given element
	 *
	 * @param { ModdleElement } node
	 * @param { string } type
	 *
	 * @return { ModdleElement } element
	 */
	function findParent(node, type) {
	  if (!node) {
	    return null;
	  }

	  const parent = node.$parent;

	  if (!parent) {
	    return node;
	  }

	  if (is(parent, type)) {
	    return parent;
	  }

	  return findParent(parent, type);
	}

	helper$1.findParent = findParent;


	/**
	 * Check if the node is inside of an executable process.
	 *
	 * @param { ModdleElement } node
	 *
	 * @return { boolean }
	 */
	function isInExecutableProcess(node) {
	  const process = findParent(node, 'bpmn:Process');

	  return process && process.isExecutable;
	}

	helper$1.isInExecutableProcess = isInExecutableProcess;


	const documentationBaseUrl = 'https://github.com/bpmn-io/bpmnlint/blob/main/docs/rules';

	/**
	 * Annotate a rule with core information, such as the documentation url.
	 *
	 * @param {string} ruleName
	 * @param {RuleDefinition} options
	 *
	 * @return {RuleDefinition}
	 */
	function annotateRule(ruleName, options) {

	  const {
	    meta: {
	      documentation = {},
	      ...restMeta
	    } = {},
	    ...restOptions
	  } = options;

	  const documentationUrl = `${documentationBaseUrl}/${ruleName}.md`;

	  return {
	    meta: {
	      documentation: {
	        url: documentationUrl,
	        ...documentation
	      },
	      ...restMeta
	    },
	    ...restOptions
	  };
	}

	helper$1.annotateRule = annotateRule;
	return helper$1;
}

var adHocSubProcess;
var hasRequiredAdHocSubProcess;

function requireAdHocSubProcess () {
	if (hasRequiredAdHocSubProcess) return adHocSubProcess;
	hasRequiredAdHocSubProcess = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that ensures that an Ad Hoc Sub Process is valid according to the BPMN spec:
	 *
	 * - No start or end events
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	adHocSubProcess = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:AdHocSubProcess')) {
	      return;
	    }

	    const flowElements = node.flowElements || [];

	    flowElements.forEach(function(flowElement) {

	      if (is(flowElement, 'bpmn:StartEvent')) {
	        reporter.report(flowElement.id, 'A <Start Event> is not allowed in <Ad Hoc Sub Process>');
	      }

	      if (is(flowElement, 'bpmn:EndEvent')) {
	        reporter.report(flowElement.id, 'An <End Event> is not allowed in <Ad Hoc Sub Process>');
	      }
	    });
	  }

	  return annotateRule('ad-hoc-sub-process', {
	    check
	  });

	};
	return adHocSubProcess;
}

var adHocSubProcessExports = requireAdHocSubProcess();
var rule_0 = /*@__PURE__*/getDefaultExportFromCjs(adHocSubProcessExports);

var conditionalFlows;
var hasRequiredConditionalFlows;

function requireConditionalFlows () {
	if (hasRequiredConditionalFlows) return conditionalFlows;
	hasRequiredConditionalFlows = 1;
	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks that sequence flows outgoing from a
	 * conditional forking gateway or activity are
	 * either default flows _or_ have a condition attached
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	conditionalFlows = function() {

	  function check(node, reporter) {

	    if (!isConditionalForking(node)) {
	      return;
	    }

	    const outgoing = node.outgoing || [];

	    outgoing.forEach((flow) => {
	      const missingCondition = (
	        !hasCondition(flow) &&
	        !isDefaultFlow(node, flow)
	      );

	      if (missingCondition) {
	        reporter.report(flow.id, 'Sequence flow is missing condition', [ 'conditionExpression' ]);
	      }
	    });
	  }

	  return annotateRule('conditional-flows', {
	    check
	  });

	};


	// helpers /////////////////////////////

	function isConditionalForking(node) {

	  const defaultFlow = node['default'];
	  const outgoing = node.outgoing || [];

	  return defaultFlow || outgoing.find(hasCondition);
	}

	function hasCondition(flow) {
	  return !!flow.conditionExpression;
	}

	function isDefaultFlow(node, flow) {
	  return node['default'] === flow;
	}
	return conditionalFlows;
}

var conditionalFlowsExports = requireConditionalFlows();
var rule_1 = /*@__PURE__*/getDefaultExportFromCjs(conditionalFlowsExports);

var endEventRequired;
var hasRequiredEndEventRequired;

function requireEndEventRequired () {
	if (hasRequiredEndEventRequired) return endEventRequired;
	hasRequiredEndEventRequired = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks the presence of an end event per scope.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	endEventRequired = function() {

	  function hasEndEvent(node) {
	    const flowElements = node.flowElements || [];

	    return (
	      flowElements.some(node => is(node, 'bpmn:EndEvent'))
	    );
	  }

	  function check(node, reporter) {

	    if (!isAny(node, [
	      'bpmn:Process',
	      'bpmn:SubProcess'
	    ]) || is(node, 'bpmn:AdHocSubProcess')) {
	      return;
	    }

	    if (!hasEndEvent(node)) {
	      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

	      reporter.report(node.id, type + ' is missing end event');
	    }
	  }

	  return annotateRule('end-event-required', {
	    check
	  });
	};
	return endEventRequired;
}

var endEventRequiredExports = requireEndEventRequired();
var rule_2 = /*@__PURE__*/getDefaultExportFromCjs(endEventRequiredExports);

var eventBasedGateway;
var hasRequiredEventBasedGateway;

function requireEventBasedGateway () {
	if (hasRequiredEventBasedGateway) return eventBasedGateway;
	hasRequiredEventBasedGateway = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks, whether an event-based gateway:
	 * - has at least two outgoing sequence flows
	 * - the outgoing sequence flows are not conditional
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	eventBasedGateway = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:EventBasedGateway')) {
	      return;
	    }

	    const outgoing = node.outgoing || [];

	    if (outgoing.length < 2) {
	      reporter.report(node.id, 'An <Event-based Gateway> must have at least 2 outgoing <Sequence Flows>');
	    }

	    outgoing.forEach((flow) => {
	      if (hasCondition(flow)) {
	        reporter.report(flow.id, 'A <Sequence Flow> outgoing from an <Event-based Gateway> must not be conditional');
	      }
	    });
	  }

	  return annotateRule('event-based-gateway', {
	    check
	  });
	};

	function hasCondition(flow) {
	  return !!flow.conditionExpression;
	}
	return eventBasedGateway;
}

var eventBasedGatewayExports = requireEventBasedGateway();
var rule_3 = /*@__PURE__*/getDefaultExportFromCjs(eventBasedGatewayExports);

var eventSubProcessTypedStartEvent;
var hasRequiredEventSubProcessTypedStartEvent;

function requireEventSubProcessTypedStartEvent () {
	if (hasRequiredEventSubProcessTypedStartEvent) return eventSubProcessTypedStartEvent;
	hasRequiredEventSubProcessTypedStartEvent = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks that start events inside an event sub-process
	 * are typed.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	eventSubProcessTypedStartEvent = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:SubProcess') || !node.triggeredByEvent) {
	      return;
	    }

	    const flowElements = node.flowElements || [];

	    flowElements.forEach(function(flowElement) {

	      if (!is(flowElement, 'bpmn:StartEvent')) {
	        return false;
	      }

	      const eventDefinitions = flowElement.eventDefinitions || [];

	      if (eventDefinitions.length === 0) {
	        reporter.report(flowElement.id, 'Start event is missing event definition', [ 'eventDefinitions' ]);
	      }
	    });
	  }

	  return annotateRule('event-sub-process-typed-start-event', {
	    check
	  });

	};
	return eventSubProcessTypedStartEvent;
}

var eventSubProcessTypedStartEventExports = requireEventSubProcessTypedStartEvent();
var rule_4 = /*@__PURE__*/getDefaultExportFromCjs(eventSubProcessTypedStartEventExports);

var fakeJoin;
var hasRequiredFakeJoin;

function requireFakeJoin () {
	if (hasRequiredFakeJoin) return fakeJoin;
	hasRequiredFakeJoin = 1;
	const {
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks that no fake join is modeled by attempting
	 * to give a task or event join semantics.
	 *
	 * Users should model a parallel joining gateway
	 * to achieve the desired behavior.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	fakeJoin = function() {

	  function check(node, reporter) {

	    if (!isAny(node, [
	      'bpmn:Activity',
	      'bpmn:Event'
	    ])) {
	      return;
	    }

	    const incoming = node.incoming || [];

	    if (incoming.length > 1) {
	      reporter.report(node.id, 'Incoming flows do not join');
	    }
	  }

	  return annotateRule('fake-join', {
	    check
	  });

	};
	return fakeJoin;
}

var fakeJoinExports = requireFakeJoin();
var rule_5 = /*@__PURE__*/getDefaultExportFromCjs(fakeJoinExports);

var global;
var hasRequiredGlobal;

function requireGlobal () {
	if (hasRequiredGlobal) return global;
	hasRequiredGlobal = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that verifies that global elements are properly used.
	 *
	 * Currently recognized global elements are:
	 *
	 *   * `bpmn:Error`
	 *   * `bpmn:Escalation`
	 *   * `bpmn:Message`
	 *   * `bpmn:Signal`
	 *
	 * For each of these elements proper usage implies:
	 *
	 *   * element must have a name
	 *   * element is referenced by at least one element
	 *   * there exists only a single element per type with a given name
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	global = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:Definitions')) {
	      return false;
	    }

	    const rootElements = getRootElements(node);

	    const referencingElements = getReferencingElements(node);

	    rootElements.forEach(rootElement => {
	      if (!hasName(rootElement)) {
	        reporter.report(rootElement.id, 'Element is missing name');
	      }

	      if (!isReferenced(rootElement, referencingElements)) {
	        reporter.report(rootElement.id, 'Element is unused');
	      }

	      if (!isUnique(rootElement, rootElements)) {
	        reporter.report(rootElement.id, 'Element name is not unique');
	      }
	    });

	  }

	  return annotateRule('global', {
	    check
	  });

	  // helpers /////////////////////////////

	  function getRootElements(definitions) {
	    return definitions.rootElements.filter(node => isAny(node, [ 'bpmn:Error', 'bpmn:Escalation', 'bpmn:Message', 'bpmn:Signal' ]));
	  }

	  function getReferencingElements(definitions) {
	    const referencingElements = [];

	    function traverse(element) {
	      if (is(element, 'bpmn:Definitions') && element.get('rootElements').length) {
	        element.get('rootElements').forEach(traverse);
	      }

	      if (is(element, 'bpmn:FlowElementsContainer') && element.get('flowElements').length) {
	        element.get('flowElements').forEach(traverse);
	      }

	      if (is(element, 'bpmn:Event') && element.get('eventDefinitions').length) {
	        element.get('eventDefinitions').forEach(eventDefinition => referencingElements.push(eventDefinition));
	      }

	      if (is(element, 'bpmn:Collaboration') && element.get('messageFlows').length) {
	        element.get('messageFlows').forEach(traverse);
	      }

	      if (isAny(element, [
	        'bpmn:MessageFlow',
	        'bpmn:ReceiveTask',
	        'bpmn:SendTask'
	      ])) {
	        referencingElements.push(element);
	      }
	    }

	    traverse(definitions);

	    return referencingElements;
	  }

	  function hasName(event) {
	    return (
	      event.name?.trim() !== ''
	    );
	  }

	  function isReferenced(rootElement, referencingElements) {
	    if (is(rootElement, 'bpmn:Error')) {
	      return referencingElements.some(referencingElement => {
	        return is(referencingElement, 'bpmn:ErrorEventDefinition')
	          && rootElement.get('id') === referencingElement.get('errorRef')?.get('id');
	      });
	    }

	    if (is(rootElement, 'bpmn:Escalation')) {
	      return referencingElements.some(referencingElement => {
	        return is(referencingElement, 'bpmn:EscalationEventDefinition')
	          && rootElement.get('id') === referencingElement.get('escalationRef')?.get('id');
	      });
	    }

	    if (is(rootElement, 'bpmn:Message')) {
	      return referencingElements.some(referencingElement => {
	        return isAny(referencingElement, [
	          'bpmn:MessageEventDefinition',
	          'bpmn:MessageFlow',
	          'bpmn:ReceiveTask',
	          'bpmn:SendTask'
	        ]) && rootElement.get('id') === referencingElement.get('messageRef')?.get('id');
	      });
	    }

	    if (is(rootElement, 'bpmn:Signal')) {
	      return referencingElements.some(referencingElement => {
	        return is(referencingElement, 'bpmn:SignalEventDefinition')
	          && rootElement.get('id') === referencingElement.get('signalRef')?.get('id');
	      });
	    }
	  }

	  function isUnique(rootElement, rootElements) {
	    return (
	      rootElements.filter(otherRootElement => is(otherRootElement, rootElement.$type) && rootElement.name === otherRootElement.name).length === 1
	    );
	  }
	};
	return global;
}

var globalExports = requireGlobal();
var rule_6 = /*@__PURE__*/getDefaultExportFromCjs(globalExports);

var labelRequired;
var hasRequiredLabelRequired;

function requireLabelRequired () {
	if (hasRequiredLabelRequired) return labelRequired;
	hasRequiredLabelRequired = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks the presence of a label.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	labelRequired = function() {

	  function check(node, reporter) {

	    if (isAny(node, [
	      'bpmn:ParallelGateway',
	      'bpmn:EventBasedGateway'
	    ])) {
	      return;
	    }

	    // ignore joining gateways
	    if (is(node, 'bpmn:Gateway') && !isForking(node)) {
	      return;
	    }

	    // ignore sub-processes
	    if (is(node, 'bpmn:SubProcess')) {

	      // TODO(nikku): better ignore expanded sub-processes only
	      return;
	    }

	    // ignore sequence flow without condition
	    if (is(node, 'bpmn:SequenceFlow') && !hasCondition(node)) {
	      return;
	    }

	    // ignore data objects and artifacts for now
	    if (isAny(node, [
	      'bpmn:FlowNode',
	      'bpmn:SequenceFlow',
	      'bpmn:Participant',
	      'bpmn:Lane'
	    ])) {

	      const name = (node.name || '').trim();

	      if (name.length === 0) {
	        reporter.report(node.id, 'Element is missing label/name', [ 'name' ]);
	      }
	    }
	  }

	  return annotateRule('label-required', {
	    check
	  });
	};


	// helpers ////////////////////////

	function isForking(node) {
	  const outgoing = node.outgoing || [];

	  return outgoing.length > 1;
	}

	function hasCondition(node) {
	  return node.conditionExpression;
	}
	return labelRequired;
}

var labelRequiredExports = requireLabelRequired();
var rule_7 = /*@__PURE__*/getDefaultExportFromCjs(labelRequiredExports);

/**
 * Flatten array, one level deep.
 *
 * @template T
 *
 * @param {T[][] | T[] | null} [arr]
 *
 * @return {T[]}
 */
function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function isUndefined(obj) {
  return obj === undefined;
}

function isDefined(obj) {
  return obj !== undefined;
}

function isNil(obj) {
  return obj == null;
}

function isArray(obj) {
  return nativeToString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return nativeToString.call(obj) === '[object Object]';
}

function isNumber(obj) {
  return nativeToString.call(obj) === '[object Number]';
}

/**
 * @param {any} obj
 *
 * @return {boolean}
 */
function isFunction(obj) {
  const tag = nativeToString.call(obj);

  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object AsyncGeneratorFunction]' ||
    tag === '[object Proxy]'
  );
}

function isString(obj) {
  return nativeToString.call(obj) === '[object String]';
}


/**
 * Ensure collection is an array.
 *
 * @param {Object} obj
 */
function ensureArray(obj) {

  if (isArray(obj)) {
    return;
  }

  throw new Error('must supply array');
}

/**
 * Return true, if target owns a property with the given key.
 *
 * @param {Object} target
 * @param {String} key
 *
 * @return {Boolean}
 */
function has(target, key) {
  return !isNil(target) && nativeHasOwnProperty.call(target, key);
}

/**
 * @template T
 * @typedef { (
 *   ((e: T) => boolean) |
 *   ((e: T, idx: number) => boolean) |
 *   ((e: T, key: string) => boolean) |
 *   string |
 *   number
 * ) } Matcher
 */

/**
 * @template T
 * @template U
 *
 * @typedef { (
 *   ((e: T) => U) | string | number
 * ) } Extractor
 */


/**
 * @template T
 * @typedef { (val: T, key: any) => boolean } MatchFn
 */

/**
 * @template T
 * @typedef { T[] } ArrayCollection
 */

/**
 * @template T
 * @typedef { { [key: string]: T } } StringKeyValueCollection
 */

/**
 * @template T
 * @typedef { { [key: number]: T } } NumberKeyValueCollection
 */

/**
 * @template T
 * @typedef { StringKeyValueCollection<T> | NumberKeyValueCollection<T> } KeyValueCollection
 */

/**
 * @template T
 * @typedef { KeyValueCollection<T> | ArrayCollection<T> } Collection
 */

/**
 * Find element in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {Object}
 */
function find(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let match;

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      match = val;

      return false;
    }
  });

  return match;

}


/**
 * Find element index in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {number | string | undefined}
 */
function findIndex(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let idx = isArray(collection) ? -1 : undefined;

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      idx = key;

      return false;
    }
  });

  return idx;
}


/**
 * Filter elements in collection.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param {Matcher<T>} matcher
 *
 * @return {T[]} result
 */
function filter(collection, matcher) {

  const matchFn = toMatcher(matcher);

  let result = [];

  forEach(collection, function(val, key) {
    if (matchFn(val, key)) {
      result.push(val);
    }
  });

  return result;
}


/**
 * Iterate over collection; returning something
 * (non-undefined) will stop iteration.
 *
 * @template T
 * @param {Collection<T>} collection
 * @param { ((item: T, idx: number) => (boolean|void)) | ((item: T, key: string) => (boolean|void)) } iterator
 *
 * @return {T} return result that stopped the iteration
 */
function forEach(collection, iterator) {

  let val,
      result;

  if (isUndefined(collection)) {
    return;
  }

  const convertKey = isArray(collection) ? toNum : identity;

  for (let key in collection) {

    if (has(collection, key)) {
      val = collection[key];

      result = iterator(val, convertKey(key));

      if (result === false) {
        return val;
      }
    }
  }
}

/**
 * Return collection without element.
 *
 * @template T
 * @param {ArrayCollection<T>} arr
 * @param {Matcher<T>} matcher
 *
 * @return {T[]}
 */
function without(arr, matcher) {

  if (isUndefined(arr)) {
    return [];
  }

  ensureArray(arr);

  const matchFn = toMatcher(matcher);

  return arr.filter(function(el, idx) {
    return !matchFn(el, idx);
  });

}


/**
 * Reduce collection, returning a single result.
 *
 * @template T
 * @template V
 *
 * @param {Collection<T>} collection
 * @param {(result: V, entry: T, index: any) => V} iterator
 * @param {V} result
 *
 * @return {V} result returned from last iterator
 */
function reduce(collection, iterator, result) {

  forEach(collection, function(value, idx) {
    result = iterator(result, value, idx);
  });

  return result;
}


/**
 * Return true if every element in the collection
 * matches the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function every(collection, matcher) {

  return !!reduce(collection, function(matches, val, key) {
    return matches && matcher(val, key);
  }, true);
}


/**
 * Return true if some elements in the collection
 * match the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function some(collection, matcher) {

  return !!find(collection, matcher);
}


/**
 * Transform a collection into another collection
 * by piping each member through the given fn.
 *
 * @param  {Object|Array}   collection
 * @param  {Function} fn
 *
 * @return {Array} transformed collection
 */
function map(collection, fn) {

  let result = [];

  forEach(collection, function(val, key) {
    result.push(fn(val, key));
  });

  return result;
}


/**
 * Get the collections keys.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function keys(collection) {
  return collection && Object.keys(collection) || [];
}


/**
 * Shorthand for `keys(o).length`.
 *
 * @param  {Object|Array} collection
 *
 * @return {Number}
 */
function size(collection) {
  return keys(collection).length;
}


/**
 * Get the values in the collection.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function values(collection) {
  return map(collection, (val) => val);
}


/**
 * Group collection members by attribute.
 *
 * @param {Object|Array} collection
 * @param {Extractor} extractor
 *
 * @return {Object} map with { attrValue => [ a, b, c ] }
 */
function groupBy(collection, extractor, grouped = {}) {

  extractor = toExtractor(extractor);

  forEach(collection, function(val) {
    let discriminator = extractor(val) || '_';

    let group = grouped[discriminator];

    if (!group) {
      group = grouped[discriminator] = [];
    }

    group.push(val);
  });

  return grouped;
}


function uniqueBy(extractor, ...collections) {

  extractor = toExtractor(extractor);

  let grouped = {};

  forEach(collections, (c) => groupBy(c, extractor, grouped));

  let result = map(grouped, function(val, key) {
    return val[0];
  });

  return result;
}


const unionBy = uniqueBy;



/**
 * Sort collection by criteria.
 *
 * @template T
 *
 * @param {Collection<T>} collection
 * @param {Extractor<T, number | string>} extractor
 *
 * @return {Array}
 */
function sortBy(collection, extractor) {

  extractor = toExtractor(extractor);

  let sorted = [];

  forEach(collection, function(value, key) {
    let disc = extractor(value, key);

    let entry = {
      d: disc,
      v: value
    };

    for (var idx = 0; idx < sorted.length; idx++) {
      let { d } = sorted[idx];

      if (disc < d) {
        sorted.splice(idx, 0, entry);
        return;
      }
    }

    // not inserted, append (!)
    sorted.push(entry);
  });

  return map(sorted, (e) => e.v);
}


/**
 * Create an object pattern matcher.
 *
 * @example
 *
 * ```javascript
 * const matcher = matchPattern({ id: 1 });
 *
 * let element = find(elements, matcher);
 * ```
 *
 * @template T
 *
 * @param {T} pattern
 *
 * @return { (el: any) =>  boolean } matcherFn
 */
function matchPattern(pattern) {

  return function(el) {

    return every(pattern, function(val, key) {
      return el[key] === val;
    });

  };
}


/**
 * @param {string | ((e: any) => any) } extractor
 *
 * @return { (e: any) => any }
 */
function toExtractor(extractor) {

  /**
   * @satisfies { (e: any) => any }
   */
  return isFunction(extractor) ? extractor : (e) => {

    // @ts-ignore: just works
    return e[extractor];
  };
}


/**
 * @template T
 * @param {Matcher<T>} matcher
 *
 * @return {MatchFn<T>}
 */
function toMatcher(matcher) {
  return isFunction(matcher) ? matcher : (e) => {
    return e === matcher;
  };
}


function identity(arg) {
  return arg;
}

function toNum(arg) {
  return Number(arg);
}

/**
 * @typedef { {
 *   (...args: any[]): any;
 *   flush: () => void;
 *   cancel: () => void;
 * } } DebouncedFunction
 */

/**
 * Debounce fn, calling it only once if the given time
 * elapsed between calls.
 *
 * Lodash-style the function exposes methods to `#clear`
 * and `#flush` to control internal behavior.
 *
 * @param  {Function} fn
 * @param  {Number} timeout
 *
 * @return {DebouncedFunction} debounced function
 */
function debounce(fn, timeout) {

  let timer;

  let lastArgs;
  let lastThis;

  let lastNow;

  function fire(force) {

    let now = Date.now();

    let scheduledDiff = force ? 0 : (lastNow + timeout) - now;

    if (scheduledDiff > 0) {
      return schedule(scheduledDiff);
    }

    fn.apply(lastThis, lastArgs);

    clear();
  }

  function schedule(timeout) {
    timer = setTimeout(fire, timeout);
  }

  function clear() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = lastNow = lastArgs = lastThis = undefined;
  }

  function flush() {
    if (timer) {
      fire(true);
    }

    clear();
  }

  /**
   * @type { DebouncedFunction }
   */
  function callback(...args) {
    lastNow = Date.now();

    lastArgs = args;
    lastThis = this;

    // ensure an execution is scheduled
    if (!timer) {
      schedule(timeout);
    }
  }

  callback.flush = flush;
  callback.cancel = clear;

  return callback;
}

/**
 * Throttle fn, calling at most once
 * in the given interval.
 *
 * @param  {Function} fn
 * @param  {Number} interval
 *
 * @return {Function} throttled function
 */
function throttle(fn, interval) {
  let throttling = false;

  return function(...args) {

    if (throttling) {
      return;
    }

    fn(...args);
    throttling = true;

    setTimeout(() => {
      throttling = false;
    }, interval);
  };
}

/**
 * Bind function against target <this>.
 *
 * @param  {Function} fn
 * @param  {Object}   target
 *
 * @return {Function} bound function
 */
function bind(fn, target) {
  return fn.bind(target);
}

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign(target, ...others) {
  return Object.assign(target, ...others);
}

/**
 * Sets a nested property of a given object to the specified value.
 *
 * This mutates the object and returns it.
 *
 * @template T
 *
 * @param {T} target The target of the set operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} value The value to set.
 *
 * @return {T}
 */
function set(target, path, value) {

  let currentTarget = target;

  forEach(path, function(key, idx) {

    if (typeof key !== 'number' && typeof key !== 'string') {
      throw new Error('illegal key type: ' + typeof key + '. Key should be of type number or string.');
    }

    if (key === 'constructor') {
      throw new Error('illegal key: constructor');
    }

    if (key === '__proto__') {
      throw new Error('illegal key: __proto__');
    }

    let nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
    }

    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });

  return target;
}


/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} [defaultValue] The value to return if no value exists.
 *
 * @return {any}
 */
function get(target, path, defaultValue) {

  let currentTarget = target;

  forEach(path, function(key) {

    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;

      return false;
    }

    currentTarget = currentTarget[key];
  });

  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

/**
 * Pick properties from the given target.
 *
 * @template T
 * @template {any[]} V
 *
 * @param {T} target
 * @param {V} properties
 *
 * @return Pick<T, V>
 */
function pick(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(properties, function(prop) {

    if (prop in obj) {
      result[prop] = target[prop];
    }
  });

  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @template T
 * @template {any[]} V
 *
 * @param {T} target
 * @param {V} properties
 *
 * @return {Omit<T, V>} target
 */
function omit(target, properties) {

  let result = {};

  let obj = Object(target);

  forEach(obj, function(prop, key) {

    if (properties.indexOf(key) === -1) {
      result[key] = prop;
    }
  });

  return result;
}

/**
 * Recursively merge `...sources` into given target.
 *
 * Does support merging objects; does not support merging arrays.
 *
 * @param {Object} target
 * @param {...Object} sources
 *
 * @return {Object} the target
 */
function merge(target, ...sources) {

  if (!sources.length) {
    return target;
  }

  forEach(sources, function(source) {

    // skip non-obj sources, i.e. null
    if (!source || !isObject(source)) {
      return;
    }

    forEach(source, function(sourceVal, key) {

      if (key === '__proto__') {
        return;
      }

      let targetVal = target[key];

      if (isObject(sourceVal)) {

        if (!isObject(targetVal)) {

          // override target[key] with object
          targetVal = {};
        }

        target[key] = merge(targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }

    });
  });

  return target;
}

var dist = /*#__PURE__*/Object.freeze({
	__proto__: null,
	assign: assign,
	bind: bind,
	debounce: debounce,
	ensureArray: ensureArray,
	every: every,
	filter: filter,
	find: find,
	findIndex: findIndex,
	flatten: flatten,
	forEach: forEach,
	get: get,
	groupBy: groupBy,
	has: has,
	isArray: isArray,
	isDefined: isDefined,
	isFunction: isFunction,
	isNil: isNil,
	isNumber: isNumber,
	isObject: isObject,
	isString: isString,
	isUndefined: isUndefined,
	keys: keys,
	map: map,
	matchPattern: matchPattern,
	merge: merge,
	omit: omit,
	pick: pick,
	reduce: reduce,
	set: set,
	size: size,
	some: some,
	sortBy: sortBy,
	throttle: throttle,
	unionBy: unionBy,
	uniqueBy: uniqueBy,
	values: values,
	without: without
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(dist);

var linkEvent$1;
var hasRequiredLinkEvent$1;

function requireLinkEvent$1 () {
	if (hasRequiredLinkEvent$1) return linkEvent$1;
	hasRequiredLinkEvent$1 = 1;
	const {
	  groupBy
	} = require$$0;

	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that verifies that link events are properly used.
	 *
	 * This implies:
	 *
	 *   * for every link throw there exists a link catch within
	 *     the same scope, and vice versa
	 *   * there exists only a single pair of [ throw, catch ] links
	 *     with a given name, per scope
	 *   * link events have a name
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	linkEvent$1 = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:FlowElementsContainer')) {
	      return;
	    }

	    const links = (node.flowElements || []).filter(isLinkEvent);

	    for (const link of links) {
	      if (!getLinkName(link)) {
	        reporter.report(link.id, 'Link event is missing link name');
	      }
	    }

	    const names = groupBy(links, link => getLinkName(link));

	    for (const [ name, events ] of Object.entries(names)) {

	      // ignore unnamed (validated earlier)
	      if (!name) {
	        continue;
	      }

	      // missing catch or throw event
	      if (events.length === 1) {
	        const event = events[0];

	        reporter.report(event.id, `Link ${isThrowEvent(event) ? 'catch' : 'throw' } event with link name <${ name }> missing in scope`);
	        continue;
	      }

	      const catchEvents = events.filter(isCatchEvent);
	      if (catchEvents.length > 1) {
	        for (const event of catchEvents) {
	          reporter.report(event.id, `Duplicate link catch event with link name <${name}> in scope`);
	        }
	      } else if (catchEvents.length === 0) {

	        // all events in scope are throw events
	        for (const event of events) {
	          reporter.report(event.id, `Link catch event with link name <${ name }> missing in scope`);
	        }
	      }
	    }

	  }

	  return annotateRule('link-event', {
	    check
	  });
	};


	// helpers /////////////////

	function isLinkEvent(node) {

	  var eventDefinitions = node.eventDefinitions || [];

	  if (!is(node, 'bpmn:Event')) {
	    return false;
	  }

	  return eventDefinitions.some(
	    definition => is(definition, 'bpmn:LinkEventDefinition')
	  );
	}

	function getLinkName(linkEvent) {
	  return linkEvent.get('eventDefinitions').find(def => is(def, 'bpmn:LinkEventDefinition')).name;
	}

	function isThrowEvent(node) {
	  return is(node, 'bpmn:ThrowEvent');
	}

	function isCatchEvent(node) {
	  return is(node, 'bpmn:CatchEvent');
	}
	return linkEvent$1;
}

var linkEventExports$1 = requireLinkEvent$1();
var rule_8 = /*@__PURE__*/getDefaultExportFromCjs(linkEventExports$1);

var noBpmndi;
var hasRequiredNoBpmndi;

function requireNoBpmndi () {
	if (hasRequiredNoBpmndi) return noBpmndi;
	hasRequiredNoBpmndi = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  flatten
	} = require$$0;

	const {
	  annotateRule
	} = requireHelper$1();

	/**
	 * @typedef { import('../lib/types.js').ModdleElement } ModdleElement
	 */


	/**
	 * A rule that checks that there is no BPMNDI information missing for elements,
	 * which require BPMNDI.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noBpmndi = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:Definitions')) {
	      return false;
	    }

	    // (1) Construct array of all BPMN elements
	    const bpmnElements = getAllBpmnElements(node.rootElements);

	    // (2) Filter BPMN elements without visual representation
	    const visualBpmnElements = bpmnElements.filter(hasVisualRepresentation);

	    // (3) Construct array of BPMNDI references
	    const diBpmnReferences = getAllDiBpmnReferences(node);

	    // (4) Report elements without BPMNDI
	    visualBpmnElements.forEach((element) => {
	      if (diBpmnReferences.indexOf(element.id) === -1) {
	        reporter.report(element.id, 'Element is missing bpmndi');
	      }
	    });
	  }

	  return annotateRule('no-bpmndi', {
	    check
	  });

	};


	// helpers /////////////////////////////

	/**
	 * Get all BPMN elements within a bpmn:Definitions node
	 *
	 * @param { ModdleElement[] } rootElements - An array of Moddle rootElements
	 *
	 * @return { { id: string, $type: string }[] } A flat array with all BPMN elements, each represented with { id: elementId, $type: elementType }
	 */
	function getAllBpmnElements(rootElements) {

	  return flatten(rootElements.map((rootElement) => {
	    const laneSet =
	      rootElement.laneSets && rootElement.laneSets[0] || rootElement.childLaneSet;

	    // Include
	    // * flowElements (e.g., tasks, sequenceFlows),
	    // * nested flowElements,
	    // * participants,
	    // * artifacts (groups),
	    // * laneSets
	    // * nested laneSets
	    // * childLaneSets
	    // * nested childLaneSets
	    // * messageFlows
	    const elements = flatten([
	      rootElement.flowElements || [],
	      (rootElement.flowElements && getAllBpmnElements(rootElement.flowElements.filter(hasFlowElements))) || [],
	      rootElement.participants || [],
	      rootElement.artifacts || [],
	      laneSet && laneSet.lanes || [],
	      laneSet && laneSet.lanes && getAllBpmnElements(laneSet.lanes.filter(hasChildLaneSet)) || [],
	      rootElement.messageFlows || []
	    ]);

	    if (elements.length > 0) {
	      return elements.map((element) => {

	        return {
	          id: element.id,
	          $type: element.$type
	        };
	      });
	    } else {

	      // We are not interested in the rest here (DI)
	      return [];
	    }
	  }));
	}

	/**
	 * Get all BPMN elements within a bpmn:Definitions node
	 *
	 * @param {ModdleElement} definitionsNode - A moddleElement representing the
	 *   bpmn:Definitions element
	 *
	 * @return {string[]} ids of all BPMNDI element part of
	 *   this bpmn:Definitions node
	 */
	function getAllDiBpmnReferences(definitionsNode) {
	  return flatten(
	    definitionsNode.get('diagrams').map((diagram) => {

	      const diElements = diagram.plane.planeElement || [];

	      return diElements.map((element) => {

	        return element.bpmnElement?.id;
	      });
	    })
	  );
	}

	/**
	 * @param { ModdleElement } element
	 *
	 * @return {boolean}
	 */
	function hasVisualRepresentation(element) {
	  const noVisRepresentation = [ 'bpmn:DataObject' ];

	  return noVisRepresentation.includes(element.$type) ? false : true;
	}

	/**
	 * @param { ModdleElement } element
	 *
	 * @return {boolean}
	 */
	function hasFlowElements(element) {
	  return element.flowElements ? true : false;
	}

	/**
	 * @param { ModdleElement } element
	 *
	 * @return {boolean}
	 */
	function hasChildLaneSet(element) {
	  return element.childLaneSet ? true : false;
	}
	return noBpmndi;
}

var noBpmndiExports = requireNoBpmndi();
var rule_9 = /*@__PURE__*/getDefaultExportFromCjs(noBpmndiExports);

var noComplexGateway;
var hasRequiredNoComplexGateway;

function requireNoComplexGateway () {
	if (hasRequiredNoComplexGateway) return noComplexGateway;
	hasRequiredNoComplexGateway = 1;
	const checkDiscouragedNodeType = requireHelper$1().checkDiscouragedNodeType;

	noComplexGateway = checkDiscouragedNodeType('bpmn:ComplexGateway', 'no-complex-gateway');
	return noComplexGateway;
}

var noComplexGatewayExports = requireNoComplexGateway();
var rule_10 = /*@__PURE__*/getDefaultExportFromCjs(noComplexGatewayExports);

var noDisconnected;
var hasRequiredNoDisconnected;

function requireNoDisconnected () {
	if (hasRequiredNoDisconnected) return noDisconnected;
	hasRequiredNoDisconnected = 1;
	const {
	  isAny,
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that verifies that there exists no disconnected
	 * flow elements, i.e. elements without incoming or outgoing sequence flows.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noDisconnected = function() {

	  function check(node, reporter) {

	    if (!isAny(node, [
	      'bpmn:Task',
	      'bpmn:Gateway',
	      'bpmn:SubProcess',
	      'bpmn:Event'
	    ]) || node.triggeredByEvent) {
	      return;
	    }

	    // compensation activity and boundary events are
	    // linked visually via associations. If these associations
	    // exist we are fine, too
	    if (isCompensationLinked(node)) {
	      return;
	    }

	    // adhoc subprocesses can have disconnected activities
	    if (is(node.$parent, 'bpmn:AdHocSubProcess')) {
	      return;
	    }

	    const incoming = node.incoming || [];
	    const outgoing = node.outgoing || [];

	    if (!incoming.length && !outgoing.length) {
	      reporter.report(node.id, 'Element is not connected');
	    }
	  }

	  return annotateRule('no-disconnected', {
	    check
	  });
	};


	// helpers /////////////////

	function isCompensationBoundary(node) {

	  var eventDefinitions = node.eventDefinitions;

	  if (!is(node, 'bpmn:BoundaryEvent')) {
	    return false;
	  }

	  if (!eventDefinitions || eventDefinitions.length !== 1) {
	    return false;
	  }

	  return is(eventDefinitions[0], 'bpmn:CompensateEventDefinition');
	}

	function isCompensationActivity(node) {
	  return node.isForCompensation;
	}

	function isCompensationLinked(node) {
	  var source = isCompensationBoundary(node);
	  var target = isCompensationActivity(node);

	  // TODO(nikku): check, whether compensation association exists
	  return source || target;
	}
	return noDisconnected;
}

var noDisconnectedExports = requireNoDisconnected();
var rule_11 = /*@__PURE__*/getDefaultExportFromCjs(noDisconnectedExports);

var noDuplicateSequenceFlows;
var hasRequiredNoDuplicateSequenceFlows;

function requireNoDuplicateSequenceFlows () {
	if (hasRequiredNoDuplicateSequenceFlows) return noDuplicateSequenceFlows;
	hasRequiredNoDuplicateSequenceFlows = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that verifies that there are no disconnected
	 * flow elements, i.e. elements without incoming or outgoing sequence flows.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noDuplicateSequenceFlows = function() {

	  const keyed = {};

	  const outgoingReported = {};
	  const incomingReported = {};

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:SequenceFlow')) {
	      return;
	    }

	    const key = flowKey(node);

	    if (key in keyed) {
	      reporter.report(node.id, 'SequenceFlow is a duplicate');

	      const sourceId = node.sourceRef.id;
	      const targetId = node.targetRef.id;

	      if (!outgoingReported[sourceId]) {
	        reporter.report(sourceId, 'Duplicate outgoing sequence flows');

	        outgoingReported[sourceId] = true;
	      }

	      if (!incomingReported[targetId]) {
	        reporter.report(targetId, 'Duplicate incoming sequence flows');

	        incomingReported[targetId] = true;
	      }
	    } else {
	      keyed[key] = node;
	    }
	  }

	  return annotateRule('no-duplicate-sequence-flows', {
	    check
	  });

	};


	// helpers /////////////////

	function flowKey(flow) {
	  const conditionExpression = flow.conditionExpression;

	  const condition = conditionExpression ? conditionExpression.body : '';
	  const source = flow.sourceRef ? flow.sourceRef.id : flow.id;
	  const target = flow.targetRef ? flow.targetRef.id : flow.id;

	  return source + '#' + target + '#' + condition;
	}
	return noDuplicateSequenceFlows;
}

var noDuplicateSequenceFlowsExports = requireNoDuplicateSequenceFlows();
var rule_12 = /*@__PURE__*/getDefaultExportFromCjs(noDuplicateSequenceFlowsExports);

var noGatewayJoinFork;
var hasRequiredNoGatewayJoinFork;

function requireNoGatewayJoinFork () {
	if (hasRequiredNoGatewayJoinFork) return noGatewayJoinFork;
	hasRequiredNoGatewayJoinFork = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks, whether a gateway forks and joins
	 * at the same time.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noGatewayJoinFork = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:Gateway')) {
	      return;
	    }

	    const incoming = node.incoming || [];
	    const outgoing = node.outgoing || [];

	    if (incoming.length > 1 && outgoing.length > 1) {
	      reporter.report(node.id, 'Gateway forks and joins');
	    }
	  }

	  return annotateRule('no-gateway-join-fork', {
	    check
	  });

	};
	return noGatewayJoinFork;
}

var noGatewayJoinForkExports = requireNoGatewayJoinFork();
var rule_13 = /*@__PURE__*/getDefaultExportFromCjs(noGatewayJoinForkExports);

var noImplicitSplit;
var hasRequiredNoImplicitSplit;

function requireNoImplicitSplit () {
	if (hasRequiredNoImplicitSplit) return noImplicitSplit;
	hasRequiredNoImplicitSplit = 1;
	const {
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks that no implicit split is modeled
	 * starting from a task.
	 *
	 * Users should model the parallel splitting gateway
	 * explicitly instead.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noImplicitSplit = function() {

	  function check(node, reporter) {

	    if (!isAny(node, [
	      'bpmn:Activity',
	      'bpmn:Event'
	    ])) {
	      return;
	    }

	    const outgoing = node.outgoing || [];

	    const outgoingWithoutCondition = outgoing.filter((flow) => {
	      return !hasCondition(flow) && !isDefaultFlow(node, flow);
	    });

	    if (outgoingWithoutCondition.length > 1) {
	      reporter.report(node.id, 'Flow splits implicitly');
	    }
	  }

	  return annotateRule('no-implicit-split', {
	    check
	  });

	};


	// helpers /////////////////////////////

	function hasCondition(flow) {
	  return !!flow.conditionExpression;
	}

	function isDefaultFlow(node, flow) {
	  return node['default'] === flow;
	}
	return noImplicitSplit;
}

var noImplicitSplitExports = requireNoImplicitSplit();
var rule_14 = /*@__PURE__*/getDefaultExportFromCjs(noImplicitSplitExports);

var noImplicitStart;
var hasRequiredNoImplicitStart;

function requireNoImplicitStart () {
	if (hasRequiredNoImplicitStart) return noImplicitStart;
	hasRequiredNoImplicitStart = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();

	/**
	 * A rule that checks that an element is not an implicit start (token spawn).
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noImplicitStart = function() {

	  function isLinkEvent(node) {
	    const eventDefinitions = node.eventDefinitions || [];

	    return eventDefinitions.length && eventDefinitions.every(
	      definition => is(definition, 'bpmn:LinkEventDefinition')
	    );
	  }

	  function isForCompensation(node) {
	    return node.isForCompensation;
	  }

	  function isImplicitStart(node) {
	    const incoming = node.incoming || [];

	    if (is(node, 'bpmn:Activity') && isForCompensation(node)) {
	      return false;
	    }

	    if (is(node.$parent, 'bpmn:AdHocSubProcess')) {
	      return false;
	    }

	    if (is(node, 'bpmn:SubProcess') && node.triggeredByEvent) {
	      return false;
	    }

	    if (is(node, 'bpmn:IntermediateCatchEvent') && isLinkEvent(node)) {
	      return false;
	    }

	    if (isAny(node, [ 'bpmn:StartEvent', 'bpmn:BoundaryEvent' ])) {
	      return false;
	    }

	    return incoming.length === 0;
	  }

	  function check(node, reporter) {

	    if (!isAny(node, [ 'bpmn:Event', 'bpmn:Activity', 'bpmn:Gateway' ])) {
	      return;
	    }

	    if (isImplicitStart(node)) {
	      reporter.report(node.id, 'Element is an implicit start');
	    }
	  }

	  return annotateRule('no-implicit-start', {
	    check
	  });
	};
	return noImplicitStart;
}

var noImplicitStartExports = requireNoImplicitStart();
var rule_16 = /*@__PURE__*/getDefaultExportFromCjs(noImplicitStartExports);

var noInclusiveGateway;
var hasRequiredNoInclusiveGateway;

function requireNoInclusiveGateway () {
	if (hasRequiredNoInclusiveGateway) return noInclusiveGateway;
	hasRequiredNoInclusiveGateway = 1;
	const checkDiscouragedNodeType = requireHelper$1().checkDiscouragedNodeType;

	noInclusiveGateway = checkDiscouragedNodeType('bpmn:InclusiveGateway', 'no-inclusive-gateway');
	return noInclusiveGateway;
}

var noInclusiveGatewayExports = requireNoInclusiveGateway();
var rule_17 = /*@__PURE__*/getDefaultExportFromCjs(noInclusiveGatewayExports);

var noOverlappingElements;
var hasRequiredNoOverlappingElements;

function requireNoOverlappingElements () {
	if (hasRequiredNoOverlappingElements) return noOverlappingElements;
	hasRequiredNoOverlappingElements = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * Rule that checks if two elements overlap except:
	 *
	 * - Boundary events overlap their host
	 * - Child elements overlap / are on top of their parent (e.g., elements within a subProcess)
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	noOverlappingElements = function() {

	  function check(node, reporter) {
	    if (!is(node, 'bpmn:Definitions')) {
	      return;
	    }

	    const rootElements = node.rootElements || [];
	    const elementsToReport = new Set();
	    const elementsOutsideToReport = new Set();
	    const diObjects = getAllDiObjects(node);
	    const processElementsParentDiMap = new Map(); // map with sub/process as key and its parent boundary di object

	    rootElements
	      .filter(element => is(element, 'bpmn:Collaboration'))
	      .forEach(collaboration => {
	        const participants = collaboration.participants || [];
	        checkElementsArray(participants, elementsToReport, diObjects);

	        participants.forEach(participant => {
	          processElementsParentDiMap.set(participant.processRef, diObjects.get(participant));
	        });
	      });

	    rootElements
	      .filter(element => is(element, 'bpmn:Process'))
	      .forEach(process => {
	        const parentDi = processElementsParentDiMap.get(process) || {};
	        checkProcess(process, elementsToReport, elementsOutsideToReport, diObjects, parentDi);
	      });

	    // report elements
	    elementsToReport.forEach(element => reporter.report(element.id, 'Element overlaps with other element'));
	    elementsOutsideToReport.forEach(element => reporter.report(element.id, 'Element is outside of parent boundary'));
	  }

	  return annotateRule('no-overlapping-elements', {
	    check
	  });
	};

	// helpers /////////////////

	/**
	 * Recursively check subprocesses in a process
	 * @param {Object} node Process or SubProcess
	 * @param {Set} elementsToReport
	 * @param {Set} elementsOutsideToReport
	 * @param {Map} diObjects
	 */
	function checkProcess(node, elementsToReport, elementsOutsideToReport, diObjects, parentDi) {

	  const flowElements = node.flowElements || [];

	  const flowElementsWithDi = flowElements.filter(element => diObjects.has(element));

	  // check child elements for overlap
	  checkElementsArray(flowElementsWithDi, elementsToReport, diObjects);

	  // check child elements outside parent boundary
	  //
	  //   * data objects do not have a visual representation
	  //   * for historical reasons data store references may be
	  //     outside of parent boundaries
	  //
	  flowElementsWithDi.forEach(element => {
	    if (
	      !is(element, 'bpmn:DataStoreReference') &&
	      isOutsideParentBoundary(diObjects.get(element).bounds, parentDi.bounds)
	    ) {
	      elementsOutsideToReport.add(element);
	    }
	  });

	  // recurse into subprocesses
	  const subProcesses = flowElements.filter(element => is(element, 'bpmn:SubProcess'));
	  subProcesses.forEach(subProcess => {
	    const subProcessDi = diObjects.get(subProcess) || {};
	    const subProcessParentBoundary = subProcessDi.isExpanded ? subProcessDi : {};
	    checkProcess(subProcess, elementsToReport, elementsOutsideToReport, diObjects, subProcessParentBoundary);
	  });
	}

	/**
	 * @param {Array} elements
	 * @param {Set} elementsToReport
	 */
	function checkElementsArray(elements, elementsToReport, diObjects) {
	  for (let i = 0; i < elements.length - 1; i++) {
	    const element = elements[i];

	    for (let j = i + 1; j < elements.length; j++) {
	      const element2 = elements[j];

	      // ignore if Boundary events overlap their host
	      // but still check if they overlap other elements
	      if (element.attachedToRef === element2 || element2.attachedToRef === element) {
	        continue;
	      }

	      const bounds1 = diObjects.get(element)?.bounds;
	      const bounds2 = diObjects.get(element2)?.bounds;

	      // ignore if an element doesn't have bounds
	      if (!bounds1 || !bounds2) {
	        continue;
	      }

	      if (isCollision(bounds1, bounds2)) {
	        elementsToReport.add(element);
	        elementsToReport.add(element2);
	      }
	    }
	  }
	}

	/**
	 * Check if child element is outside of parent boundary
	 */
	function isOutsideParentBoundary(childBounds, parentBounds) {
	  if (!isValidShapeElement(childBounds) || !isValidShapeElement(parentBounds)) {
	    return false;
	  }

	  const isTopLeftCornerInside = childBounds.x >= parentBounds.x && childBounds.y >= parentBounds.y;
	  const isBottomRightCornerInside = childBounds.x + childBounds.width <= parentBounds.x + parentBounds.width && childBounds.y + childBounds.height <= parentBounds.y + parentBounds.height;
	  const isInside = isTopLeftCornerInside && isBottomRightCornerInside;

	  return !isInside;
	}

	/**
	 * Check if two rectangle shapes collides
	 */
	function isCollision(firstBounds, secondBounds) {
	  if (!isValidShapeElement(firstBounds) || !isValidShapeElement(secondBounds)) {
	    return false;
	  }

	  const collisionX = firstBounds.x + firstBounds.width >= secondBounds.x && secondBounds.x + secondBounds.width >= firstBounds.x;
	  const collisionY = firstBounds.y + firstBounds.height >= secondBounds.y && secondBounds.y + secondBounds.height >= firstBounds.y;

	  // collision on both axis
	  return collisionX && collisionY;
	}

	/**
	 * Checks if shape bounds has all necessary values for collision check
	 */
	function isValidShapeElement(bounds) {
	  return !!bounds && is(bounds, 'dc:Bounds') &&
	    typeof (bounds.x) === 'number' &&
	    typeof (bounds.y) === 'number' &&
	    typeof (bounds.width) === 'number' &&
	    typeof (bounds.height) === 'number';
	}

	/**
	 * Get all di object as one map object
	 * @param {Object} node bpmn:Definitions
	 * @returns {Map<Object, Object>} map of di objects with element as key
	 */
	function getAllDiObjects(node) {
	  const diObjects = new Map();
	  const diagrams = node.diagrams || [];

	  diagrams
	    .filter(diagram => !!diagram.plane)
	    .forEach(diagram => {
	      const planeElements = diagram.plane.planeElement || [];
	      planeElements
	        .filter(planeElement => !!planeElement.bpmnElement)
	        .forEach(planeElement => {
	          diObjects.set(planeElement.bpmnElement, planeElement);
	        });
	    });

	  return diObjects;
	}
	return noOverlappingElements;
}

var noOverlappingElementsExports = requireNoOverlappingElements();
var rule_18 = /*@__PURE__*/getDefaultExportFromCjs(noOverlappingElementsExports);

var singleBlankStartEvent;
var hasRequiredSingleBlankStartEvent;

function requireSingleBlankStartEvent () {
	if (hasRequiredSingleBlankStartEvent) return singleBlankStartEvent;
	hasRequiredSingleBlankStartEvent = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks whether not more than one blank start event
	 * exists per scope.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	singleBlankStartEvent = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:FlowElementsContainer')) {
	      return;
	    }

	    const flowElements = node.flowElements || [];

	    const blankStartEvents = flowElements.filter(function(flowElement) {

	      if (!is(flowElement, 'bpmn:StartEvent')) {
	        return false;
	      }

	      const eventDefinitions = flowElement.eventDefinitions || [];

	      return eventDefinitions.length === 0;
	    });

	    if (blankStartEvents.length > 1) {
	      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

	      reporter.report(node.id, type + ' has multiple blank start events');
	    }
	  }

	  return annotateRule('single-blank-start-event', {
	    check
	  });

	};
	return singleBlankStartEvent;
}

var singleBlankStartEventExports = requireSingleBlankStartEvent();
var rule_19 = /*@__PURE__*/getDefaultExportFromCjs(singleBlankStartEventExports);

var singleEventDefinition;
var hasRequiredSingleEventDefinition;

function requireSingleEventDefinition () {
	if (hasRequiredSingleEventDefinition) return singleEventDefinition;
	hasRequiredSingleEventDefinition = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that verifies that an event contains maximum one event definition.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	singleEventDefinition = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:Event')) {
	      return;
	    }

	    const eventDefinitions = node.eventDefinitions || [];

	    if (eventDefinitions.length > 1) {
	      reporter.report(node.id, 'Event has multiple event definitions', [ 'eventDefinitions' ]);
	    }
	  }

	  return annotateRule('single-event-definition', {
	    check
	  });

	};
	return singleEventDefinition;
}

var singleEventDefinitionExports = requireSingleEventDefinition();
var rule_20 = /*@__PURE__*/getDefaultExportFromCjs(singleEventDefinitionExports);

var startEventRequired;
var hasRequiredStartEventRequired;

function requireStartEventRequired () {
	if (hasRequiredStartEventRequired) return startEventRequired;
	hasRequiredStartEventRequired = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks for the presence of a start event per scope.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	startEventRequired = function() {

	  function hasStartEvent(node) {
	    const flowElements = node.flowElements || [];

	    return (
	      flowElements.some(node => is(node, 'bpmn:StartEvent'))
	    );
	  }

	  function check(node, reporter) {

	    if (!isAny(node, [
	      'bpmn:Process',
	      'bpmn:SubProcess'
	    ]) || is(node, 'bpmn:AdHocSubProcess')) {
	      return;
	    }

	    if (!hasStartEvent(node)) {
	      const type = is(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

	      reporter.report(node.id, type + ' is missing start event');
	    }
	  }

	  return annotateRule('start-event-required', {
	    check
	  });
	};
	return startEventRequired;
}

var startEventRequiredExports = requireStartEventRequired();
var rule_21 = /*@__PURE__*/getDefaultExportFromCjs(startEventRequiredExports);

var subProcessBlankStartEvent;
var hasRequiredSubProcessBlankStartEvent;

function requireSubProcessBlankStartEvent () {
	if (hasRequiredSubProcessBlankStartEvent) return subProcessBlankStartEvent;
	hasRequiredSubProcessBlankStartEvent = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks that start events inside a normal sub-processes
	 * are blank (do not have an event definition).
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	subProcessBlankStartEvent = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:SubProcess') || node.triggeredByEvent) {
	      return;
	    }

	    const flowElements = node.flowElements || [];

	    flowElements.forEach(function(flowElement) {

	      if (!is(flowElement, 'bpmn:StartEvent')) {
	        return false;
	      }

	      const eventDefinitions = flowElement.eventDefinitions || [];

	      if (eventDefinitions.length > 0) {
	        reporter.report(flowElement.id, 'Start event must be blank', [ 'eventDefinitions' ]);
	      }
	    });
	  }

	  return annotateRule('sub-process-blank-start-event', {
	    check
	  });

	};
	return subProcessBlankStartEvent;
}

var subProcessBlankStartEventExports = requireSubProcessBlankStartEvent();
var rule_22 = /*@__PURE__*/getDefaultExportFromCjs(subProcessBlankStartEventExports);

var superfluousGateway;
var hasRequiredSuperfluousGateway;

function requireSuperfluousGateway () {
	if (hasRequiredSuperfluousGateway) return superfluousGateway;
	hasRequiredSuperfluousGateway = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks, whether a gateway has only one source and target.
	 *
	 * Those gateways are superfluous since they don't do anything.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	superfluousGateway = function() {

	  function check(node, reporter) {

	    if (!is(node, 'bpmn:Gateway')) {
	      return;
	    }

	    const incoming = node.incoming || [];
	    const outgoing = node.outgoing || [];

	    if (incoming.length === 1 && outgoing.length === 1) {
	      reporter.report(node.id, 'Gateway is superfluous. It only has one source and target.');
	    }
	  }

	  return annotateRule('superfluous-gateway', {
	    check
	  });

	};
	return superfluousGateway;
}

var superfluousGatewayExports = requireSuperfluousGateway();
var rule_23 = /*@__PURE__*/getDefaultExportFromCjs(superfluousGatewayExports);

var superfluousTermination;
var hasRequiredSuperfluousTermination;

function requireSuperfluousTermination () {
	if (hasRequiredSuperfluousTermination) return superfluousTermination;
	hasRequiredSuperfluousTermination = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  annotateRule
	} = requireHelper$1();


	/**
	 * A rule that checks, whether a gateway has only one source and target.
	 *
	 * Those gateways are superfluous since they don't do anything.
	 *
	 * @type { import('../lib/types.js').RuleFactory }
	 */
	superfluousTermination = function() {

	  function check(node, reporter) {

	    if (!isAny(node, [ 'bpmn:Process', 'bpmn:SubProcess' ])) {
	      return;
	    }

	    const flowElements = node.flowElements || [];

	    const ends = flowElements.filter(
	      element => is(element, 'bpmn:FlowNode') && (element.outgoing || []).length === 0
	    );

	    const terminateEnds = ends.filter(isTerminateEnd);

	    if (terminateEnds.length !== 1) {

	      // TODO(nikku): only detect basic cases, do not
	      // do any kinds of elaborate flow analysis
	      return;
	    }

	    const superfluous = ends.every(
	      (end) => isInterruptingEventSub(end) || isTerminateEnd(end)
	    );

	    if (superfluous) {

	      for (const node of terminateEnds) {
	        reporter.report(node.id, 'Termination is superfluous.');
	      }
	    }
	  }

	  return annotateRule('superfluous-termination', {
	    check
	  });

	};

	function isTerminateEnd(element) {
	  return is(element, 'bpmn:EndEvent') && (element.eventDefinitions || []).some(
	    eventDefinition => is(eventDefinition, 'bpmn:TerminateEventDefinition')
	  );
	}

	function isInterruptingEventSub(element) {
	  const isEventSub = is(element, 'bpmn:SubProcess') && element.triggeredByEvent;

	  return isEventSub && (element.flowElements || []).some(
	    element => is(element, 'bpmn:StartEvent') && element.isInterrupting
	  );
	}
	return superfluousTermination;
}

var superfluousTerminationExports = requireSuperfluousTermination();
var rule_24 = /*@__PURE__*/getDefaultExportFromCjs(superfluousTerminationExports);

var version = {};

var semverCompare;
var hasRequiredSemverCompare;

function requireSemverCompare () {
	if (hasRequiredSemverCompare) return semverCompare;
	hasRequiredSemverCompare = 1;
	semverCompare = function cmp (a, b) {
	    var pa = a.split('.');
	    var pb = b.split('.');
	    for (var i = 0; i < 3; i++) {
	        var na = Number(pa[i]);
	        var nb = Number(pb[i]);
	        if (na > nb) return 1;
	        if (nb > na) return -1;
	        if (!isNaN(na) && isNaN(nb)) return 1;
	        if (isNaN(na) && !isNaN(nb)) return -1;
	    }
	    return 0;
	};
	return semverCompare;
}

var hasRequiredVersion;

function requireVersion () {
	if (hasRequiredVersion) return version;
	hasRequiredVersion = 1;
	const cmp = requireSemverCompare();

	version.greaterOrEqual = function(version, allowedVersion) {
	  if (!version) {
	    throw new Error(
	      'Rule requires { version } config, e.g. [ "warn", { "version": "8.0" } ]'
	    );
	  }

	  return cmp(version, allowedVersion) !== -1;
	};
	return version;
}

var rule;
var hasRequiredRule;

function requireRule () {
	if (hasRequiredRule) return rule;
	hasRequiredRule = 1;
	const { is } = require$$1$1;

	const { greaterOrEqual } = requireVersion();

	function skipInNonExecutableProcess(ruleFactory) {
	  return function(config = {}) {
	    const rule = ruleFactory(config);

	    const { version, platform = 'camunda-cloud' } = config;

	    function check(node, reporter) {
	      if (platform === 'camunda-cloud' && version && greaterOrEqual(version, '8.2') && isNonExecutableProcess(node)) {
	        return false;
	      }

	      if (platform === 'camunda-platform' && isNonExecutableProcess(node)) {
	        return false;
	      }

	      return rule.check(node, reporter);
	    }

	    return {
	      ...rule,
	      check
	    };
	  };
	}

	rule = {
	  skipInNonExecutableProcess
	};

	function isNonExecutableProcess(node) {
	  let process;

	  if (is(node, 'bpmn:Process')) {
	    process = node;
	  }

	  if (is(node, 'bpmndi:BPMNPlane')
	    && is(node.get('bpmnElement'), 'bpmn:Process')) {
	    process = node.get('bpmnElement');
	  }

	  return process && !process.get('isExecutable');
	}
	return rule;
}

var historyTimeToLive;
var hasRequiredHistoryTimeToLive;

function requireHistoryTimeToLive () {
	if (hasRequiredHistoryTimeToLive) return historyTimeToLive;
	hasRequiredHistoryTimeToLive = 1;
	const { is } = require$$1$1;

	const { skipInNonExecutableProcess } = requireRule();

	historyTimeToLive = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {

	    if (!is(node, 'bpmn:Process')) {
	      return;
	    }

	    if (!node.get('camunda:historyTimeToLive')) {
	      reporter.report(node.id, 'Property <historyTimeToLive> should be configured on <bpmn:Process> or engine level.', [ 'historyTimeToLive' ]);
	    }
	  }

	  return {
	    meta: {
	      documentation: {
	        url: 'https://docs.camunda.org/manual/latest/modeler/history-time-to-live/'
	      }
	    },
	    check
	  };
	});
	return historyTimeToLive;
}

var historyTimeToLiveExports = requireHistoryTimeToLive();
var rule_25 = /*@__PURE__*/getDefaultExportFromCjs(historyTimeToLiveExports);

var avoidLanes;
var hasRequiredAvoidLanes;

function requireAvoidLanes () {
	if (hasRequiredAvoidLanes) return avoidLanes;
	hasRequiredAvoidLanes = 1;
	const {
	  is
	} = require$$1$1;


	/**
	 * Rule that reports the usage of lanes.
	 */
	avoidLanes = function() {

	  function check(node, reporter) {
	    if (is(node, 'bpmn:Lane')) {
	      reporter.report(node.id, 'lanes should be avoided');
	    }
	  }

	  return {
	    check: check
	  };
	};
	return avoidLanes;
}

var avoidLanesExports = requireAvoidLanes();
var rule_26 = /*@__PURE__*/getDefaultExportFromCjs(avoidLanesExports);

var forkingConditions;
var hasRequiredForkingConditions;

function requireForkingConditions () {
	if (hasRequiredForkingConditions) return forkingConditions;
	hasRequiredForkingConditions = 1;
	const {
	  is
	} = require$$1$1;

	/**
	 * A rule that checks that sequence flows after
	 * an exclusive forking gateway have conditions
	 * attached.
	 */
	forkingConditions = function() {

	  function check(node, reporter) {

	    const outgoing = node.outgoing || [];

	    if (!is(node, 'bpmn:ExclusiveGateway') || outgoing.length < 2) {
	      return;
	    }

	    outgoing.forEach((flow) => {
	      const missingCondition = (
	        !hasCondition(flow) &&
	        !isDefaultFlow(node, flow)
	      );

	      if (missingCondition) {
	        reporter.report(flow.id, 'Sequence flow is missing condition');
	      }
	    });
	  }

	  return {
	    check
	  };

	};


	// helpers /////////////////////////////

	function hasCondition(flow) {
	  return !!flow.conditionExpression;
	}

	function isDefaultFlow(node, flow) {
	  return node['default'] === flow;
	}
	return forkingConditions;
}

var forkingConditionsExports = requireForkingConditions();
var rule_27 = /*@__PURE__*/getDefaultExportFromCjs(forkingConditionsExports);

var implementation;
var hasRequiredImplementation;

function requireImplementation () {
	if (hasRequiredImplementation) return implementation;
	hasRequiredImplementation = 1;
	const {
	  is
	} = require$$1$1;

	const implementationAttributes = [
	  'camunda:expression',
	  'camunda:delegateExpression',
	  'camunda:class',
	  'camunda:type'
	];

	/**
	 * Rule that reports the usage of collapsed sub-processes.
	 */
	implementation = function() {

	  function check(node, reporter) {
	    if (is(node, 'camunda:ServiceTaskLike')) {

	      const process = findNodeProcess(node);

	      if (!process || !process.get('isExecutable')) {
	        return;
	      }

	      if (
	        hasConnector(node) ||
	        hasAnyAttribute(node, implementationAttributes)
	      ) {
	        return;
	      }

	      if (is(node, 'bpmn:BusinessRuleTask') && hasAttribute(node, 'camunda:decisionRef')) {
	        return;
	      }

	      reporter.report(node.id, 'Implementation is missing');
	    }
	  }

	  return {
	    check: check
	  };
	};

	function findNodeProcess(node) {
	  let parent = node.$parent;

	  while (parent && !is(parent, 'bpmn:Process')) {
	    parent = parent.$parent;
	  }

	  return parent;
	}

	function hasConnector(bpmnElement) {
	  const extensionElements = bpmnElement.get('extensionElements');

	  if (!extensionElements) {
	    return false;
	  }

	  return extensionElements.get('values').some(function(extension) {
	    return is(extension, 'camunda:Connector');
	  });
	}

	function hasAnyAttribute(bpmnElement, attributes) {
	  return attributes.some(function(attribute) {
	    return hasAttribute(bpmnElement, attribute);
	  });
	}

	function hasAttribute(bpmnElement, attribute) {
	  return bpmnElement.get(attribute) !== undefined;
	}
	return implementation;
}

var implementationExports = requireImplementation();
var rule_28 = /*@__PURE__*/getDefaultExportFromCjs(implementationExports);

var element = {};

/**
 * Get path from model element and optional parent model element. Fall back to
 * returning null.
 *
 * @param {ModdleElement} moddleElement
 * @param {ModdleElement} [parentModdleElement]
 *
 * @returns {string[]|null}
 */
function getPath(moddleElement, parentModdleElement) {
  if (!moddleElement) {
    return null;
  }

  if (moddleElement === parentModdleElement) {
    return [];
  }

  let path = [],
      parent;

  do {
    parent = moddleElement.$parent;

    if (!parent) {
      if (moddleElement.$instanceOf('bpmn:Definitions')) {
        break;
      } else {
        return null;
      }
    }

    path = [ ...getPropertyName(moddleElement, parent), ...path ];

    moddleElement = parent;

    if (parentModdleElement && moddleElement === parentModdleElement) {
      break;
    }
  } while (parent);

  return path;
}

/**
 * Get property name from model element and parent model element.
 *
 * @param {ModdleElement} moddleElement
 * @param {ModdleElement} parentModdleElement
 *
 * @returns {string[]}
 */
function getPropertyName(moddleElement, parentModdleElement) {
  for (let property of Object.values(parentModdleElement.$descriptor.propertiesByName)) {
    if (property.isMany) {
      if (parentModdleElement.get(property.name).includes(moddleElement)) {
        return [
          property.name,
          parentModdleElement.get(property.name).indexOf(moddleElement)
        ];
      }
    } else {
      if (parentModdleElement.get(property.name) === moddleElement) {
        return [ property.name ];
      }
    }
  }

  return [];
}

/**
 * @param {(string|(number|string)[])[]} paths
 *
 * @returns {(number|string)[]}
 */
function pathConcat(...paths) {
  let concatenatedPaths = [];

  for (let path of paths) {
    if (isNil(path) || isUndefined(path)) {
      return null;
    }

    if (isString(path)) {
      path = [ path ];
    }

    concatenatedPaths = concatenatedPaths.concat(path);
  }

  return concatenatedPaths;
}

/**
 * @param {string|(number|string)[]} a
 * @param {string|(number|string)[]} b
 * @param {string} [separator]
 *
 * @returns {boolean}
 */
function pathEquals(a, b, separator = '.') {
  if (isNil(a) || isUndefined(a) || isNil(b) || isUndefined(b)) {
    return false;
  }

  if (!isString(a)) {
    a = pathStringify(a, separator);
  }

  if (!isString(b)) {
    b = pathStringify(b, separator);
  }

  return a === b;
}

/**
 * @param {string} path
 * @param {string} [separator]
 *
 * @returns {(number|string)[]}
 */
function pathParse(path, separator = '.') {
  if (isNil(path) || isUndefined(path)) {
    return null;
  }

  return path
    .split(separator)
    .map(string => isNaN(string) ? string : parseInt(string));
}

/**
 * @param {(number|string)[]} path
 * @param {string} [separator]
 *
 * @returns {string}
 */
function pathStringify(path, separator = '.') {
  if (isNil(path) || isUndefined(path)) {
    return null;
  }

  return path.join(separator);
}

var moddleUtils = /*#__PURE__*/Object.freeze({
	__proto__: null,
	getPath: getPath,
	pathConcat: pathConcat,
	pathEquals: pathEquals,
	pathParse: pathParse,
	pathStringify: pathStringify
});

var require$$1 = /*@__PURE__*/getAugmentedNamespace(moddleUtils);

var errorTypes = {};

var hasRequiredErrorTypes;

function requireErrorTypes () {
	if (hasRequiredErrorTypes) return errorTypes;
	hasRequiredErrorTypes = 1;
	errorTypes.ERROR_TYPES = Object.freeze({
	  CHILD_ELEMENT_OF_TYPE_REQUIRED: 'camunda.childElementOfTypeRequired',
	  CHILD_ELEMENT_TYPE_NOT_ALLOWED: 'camunda.childElementTypeNotAllowed',
	  CONNECTORS_PROPERTY_VALUE_NOT_ALLOWED: 'camunda.connectors.propertyValueNotAllowed',
	  ELEMENT_COLLAPSED_NOT_ALLOWED: 'camunda.elementCollapsedNotAllowed',
	  ELEMENT_MULTIPLE_NOT_ALLOWED: 'camunda.elementMultipleNotAllowed',
	  ELEMENT_TYPE_NOT_ALLOWED: 'camunda.elementTypeNotAllowed',
	  ELEMENT_PROPERTY_VALUE_DUPLICATED: 'camunda.elementPropertyValueDuplicated',
	  EVENT_BASED_GATEWAY_TARGET_NOT_ALLOWED: 'camunda.eventBasedGatewayTargetNotAllowed',
	  EXPRESSION_NOT_ALLOWED: 'camunda.expressionNotAllowed',
	  EXPRESSION_REQUIRED: 'camunda.expressionRequired',
	  EXPRESSION_VALUE_NOT_ALLOWED: 'camunda.expressionValueNotAllowed',
	  EXTENSION_ELEMENT_NOT_ALLOWED: 'camunda.extensionElementNotAllowed',
	  EXTENSION_ELEMENT_REQUIRED: 'camunda.extensionElementRequired',
	  FEEL_EXPRESSION_INVALID: 'camunda.feelExpressionInvalid',
	  LOOP_NOT_ALLOWED: 'camunda.loopNotAllowed',
	  ATTACHED_TO_REF_ELEMENT_TYPE_NOT_ALLOWED: 'camunda.attachedToRefElementTypeNotAllowed',
	  PROPERTY_DEPENDENT_REQUIRED: 'camunda.propertyDependentRequired',
	  PROPERTY_NOT_ALLOWED: 'camunda.propertyNotAllowed',
	  PROPERTY_DEPRECATED: 'camunda.propertyDeprecated',
	  PROPERTY_REQUIRED: 'camunda.propertyRequired',
	  PROPERTY_TYPE_NOT_ALLOWED: 'camunda.propertyTypeNotAllowed',
	  PROPERTY_VALUE_DUPLICATED: 'camunda.propertyValueDuplicated',
	  PROPERTY_VALUES_DUPLICATED: 'camunda.propertiesValuesDuplicated',
	  PROPERTY_VALUE_NOT_ALLOWED: 'camunda.propertyValueNotAllowed',
	  PROPERTY_VALUE_REQUIRED: 'camunda.propertyValueRequired',
	  SECRET_EXPRESSION_FORMAT_DEPRECATED: 'camunda.secretExpressionFormatDeprecated'
	});
	return errorTypes;
}

var hasRequiredElement;

function requireElement () {
	if (hasRequiredElement) return element;
	hasRequiredElement = 1;
	const {
	  filter,
	  isArray,
	  isDefined,
	  isFunction,
	  isNil,
	  isObject,
	  isString,
	  isUndefined,
	  matchPattern,
	  some
	} = require$$0;

	const {
	  is,
	  isAny
	} = require$$1$1;

	const { getPath } = require$$1;

	const { ERROR_TYPES } = requireErrorTypes();

	element.ERROR_TYPES = ERROR_TYPES;

	function getEventDefinition(node) {
	  const eventDefinitions = node.get('eventDefinitions');

	  if (eventDefinitions) {
	    return eventDefinitions[ 0 ];
	  }
	}

	element.getEventDefinition = getEventDefinition;

	element.getMessageEventDefinition = function(node) {
	  if (is(node, 'bpmn:ReceiveTask')) {
	    return node;
	  }

	  return getEventDefinition(node);
	};

	function findExtensionElements(node, types) {
	  const extensionElements = node.get('extensionElements');

	  if (!extensionElements) {
	    return;
	  }

	  const values = extensionElements.get('values');

	  if (!values || !values.length) {
	    return;
	  }

	  if (!isArray(types)) {
	    types = [ types ];
	  }

	  return values.filter(value => isAny(value, types));
	}

	element.findExtensionElements = findExtensionElements;

	function findExtensionElement(node, types) {
	  const extensionElements = findExtensionElements(node, types);

	  if (extensionElements && extensionElements.length) {
	    return extensionElements[ 0 ];
	  }
	}

	element.findExtensionElement = findExtensionElement;

	function formatNames(names, exclusive = false) {
	  return names.reduce((string, name, index) => {

	    // first
	    if (index === 0) {
	      return `<${ name }>`;
	    }

	    // last
	    if (index === names.length - 1) {
	      return `${ string } ${ exclusive ? 'or' : 'and' } <${ name }>`;
	    }

	    return `${ string }, <${ name }>`;
	  }, '');
	}

	element.formatNames = formatNames;

	element.hasDuplicatedPropertyValues = function(node, propertiesName, propertyName, parentNode = null) {
	  const properties = node.get(propertiesName);

	  const propertyValues = properties.map(property => property.get(propertyName));

	  // (1) find duplicates
	  const duplicates = propertyValues.reduce((duplicates, propertyValue, index) => {
	    if (propertyValues.indexOf(propertyValue) !== index && !duplicates.includes(propertyValue)) {
	      return [
	        ...duplicates,
	        propertyValue
	      ];
	    }

	    return duplicates;
	  }, []);

	  // (2) report error for each duplicate
	  if (duplicates.length) {
	    return duplicates.map(duplicate => {

	      // (3) find properties with duplicate
	      const duplicateProperties = properties.filter(property => property.get(propertyName) === duplicate);

	      // (4) report error
	      return {
	        message: `Properties of type <${ duplicateProperties[ 0 ].$type }> have property <${ propertyName }> with duplicate value of <${ duplicate }>`,
	        path: null,
	        data: {
	          type: ERROR_TYPES.PROPERTY_VALUE_DUPLICATED,
	          node,
	          parentNode: parentNode == node ? null : parentNode,
	          duplicatedProperty: propertyName,
	          duplicatedPropertyValue: duplicate,
	          properties: duplicateProperties,
	          propertiesName
	        }
	      };
	    });
	  }

	  return [];
	};

	// @TODO(@barmac): use tree algorithm to reduce complexity
	element.hasDuplicatedPropertiesValues = function(node, containerPropertyName, propertiesNames, parentNode = null) {
	  const properties = node.get(containerPropertyName);

	  // (1) find duplicates
	  const duplicates = properties.reduce((foundDuplicates, property, index) => {
	    const previous = properties.slice(0, index);
	    const isDuplicate = previous.find(p => propertiesNames.every(propertyName => p.get(propertyName) === property.get(propertyName)));

	    if (isDuplicate) {
	      return foundDuplicates.concat(property);
	    }

	    return foundDuplicates;
	  }, []);

	  // (2) report error for each duplicate
	  if (duplicates.length) {
	    return duplicates.map(duplicate => {
	      const propertiesMap = {};
	      for (const property of propertiesNames) {
	        propertiesMap[property] = duplicate.get(property);
	      }

	      // (3) find properties with duplicate
	      const duplicateProperties = filter(properties, matchPattern(propertiesMap));
	      const duplicatesSummary = propertiesNames.map(propertyName => `property <${ propertyName }> with duplicate value of <${ propertiesMap[propertyName] }>`).join(', ');

	      // (4) report error
	      return {
	        message: `Properties of type <${ duplicate.$type }> have properties with duplicate values (${ duplicatesSummary })`,
	        path: null,
	        data: {
	          type: ERROR_TYPES.PROPERTY_VALUES_DUPLICATED,
	          node,
	          parentNode: parentNode == node ? null : parentNode,
	          duplicatedProperties: propertiesMap,
	          properties: duplicateProperties,
	          propertiesName: containerPropertyName
	        }
	      };
	    });
	  }

	  return [];
	};

	element.hasProperties = function(node, properties, parentNode = null) {
	  return Object.entries(properties).reduce((results, property) => {
	    const [ propertyName, propertyChecks ] = property;

	    const { allowedVersion = null } = propertyChecks;

	    const path = getPath(node, parentNode);

	    const propertyValue = node.get(propertyName);

	    if (propertyChecks.required && isEmptyValue(propertyValue)) {
	      return [
	        ...results,
	        {
	          message: allowedVersion
	            ? `Element of type <${ node.$type }> without property <${ propertyName }> only allowed by Camunda ${ allowedVersion } or newer`
	            : `Element of type <${ node.$type }> must have property <${ propertyName }>`,
	          path: path
	            ? [ ...path, propertyName ]
	            : [ propertyName ],
	          data: addAllowedVersion({
	            type: ERROR_TYPES.PROPERTY_REQUIRED,
	            node,
	            parentNode: parentNode == node ? null : parentNode,
	            requiredProperty: propertyName
	          }, allowedVersion)
	        }
	      ];
	    }

	    if (propertyChecks.dependentRequired) {
	      const dependency = node.get(propertyChecks.dependentRequired);

	      if (dependency && isEmptyValue(propertyValue)) {
	        return [
	          ...results,
	          {
	            message: `Element of type <${ node.$type }> must have property <${ propertyName }> if it has property <${ propertyChecks.dependentRequired }>`,
	            path: path
	              ? [ ...path, propertyName ]
	              : [ propertyName ],
	            data: {
	              type: ERROR_TYPES.PROPERTY_DEPENDENT_REQUIRED,
	              node,
	              parentNode: parentNode == node ? null : parentNode,
	              property: propertyChecks.dependentRequired,
	              dependentRequiredProperty: propertyName
	            }
	          }
	        ];
	      }
	    }

	    if (
	      propertyChecks.type
	      && propertyValue
	      && (
	        !propertyValue.$instanceOf
	        || (!isArray(propertyChecks.type) && !propertyValue.$instanceOf(propertyChecks.type))
	        || (isArray(propertyChecks.type) && !some(propertyChecks.type, type => propertyValue.$instanceOf(type)))
	      )
	    ) {
	      return [
	        ...results,
	        {
	          message: allowedVersion
	            ? `Property <${ propertyName }> of type <${ propertyValue.$type }> only allowed by Camunda ${ allowedVersion } or newer`
	            : `Property <${ propertyName }> of type <${ propertyValue.$type }> not allowed`,
	          path: path
	            ? [ ...path, propertyName ]
	            : [ propertyName ],
	          data: addAllowedVersion({
	            type: ERROR_TYPES.PROPERTY_TYPE_NOT_ALLOWED,
	            node,
	            parentNode: parentNode == node ? null : parentNode,
	            property: propertyName,
	            allowedPropertyType: propertyChecks.type
	          }, allowedVersion)
	        }
	      ];
	    }

	    if ('value' in propertyChecks && propertyChecks.value !== propertyValue) {
	      return [
	        ...results,
	        {
	          message: `Property <${ propertyName }> must have value of <${ propertyChecks.value }>`,
	          path: path
	            ? [ ...path, propertyName ]
	            : [ propertyName ],
	          data: {
	            type: ERROR_TYPES.PROPERTY_VALUE_REQUIRED,
	            node,
	            parentNode: parentNode == node ? null : parentNode,
	            property: propertyName,
	            requiredValue: propertyChecks.value
	          }
	        }
	      ];
	    }

	    if (propertyChecks.allowed === false && isDefined(propertyValue) && !isNil(propertyValue)) {
	      return [
	        ...results,
	        {
	          message: allowedVersion
	            ? `Property <${ propertyName }> only allowed by Camunda ${ allowedVersion } or newer`
	            : `Property <${ propertyName }> not allowed`,
	          path: path
	            ? [ ...path, propertyName ]
	            : [ propertyName ],
	          data: addAllowedVersion({
	            type: ERROR_TYPES.PROPERTY_NOT_ALLOWED,
	            node,
	            parentNode: parentNode == node ? null : parentNode,
	            property: propertyName
	          }, allowedVersion)
	        }
	      ];
	    }

	    if (isFunction(propertyChecks.allowed) && !propertyChecks.allowed(propertyValue)) {
	      return [
	        ...results,
	        {
	          message: allowedVersion
	            ? `Property value of <${ truncate(propertyValue) }> only allowed by Camunda ${ allowedVersion } or newer`
	            : `Property value of <${ truncate(propertyValue) }> not allowed`,
	          path: path
	            ? [ ...path, propertyName ]
	            : [ propertyName ],
	          data: addAllowedVersion({
	            type: ERROR_TYPES.PROPERTY_VALUE_NOT_ALLOWED,
	            node,
	            parentNode: parentNode == node ? null : parentNode,
	            property: propertyName
	          }, allowedVersion)
	        }
	      ];
	    }

	    return results;
	  }, []);
	};

	element.hasProperty = function(node, propertyNames, parentNode = null) {
	  propertyNames = isArray(propertyNames) ? propertyNames : [ propertyNames ];

	  const properties = findProperties(node, propertyNames);

	  if (properties.length !== 1) {
	    return [
	      {
	        message: `Element of type <${ node.$type }> must have property ${ formatNames(propertyNames, true) }`,
	        path: getPath(node, parentNode),
	        data: {
	          type: ERROR_TYPES.PROPERTY_REQUIRED,
	          node,
	          parentNode: parentNode == node ? null : parentNode,
	          requiredProperty: propertyNames
	        }
	      }
	    ];
	  }

	  return [];
	};

	function findProperties(node, propertyNames) {
	  const properties = [];

	  for (const propertyName of propertyNames) {
	    const propertyValue = node.get(propertyName);

	    if (!isEmptyValue(propertyValue)) {
	      properties.push(node.get(propertyName));
	    }
	  }

	  return properties;
	}

	element.hasExtensionElement = function(node, types, parentNode = null) {
	  const typesArray = isArray(types) ? types : [ types ];

	  const extensionElements = findExtensionElements(node, typesArray);

	  if (!extensionElements || extensionElements.length !== 1) {
	    return [
	      {
	        message: `Element of type <${ node.$type }> must have one extension element of type ${ formatNames(typesArray, true) }`,
	        path: getPath(node, parentNode),
	        data: {
	          type: ERROR_TYPES.EXTENSION_ELEMENT_REQUIRED,
	          node,
	          parentNode: parentNode == node ? null : parentNode,
	          requiredExtensionElement: types
	        }
	      }
	    ];
	  }

	  return [];
	};

	element.hasNoExtensionElement = function(node, type, parentNode = null, allowedVersion = null) {
	  const extensionElement = findExtensionElement(node, type);

	  if (extensionElement) {
	    return [
	      {
	        message: allowedVersion
	          ? `Extension element of type <${ type }> only allowed by Camunda ${ allowedVersion }`
	          : `Extension element of type <${ type }> not allowed`,
	        path: getPath(extensionElement, parentNode),
	        data: addAllowedVersion({
	          type: ERROR_TYPES.EXTENSION_ELEMENT_NOT_ALLOWED,
	          node,
	          parentNode: parentNode == node ? null : parentNode,
	          extensionElement
	        }, allowedVersion)
	      }
	    ];
	  }

	  return [];
	};

	element.hasExpression = function(node, propertyName, check, parentNode = null) {
	  const expression = node.get(propertyName);

	  if (!expression) {
	    throw new Error('Expression not found');
	  }

	  let propertyValue = expression;

	  if (is(expression, 'bpmn:Expression')) {
	    propertyValue = expression.get('body');
	  }

	  const path = getPath(node, parentNode);

	  if (!propertyValue) {
	    if (check.required !== false) {
	      return [
	        {
	          message: `Property <${ propertyName }> must have expression value`,
	          path: path
	            ? [ ...path, propertyName ]
	            : null,
	          data: {
	            type: ERROR_TYPES.EXPRESSION_REQUIRED,
	            node: is(expression, 'bpmn:Expression') ? expression : node,
	            parentNode,
	            property: propertyName
	          }
	        }
	      ];
	    }

	    return [];
	  }

	  const allowed = check.allowed(propertyValue);

	  if (allowed !== true) {
	    let allowedVersion = null;

	    if (isObject(allowed)) {
	      ({ allowedVersion } = allowed);
	    }

	    return [
	      {
	        message: allowedVersion
	          ? `Expression value of <${ propertyValue }> only allowed by Camunda ${ allowedVersion }`
	          : `Expression value of <${ propertyValue }> not allowed`,
	        path: path
	          ? [ ...path, propertyName ]
	          : null,
	        data: addAllowedVersion({
	          type: ERROR_TYPES.EXPRESSION_VALUE_NOT_ALLOWED,
	          node: is(expression, 'bpmn:Expression') ? expression : node,
	          parentNode,
	          property: propertyName
	        }, allowedVersion)
	      }
	    ];
	  }

	  return [];
	};

	function isExactly(node, type) {
	  const { $model } = node;

	  return $model.getType(node.$type) === $model.getType(type);
	}

	element.isExactly = isExactly;

	element.isAnyExactly = function(node, types) {
	  return some(types, (type) => isExactly(node, type));
	};

	function truncate(string, maxLength = 10) {
	  const stringified = `${ string }`;

	  return stringified.length > maxLength ? `${ stringified.slice(0, maxLength) }...` : stringified;
	}

	function addAllowedVersion(data, allowedVersion) {
	  if (!allowedVersion) {
	    return data;
	  }

	  return {
	    ...data,
	    allowedVersion
	  };
	}

	function findParent(node, type) {
	  if (!node) {
	    return null;
	  }

	  const parent = node.$parent;

	  if (!parent) {
	    return node;
	  }

	  if (is(parent, type)) {
	    return parent;
	  }

	  return findParent(parent, type);
	}

	element.findParent = findParent;

	function isEmptyString(value) {
	  return isString(value) && value.trim() === '';
	}

	function isEmptyValue(value) {
	  return isUndefined(value) || isNil(value) || isEmptyString(value);
	}
	return element;
}

var reporter = {};

var hasRequiredReporter;

function requireReporter () {
	if (hasRequiredReporter) return reporter;
	hasRequiredReporter = 1;
	const { is } = require$$1$1;

	const { isArray } = require$$0;

	reporter.reportErrors = function(node, reporter, errors) {
	  if (!isArray(errors)) {
	    errors = [ errors ];
	  }

	  errors.forEach(({ message, ...options }) => {
	    const name = getName(node);

	    if (name) {
	      options = {
	        ...options,
	        name
	      };
	    }

	    reporter.report(node.get('id'), message, options);
	  });
	};

	function getName(node) {
	  if (is(node, 'bpmn:TextAnnotation')) {
	    return node.get('text');
	  }

	  if (is(node, 'bpmn:Group')) {
	    const categoryValueRef = node.get('categoryValueRef');

	    return categoryValueRef && categoryValueRef.get('value');
	  }

	  return node.get('name');
	}

	reporter.getName = getName;
	return reporter;
}

var inclusiveGateway;
var hasRequiredInclusiveGateway;

function requireInclusiveGateway () {
	if (hasRequiredInclusiveGateway) return inclusiveGateway;
	hasRequiredInclusiveGateway = 1;
	const { is } = require$$1$1;

	const { ERROR_TYPES } = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	inclusiveGateway = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:InclusiveGateway')) {
	      return;
	    }

	    const incoming = node.get('incoming');

	    if (incoming && incoming.length > 1) {
	      const error = {
	        message: `Element of type <${ node.$type }> must have one property <incoming> of type <bpmn:SequenceFlow>`,
	        path: [ 'incoming' ],
	        data: {
	          type: ERROR_TYPES.PROPERTY_NOT_ALLOWED,
	          node,
	          parentNode: null,
	          property: 'incoming'
	        }
	      };

	      reportErrors(node, reporter, error);
	    }
	  }

	  return {
	    check
	  };
	});
	return inclusiveGateway;
}

var inclusiveGatewayExports = requireInclusiveGateway();
var rule_29 = /*@__PURE__*/getDefaultExportFromCjs(inclusiveGatewayExports);

var helper = {};

var hasRequiredHelper;

function requireHelper () {
	if (hasRequiredHelper) return helper;
	hasRequiredHelper = 1;
	const modelingGuidanceBaseUrl = 'https://docs.camunda.io/docs/components/modeler/reference/modeling-guidance/rules';

	/**
	 * @typedef { any } RuleDefinition
	 */

	/**
	 * Annotate a rule with core information, such as the documentation url.
	 *
	 * @param { string } ruleName
	 * @param { RuleDefinition } options
	 *
	 * @return { RuleDefinition }
	 */
	function annotateRule(ruleName, options) {

	  const {
	    meta: {
	      documentation = {},
	      ...restMeta
	    } = {},
	    ...restOptions
	  } = options;

	  const documentationUrl = `${modelingGuidanceBaseUrl}/${ruleName}/`;

	  return {
	    meta: {
	      documentation: {
	        url: documentationUrl,
	        ...documentation
	      },
	      ...restMeta
	    },
	    ...restOptions
	  };
	}

	helper.annotateRule = annotateRule;
	return helper;
}

var messageReference;
var hasRequiredMessageReference;

function requireMessageReference () {
	if (hasRequiredMessageReference) return messageReference;
	hasRequiredMessageReference = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  getEventDefinition,
	  hasProperties
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();
	const { annotateRule } = requireHelper();

	messageReference = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!isAny(node, [ 'bpmn:CatchEvent', 'bpmn:ReceiveTask' ])) {
	      return;
	    }

	    let eventDefinitionOrReceiveTask = node;

	    if (!is(node, 'bpmn:ReceiveTask')) {
	      const eventDefinition = getEventDefinition(node);

	      if (!eventDefinition || !is(eventDefinition, 'bpmn:MessageEventDefinition')) {
	        return;
	      }

	      eventDefinitionOrReceiveTask = eventDefinition;
	    }

	    let errors = hasProperties(eventDefinitionOrReceiveTask, {
	      messageRef: {
	        required: true
	      }
	    }, node);

	    if (errors && errors.length) {
	      reportErrors(node, reporter, errors);

	      return;
	    }

	    const messageRef = eventDefinitionOrReceiveTask.get('messageRef');

	    errors = hasProperties(messageRef, {
	      name: {
	        required: true
	      }
	    }, node);

	    if (errors && errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return annotateRule('message-reference', {
	    check
	  });
	});
	return messageReference;
}

var messageReferenceExports = requireMessageReference();
var rule_30 = /*@__PURE__*/getDefaultExportFromCjs(messageReferenceExports);

var collapsedSubprocess;
var hasRequiredCollapsedSubprocess;

function requireCollapsedSubprocess () {
	if (hasRequiredCollapsedSubprocess) return collapsedSubprocess;
	hasRequiredCollapsedSubprocess = 1;
	const { is } = require$$1$1;

	const { ERROR_TYPES } = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	collapsedSubprocess = skipInNonExecutableProcess(function() {
	  function check(di, reporter) {

	    if (!isCollapsedSubProcess(di)) {
	      return;
	    }

	    const node = di.bpmnElement;

	    const error = {
	      message: `A <${ node.$type }> must be expanded`,
	      data: {
	        type: ERROR_TYPES.ELEMENT_COLLAPSED_NOT_ALLOWED,
	        node: node,
	        parentNode: null,
	        allowedVersion: '8.4'
	      }
	    };

	    reportErrors(node, reporter, error);
	  }

	  return {
	    check
	  };
	});

	function isCollapsedSubProcess(di) {
	  return is(di, 'bpmndi:BPMNShape') &&
	         is(di.get('bpmnElement'), 'bpmn:SubProcess') &&
	         di.get('isExpanded') !== true;
	}
	return collapsedSubprocess;
}

var collapsedSubprocessExports = requireCollapsedSubprocess();
var rule_31 = /*@__PURE__*/getDefaultExportFromCjs(collapsedSubprocessExports);

var errorReference;
var hasRequiredErrorReference;

function requireErrorReference () {
	if (hasRequiredErrorReference) return errorReference;
	hasRequiredErrorReference = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  getEventDefinition,
	  hasProperties
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	const { greaterOrEqual } = requireVersion();
	const { annotateRule } = requireHelper();

	const NO_ERROR_REF_ALLOWED_VERSION = '8.2';

	errorReference = skipInNonExecutableProcess(function({ version }) {
	  function check(node, reporter) {
	    if (!isAny(node, [ 'bpmn:CatchEvent', 'bpmn:ThrowEvent' ])) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:ErrorEventDefinition')) {
	      return;
	    }

	    let errors = [];

	    if (!isNoErrorRefAllowed(node, version)) {
	      errors = hasProperties(eventDefinition, {
	        errorRef: {
	          required: true,
	          allowedVersion: '8.2'
	        }
	      }, node);

	      if (errors.length) {
	        reportErrors(node, reporter, errors);

	        return;
	      }
	    }

	    const errorRef = eventDefinition.get('errorRef');

	    if (!errorRef) {
	      return;
	    }

	    errors = hasProperties(errorRef, {
	      errorCode: {
	        required: true
	      }
	    }, node);

	    if (errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return annotateRule('error-reference', {
	    check
	  });
	});

	function isNoErrorRefAllowed(node, version) {
	  return is(node, 'bpmn:CatchEvent') && greaterOrEqual(version, NO_ERROR_REF_ALLOWED_VERSION);
	}
	return errorReference;
}

var errorReferenceExports = requireErrorReference();
var rule_32 = /*@__PURE__*/getDefaultExportFromCjs(errorReferenceExports);

var escalationBoundaryEventAttachedToRef;
var hasRequiredEscalationBoundaryEventAttachedToRef;

function requireEscalationBoundaryEventAttachedToRef () {
	if (hasRequiredEscalationBoundaryEventAttachedToRef) return escalationBoundaryEventAttachedToRef;
	hasRequiredEscalationBoundaryEventAttachedToRef = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  getEventDefinition,
	} = requireElement();

	const { ERROR_TYPES } = requireErrorTypes();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	escalationBoundaryEventAttachedToRef = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!isAny(node, [ 'bpmn:CatchEvent', 'bpmn:ThrowEvent' ])) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:EscalationEventDefinition')) {
	      return;
	    }

	    const attachedToRef = node.get('attachedToRef');

	    if (attachedToRef && is(attachedToRef, 'bpmn:Task')) {
	      reportErrors(node, reporter, {
	        message: `Element of type <bpmn:BoundaryEvent> with event definition of type <bpmn:EscalationEventDefinition> is not allowed to be attached to element of type <${ attachedToRef.$type }>`,
	        path: null,
	        data: {
	          type: ERROR_TYPES.ATTACHED_TO_REF_ELEMENT_TYPE_NOT_ALLOWED,
	          node,
	          parentNode: null,
	          attachedToRef
	        }
	      });
	    }
	  }

	  return {
	    check
	  };
	});
	return escalationBoundaryEventAttachedToRef;
}

var escalationBoundaryEventAttachedToRefExports = requireEscalationBoundaryEventAttachedToRef();
var rule_33 = /*@__PURE__*/getDefaultExportFromCjs(escalationBoundaryEventAttachedToRefExports);

var escalationReference;
var hasRequiredEscalationReference;

function requireEscalationReference () {
	if (hasRequiredEscalationReference) return escalationReference;
	hasRequiredEscalationReference = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  getEventDefinition,
	  hasProperties
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();
	const { annotateRule } = requireHelper();

	escalationReference = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!isAny(node, [ 'bpmn:CatchEvent', 'bpmn:ThrowEvent' ])) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:EscalationEventDefinition')) {
	      return;
	    }

	    let errors = [];

	    if (!isNoEscalationRefAllowed(node)) {
	      errors = hasProperties(eventDefinition, {
	        escalationRef: {
	          required: true
	        }
	      }, node);

	      if (errors.length) {
	        reportErrors(node, reporter, errors);

	        return;
	      }
	    }

	    const escalationRef = eventDefinition.get('escalationRef');

	    if (!escalationRef) {
	      return;
	    }

	    errors = hasProperties(escalationRef, {
	      escalationCode: {
	        required: true
	      }
	    }, node);

	    if (errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return annotateRule('escalation-reference', {
	    check
	  });
	});

	function isNoEscalationRefAllowed(node) {
	  return isAny(node, [ 'bpmn:CatchEvent', 'bpmn:BoundaryEvent' ]);
	}
	return escalationReference;
}

var escalationReferenceExports = requireEscalationReference();
var rule_34 = /*@__PURE__*/getDefaultExportFromCjs(escalationReferenceExports);

var executableProcess;
var hasRequiredExecutableProcess;

function requireExecutableProcess () {
	if (hasRequiredExecutableProcess) return executableProcess;
	hasRequiredExecutableProcess = 1;
	const { is } = require$$1$1;

	const { hasProperties } = requireElement();

	const { reportErrors } = requireReporter();

	executableProcess = function() {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:Definitions')) {
	      return;
	    }

	    const rootElements = node.get('rootElements'),
	          collaboration = rootElements.find(rootElement => is(rootElement, 'bpmn:Collaboration')),
	          processes = rootElements.filter(rootElement => is(rootElement, 'bpmn:Process'));

	    let errors = [];

	    for (const process of processes) {
	      const parentNode = getParentNode(process, collaboration);

	      errors = [
	        ...errors,
	        ...hasProperties(process, {
	          isExecutable: {
	            value: true
	          }
	        }, parentNode)
	      ];
	    }

	    if (errors.length > processes.length - 1) {
	      errors.forEach(error => {
	        const { data } = error;

	        const { node: process } = data;

	        reportErrors(getParentNode(process, collaboration), reporter, error);
	      });
	    }
	  }

	  return {
	    check
	  };
	};

	function getParentNode(process, collaboration) {
	  if (!collaboration) {
	    return process;
	  }

	  const participants = collaboration.get('participants');

	  const participant = participants.find(participant => participant.get('processRef') === process);

	  if (participant) {
	    return participant;
	  }

	  return process;
	}
	return executableProcess;
}

var executableProcessExports = requireExecutableProcess();
var rule_35 = /*@__PURE__*/getDefaultExportFromCjs(executableProcessExports);

var linkEvent;
var hasRequiredLinkEvent;

function requireLinkEvent () {
	if (hasRequiredLinkEvent) return linkEvent;
	hasRequiredLinkEvent = 1;
	const { getPath } = require$$1;

	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  getEventDefinition,
	  hasProperties
	} = requireElement();

	const { ERROR_TYPES } = requireErrorTypes();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	linkEvent = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {

	    // check for duplicate link catch event names
	    if (is(node, 'bpmn:Process')) {
	      const linkCatchEvents = getLinkCatchEvents(node);

	      const { duplicateNames } = linkCatchEvents.reduce(({ duplicateNames, names }, linkCatchEvent, index) => {
	        const linkEventDefinition = getEventDefinition(linkCatchEvent, 'bpmn:LinkEventDefinition');

	        const name = linkEventDefinition.get('name');

	        names = [
	          ...names,
	          name
	        ];

	        if (!name) {
	          return {
	            duplicateNames,
	            names
	          };
	        }

	        if (names.indexOf(name) !== index && !duplicateNames.includes(name)) {
	          duplicateNames = [
	            ...duplicateNames,
	            name
	          ];
	        }

	        return {
	          duplicateNames,
	          names
	        };
	      }, {
	        duplicateNames: [],
	        names: []
	      });

	      duplicateNames.forEach((name) => {
	        const duplicates = linkCatchEvents
	          .filter(linkCatchEvent => {
	            const linkEventDefinition = getEventDefinition(linkCatchEvent, 'bpmn:LinkEventDefinition');

	            return linkEventDefinition.get('name') === name;
	          });

	        duplicates
	          .forEach(linkCatchEvent => {
	            const linkEventDefinition = getEventDefinition(linkCatchEvent, 'bpmn:LinkEventDefinition');

	            const path = getPath(linkEventDefinition, linkCatchEvent);

	            reportErrors(linkCatchEvent, reporter, {
	              message: `Property of type <bpmn:LinkEventDefinition> has property <name> with duplicate value of <${ name }>`,
	              path: path
	                ? [ ...path, 'name' ]
	                : [ 'name' ],
	              data: {
	                type: ERROR_TYPES.ELEMENT_PROPERTY_VALUE_DUPLICATED,
	                node: linkEventDefinition,
	                parentNode: linkCatchEvent,
	                duplicatedProperty: 'name',
	                duplicatedPropertyValue: name
	              }
	            });
	          });
	      });
	    }

	    // check for missing link catch & throw event names
	    if (isLinkEvent(node)) {
	      const linkEventDefinition = getEventDefinition(node);

	      const errors = hasProperties(linkEventDefinition, {
	        name: {
	          required: true
	        }
	      }, node);

	      if (errors.length) {
	        reportErrors(node, reporter, errors);
	      }
	    }
	  }

	  return {
	    check
	  };
	});

	function isLinkEvent(element) {
	  const eventDefinition = getEventDefinition(element);

	  return isAny(element, [
	    'bpmn:IntermediateCatchEvent',
	    'bpmn:IntermediateThrowEvent'
	  ]) && eventDefinition && is(eventDefinition, 'bpmn:LinkEventDefinition');
	}

	function isLinkCatchEvent(element) {
	  const eventDefinition = getEventDefinition(element);

	  return is(element, 'bpmn:IntermediateCatchEvent')
	    && eventDefinition && is(eventDefinition, 'bpmn:LinkEventDefinition');
	}

	function getLinkCatchEvents(flowElementsContainer) {
	  return flowElementsContainer.get('flowElements').reduce((linkCatchEvents, flowElement) => {
	    if (isLinkCatchEvent(flowElement)) {
	      return [
	        ...linkCatchEvents,
	        flowElement
	      ];
	    } else if (is(flowElement, 'bpmn:SubProcess')) {
	      return [
	        ...linkCatchEvents,
	        ...getLinkCatchEvents(flowElement)
	      ];
	    }

	    return linkCatchEvents;
	  }, []);
	}
	return linkEvent;
}

var linkEventExports = requireLinkEvent();
var rule_36 = /*@__PURE__*/getDefaultExportFromCjs(linkEventExports);

var noExpression_1;
var hasRequiredNoExpression;

function requireNoExpression () {
	if (hasRequiredNoExpression) return noExpression_1;
	hasRequiredNoExpression = 1;
	const {
	  is
	} = require$$1$1;

	const { getPath } = require$$1;

	const {
	  ERROR_TYPES,
	  getEventDefinition
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	const handlersMap = {
	  '1.0': [
	    checkErrorCode
	  ],
	  '1.1': [
	    checkErrorCode
	  ],
	  '1.2': [
	    checkErrorCode
	  ],
	  '1.3': [
	    checkErrorCode
	  ],
	  '8.0': [
	    checkErrorCode
	  ],
	  '8.1': [
	    checkErrorCode
	  ],
	  '8.2': [
	    checkErrorCatchEvent,
	    checkEscalationCatchEvent
	  ],
	  '8.3': [
	    checkErrorCatchEvent,
	    checkEscalationCatchEvent
	  ]
	};

	noExpression_1 = skipInNonExecutableProcess(noExpressionRule);

	/**
	 * Make sure that certain properties do not contain expressions in older versions.
	 * @param {{ version: string }} config
	 */
	function noExpressionRule({ version }) {
	  function check(node, reporter) {
	    const errors = checkForVersion(node, version);

	    if (errors && errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return {
	    check
	  };
	}

	function checkForVersion(node, version) {
	  const handlers = handlersMap[version];

	  if (!handlers) {
	    return [];
	  }

	  return handlers.reduce((errors, handler) => {
	    const handlerErrors = handler(node) || [];
	    return errors.concat(handlerErrors);
	  }, []);
	}

	function noExpression(node, propertyName, parentNode, allowedVersion) {
	  const path = getPath(node, parentNode),
	        propertyValue = node.get(propertyName);

	  if (!isExpression(propertyValue)) {
	    return;
	  }

	  let message = `Expression statement <${ truncate(propertyValue) }> not supported`;

	  let data = {
	    type: ERROR_TYPES.EXPRESSION_NOT_ALLOWED,
	    node,
	    parentNode: parentNode == node ? null : parentNode,
	    property: propertyName
	  };

	  if (allowedVersion) {
	    message = `Expression statement <${ truncate(propertyValue) }> only supported by Camunda ${allowedVersion} or newer`;

	    data = {
	      ...data,
	      allowedVersion
	    };
	  }

	  return {
	    message,
	    path: path
	      ? [ ...path, propertyName ]
	      : [ propertyName ],
	    data
	  };
	}

	function isExpression(value) {
	  return value && value.startsWith('=');
	}

	function checkErrorCode(node) {
	  if (!is(node, 'bpmn:Event')) {
	    return;
	  }

	  const eventDefinition = getEventDefinition(node);

	  if (!eventDefinition || !is(eventDefinition, 'bpmn:ErrorEventDefinition')) {
	    return;
	  }

	  const errorRef = eventDefinition.get('errorRef');

	  if (!errorRef) {
	    return;
	  }

	  if (is(node, 'bpmn:CatchEvent')) {
	    return noExpression(errorRef, 'errorCode', node, null);
	  } else {
	    return noExpression(errorRef, 'errorCode', node, '8.2');
	  }
	}

	function checkErrorCatchEvent(node) {
	  if (!is(node, 'bpmn:CatchEvent')) {
	    return;
	  }

	  return checkErrorCode(node);
	}

	function checkEscalationCatchEvent(node) {
	  if (!is(node, 'bpmn:CatchEvent')) {
	    return;
	  }

	  const eventDefinition = getEventDefinition(node);

	  if (!eventDefinition || !is(eventDefinition, 'bpmn:EscalationEventDefinition')) {
	    return;
	  }

	  const escalationRef = eventDefinition.get('escalationRef');

	  if (!escalationRef) {
	    return;
	  }

	  return noExpression(escalationRef, 'escalationCode', node, null);
	}

	function truncate(string, maxLength = 10) {
	  const stringified = `${ string }`;

	  return stringified.length > maxLength ? `${ stringified.slice(0, maxLength) }...` : stringified;
	}
	return noExpression_1;
}

var noExpressionExports = requireNoExpression();
var rule_37 = /*@__PURE__*/getDefaultExportFromCjs(noExpressionExports);

var noInterruptingEventSubprocess;
var hasRequiredNoInterruptingEventSubprocess;

function requireNoInterruptingEventSubprocess () {
	if (hasRequiredNoInterruptingEventSubprocess) return noInterruptingEventSubprocess;
	hasRequiredNoInterruptingEventSubprocess = 1;
	const { is } = require$$1$1;

	const { reportErrors } = requireReporter();

	const { hasProperties } = requireElement();


	/**
	 * Rule that disallows interrupting start events in event subprocesses
	 * that are placed inside ad-hoc subprocesses.
	 */
	noInterruptingEventSubprocess = function() {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:StartEvent')) {
	      return;
	    }

	    // Check if parent is event subprocess placed inside an ad-hoc subprocess
	    const parent = node.$parent;
	    if (!parent || !isEventSubProcess(parent)) {
	      return;
	    }

	    const grandparent = parent.$parent;
	    if (!grandparent || !is(grandparent, 'bpmn:AdHocSubProcess')) {
	      return;
	    }

	    const errors = hasProperties(node, {
	      isInterrupting: {
	        value: false
	      }
	    }, node);

	    if (errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return {
	    check: check
	  };
	};

	function isEventSubProcess(node) {
	  return is(node, 'bpmn:SubProcess') && node.get('triggeredByEvent');
	}
	return noInterruptingEventSubprocess;
}

var noInterruptingEventSubprocessExports = requireNoInterruptingEventSubprocess();
var rule_38 = /*@__PURE__*/getDefaultExportFromCjs(noInterruptingEventSubprocessExports);

var noMultipleNoneStartEvents;
var hasRequiredNoMultipleNoneStartEvents;

function requireNoMultipleNoneStartEvents () {
	if (hasRequiredNoMultipleNoneStartEvents) return noMultipleNoneStartEvents;
	hasRequiredNoMultipleNoneStartEvents = 1;
	const { is } = require$$1$1;

	const { reportErrors } = requireReporter();

	const { ERROR_TYPES } = requireElement();

	const { skipInNonExecutableProcess } = requireRule();

	noMultipleNoneStartEvents = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:Process')) {
	      return;
	    }

	    const flowElements = node.get('flowElements') || [];

	    const noneStartEvents = flowElements.filter(flowElement => {
	      return is(flowElement, 'bpmn:StartEvent') && !flowElement.get('eventDefinitions').length;
	    });

	    if (noneStartEvents.length <= 1) {
	      return;
	    }

	    noneStartEvents.forEach(startEvent => {
	      reportErrors(startEvent, reporter, {
	        message: 'Multiple elements of type <bpmn:StartEvent> with no event definition not allowed as children of <bpmn:Process>',
	        path: null,
	        data: {
	          type: ERROR_TYPES.ELEMENT_MULTIPLE_NOT_ALLOWED,
	          node: startEvent,
	          parent: null
	        }
	      });
	    });
	  }

	  return {
	    check
	  };
	});
	return noMultipleNoneStartEvents;
}

var noMultipleNoneStartEventsExports = requireNoMultipleNoneStartEvents();
var rule_39 = /*@__PURE__*/getDefaultExportFromCjs(noMultipleNoneStartEventsExports);

var noSignalEventSubProcess;
var hasRequiredNoSignalEventSubProcess;

function requireNoSignalEventSubProcess () {
	if (hasRequiredNoSignalEventSubProcess) return noSignalEventSubProcess;
	hasRequiredNoSignalEventSubProcess = 1;
	const { is } = require$$1$1;

	const { reportErrors } = requireReporter();

	const { getEventDefinition } = requireElement();

	const { ERROR_TYPES } = requireErrorTypes();

	const { skipInNonExecutableProcess } = requireRule();

	noSignalEventSubProcess = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:StartEvent')) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:SignalEventDefinition')) {
	      return;
	    }

	    const { $parent: parent } = node;

	    if (parent && is(parent, 'bpmn:SubProcess')) {
	      const error = {
	        message: 'Element of type <bpmn:StartEvent> with event definition of type <bpmn:SignalEventDefinition> not allowed as child of <bpmn:SubProcess>',
	        path: null,
	        data: {
	          type: ERROR_TYPES.CHILD_ELEMENT_TYPE_NOT_ALLOWED,
	          node,
	          parentNode: null,
	          eventDefinition,
	          parent,
	          allowedVersion: '8.3'
	        }
	      };

	      reportErrors(node, reporter, error);
	    }
	  }

	  return {
	    check
	  };
	});
	return noSignalEventSubProcess;
}

var noSignalEventSubProcessExports = requireNoSignalEventSubProcess();
var rule_40 = /*@__PURE__*/getDefaultExportFromCjs(noSignalEventSubProcessExports);

var sequenceFlowCondition;
var hasRequiredSequenceFlowCondition;

function requireSequenceFlowCondition () {
	if (hasRequiredSequenceFlowCondition) return sequenceFlowCondition;
	hasRequiredSequenceFlowCondition = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  ERROR_TYPES,
	  hasProperties
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	sequenceFlowCondition = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (isAny(node, [ 'bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway' ])) {
	      const outgoing = node.get('outgoing');

	      if (outgoing && outgoing.length > 1) {
	        for (let sequenceFlow of outgoing) {
	          if (node.get('default') !== sequenceFlow) {
	            const errors = hasProperties(sequenceFlow, {
	              conditionExpression: {
	                required: true
	              }
	            }, sequenceFlow);

	            if (errors.length) {
	              reportErrors(sequenceFlow, reporter, errors);
	            }
	          }
	        }
	      }
	    } else if (is(node, 'bpmn:SequenceFlow')) {
	      const source = node.get('sourceRef'),
	            conditionExpression = node.get('conditionExpression');

	      if (source && !isAny(source, [ 'bpmn:ExclusiveGateway', 'bpmn:InclusiveGateway' ]) && conditionExpression) {
	        reportErrors(node, reporter, {
	          message: 'Property <conditionExpression> only allowed if source is of type <bpmn:ExclusiveGateway> or <bpmn:InclusiveGateway>',
	          path: [ 'conditionExpression' ],
	          data: {
	            type: ERROR_TYPES.PROPERTY_NOT_ALLOWED,
	            node: node,
	            parentNode: null,
	            property: 'conditionExpression'
	          }
	        });
	      }
	    }
	  }

	  return {
	    check
	  };
	});
	return sequenceFlowCondition;
}

var sequenceFlowConditionExports = requireSequenceFlowCondition();
var rule_41 = /*@__PURE__*/getDefaultExportFromCjs(sequenceFlowConditionExports);

var signalReference;
var hasRequiredSignalReference;

function requireSignalReference () {
	if (hasRequiredSignalReference) return signalReference;
	hasRequiredSignalReference = 1;
	const {
	  is,
	  isAny
	} = require$$1$1;

	const {
	  getEventDefinition,
	  hasProperties
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	signalReference = skipInNonExecutableProcess(function() {
	  function check(node, reporter) {
	    if (!isAny(node, [
	      'bpmn:StartEvent',
	      'bpmn:IntermediateThrowEvent',
	      'bpmn:IntermediateCatchEvent',
	      'bpmn:EndEvent',
	      'bpmn:BoundaryEvent'
	    ])) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:SignalEventDefinition')) {
	      return;
	    }

	    let errors = hasProperties(eventDefinition, {
	      signalRef: {
	        required: true
	      }
	    }, node);

	    if (errors.length) {
	      reportErrors(node, reporter, errors);

	      return;
	    }

	    const signalRef = eventDefinition.get('signalRef');

	    if (!signalRef) {
	      return;
	    }

	    errors = hasProperties(signalRef, {
	      name: {
	        required: true
	      }
	    }, node);

	    if (errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return {
	    check
	  };
	});
	return signalReference;
}

var signalReferenceExports = requireSignalReference();
var rule_42 = /*@__PURE__*/getDefaultExportFromCjs(signalReferenceExports);

var waitForCompletion_1;
var hasRequiredWaitForCompletion;

function requireWaitForCompletion () {
	if (hasRequiredWaitForCompletion) return waitForCompletion_1;
	hasRequiredWaitForCompletion = 1;
	const {
	  is
	} = require$$1$1;

	const {
	  getEventDefinition,
	  hasProperties
	} = requireElement();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	waitForCompletion_1 = skipInNonExecutableProcess(waitForCompletion);

	/**
	 * Make sure that wait for completion is NOT set to false.
	 */
	function waitForCompletion() {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:ThrowEvent')) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:CompensateEventDefinition')) {
	      return;
	    }

	    const errors = hasProperties(eventDefinition, {
	      waitForCompletion: {
	        value: true
	      }
	    }, node);

	    if (errors && errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }


	  return {
	    check
	  };
	}
	return waitForCompletion_1;
}

var waitForCompletionExports = requireWaitForCompletion();
var rule_43 = /*@__PURE__*/getDefaultExportFromCjs(waitForCompletionExports);

var config$1;
var hasRequiredConfig;

function requireConfig () {
	if (hasRequiredConfig) return config$1;
	hasRequiredConfig = 1;
	const { is } = require$$1$1;

	config$1 = {
	  expressionType: {
	    'cron': '8.1',
	    'iso8601': '1.0'
	  },
	  elementType: {
	    'bpmn:StartEvent': {
	      'timeCycle': (isInterrupting, parent) => {
	        if (!isInterrupting || !isEventSubProcess(parent)) {
	          return '1.0';
	        }

	        return null;
	      },
	      'timeDate': () => '1.0',
	      'timeDuration': (_, parent) => {
	        if (isEventSubProcess(parent)) {
	          return '1.0';
	        }

	        return null;
	      }
	    },
	    'bpmn:BoundaryEvent': {
	      'timeCycle': (cancelActivity) => {
	        if (!cancelActivity) {
	          return '1.0';
	        }

	        return null;
	      },
	      'timeDate': () => '8.3',
	      'timeDuration': () => '1.0'
	    },
	    'bpmn:IntermediateCatchEvent': {
	      'timeCycle': () => null,
	      'timeDate': () => '8.3',
	      'timeDuration': () => '1.0'
	    }
	  }
	};

	function isEventSubProcess(element) {
	  return is(element, 'bpmn:SubProcess') && element.get('triggeredByEvent') === true;
	}
	return config$1;
}

var cron = {};

var hasRequiredCron;

function requireCron () {
	if (hasRequiredCron) return cron;
	hasRequiredCron = 1;
	const MACROS = [
	  '@yearly',
	  '@annually',
	  '@monthly',
	  '@weekly',
	  '@daily',
	  '@midnight',
	  '@hourly'
	];
	const MACRO_REGEX = new RegExp(`^(${ MACROS.join('|') })$`);

	function validateMacro(text) {
	  return MACRO_REGEX.test(text);
	}

	const ASTERISK = '\\*';
	const QUESTION_MARK = '\\?';
	const COMMA = ',';

	const SECOND = '([0-5]?[0-9])';
	const MINUTE = '([0-5]?[0-9])';
	const HOUR = '([01]?[0-9]|2[0-3])';
	const DAY_OF_MONTH = or(`L(-${ or('[0-2]?[0-9]', '3[0-1]') })?`, '[0-2]?[0-9]', '3[0-1]', dayOfMonthSuffix(or('L', '[0-2]?[0-9]', '3[0-1]')));

	const MONTHS = [
	  'JAN',
	  'FEB',
	  'MAR',
	  'APR',
	  'MAY',
	  'JUN',
	  'JUL',
	  'AUG',
	  'SEP',
	  'OCT',
	  'NOV',
	  'DEC'
	];
	const MONTH = or('[0]?[1-9]', '1[0-2]', ...MONTHS);

	const WEEK_DAYS = [
	  'MON',
	  'TUE',
	  'WED',
	  'THU',
	  'FRI',
	  'SAT',
	  'SUN'
	];
	const DAY_OF_WEEK = or('[0-7]', ...WEEK_DAYS);

	const SECOND_REGEX = or(ASTERISK, interval(ASTERISK), commaSeparated(or(interval(SECOND), optionalRange(SECOND))));
	const MINUTE_REGEX = or(ASTERISK, interval(ASTERISK), commaSeparated(or(interval(MINUTE), optionalRange(MINUTE))));
	const HOUR_REGEX = or(ASTERISK, interval(ASTERISK), commaSeparated(or(interval(HOUR), optionalRange(HOUR))));
	const DAY_OF_MONTH_REGEX = or(ASTERISK, QUESTION_MARK, commaSeparated(optionalRange(DAY_OF_MONTH)));
	const MONTH_REGEX = or(ASTERISK, commaSeparated(optionalRange(MONTH)));
	const DAY_OF_WEEK_REGEX = or(ASTERISK, QUESTION_MARK, commaSeparated(or(optionalRange(DAY_OF_WEEK), dayOfWeekSuffix(DAY_OF_WEEK))));

	const CRON_REGEX = new RegExp(`^${ SECOND_REGEX } ${ MINUTE_REGEX } ${ HOUR_REGEX } ${ DAY_OF_MONTH_REGEX } ${ MONTH_REGEX } ${ DAY_OF_WEEK_REGEX }$`, 'i');

	function validateCron(value) {
	  return CRON_REGEX.test(value);
	}

	cron.validateCronExpression = function(value) {
	  return validateMacro(value) || validateCron(value);
	};



	// helper //////////////

	function or(...patterns) {
	  return `(${patterns.join('|')})`;
	}

	function optionalRange(pattern) {
	  return `${pattern}(-${pattern})?`;
	}

	function commaSeparated(pattern) {
	  return `${pattern}(${COMMA}${pattern})*`;
	}

	function interval(pattern) {
	  return `${pattern}/\\d+`;
	}

	function dayOfMonthSuffix(pattern) {
	  return `${pattern}W`;
	}

	function dayOfWeekSuffix(pattern) {
	  return `${pattern}(#[1-5]|L)`;
	}
	return cron;
}

var iso8601;
var hasRequiredIso8601;

function requireIso8601 () {
	if (hasRequiredIso8601) return iso8601;
	hasRequiredIso8601 = 1;
	const YEAR = '\\d{4}';
	const MONTH = '(?<month>0[1-9]|1[0-2])';
	const DAY = '(0[1-9]|[12][0-9]|3[01])';
	const DATE = `(?<date>${YEAR}-${MONTH}-${DAY})`;
	const HOUR = '(0[0-9]|1[0-9]|2[0-3])';
	const MINUTE = '[0-5][0-9]';
	const SECOND = '[0-5][0-9]';
	const ZONE_ID = '(\\[[^\\]]+\\])';
	const TIMEZONE = `(Z|([+-](0[0-9]|1[0-3]):[0-5][0-9]${ZONE_ID}?))`;

	const ISO_DATE = `${DATE}T${HOUR}:${MINUTE}:${SECOND}${TIMEZONE}`;
	const ISO_DATE_REGEX = new RegExp(`^${ISO_DATE}$`);
	const ISO_DURATION = 'P(?!$)(\\d+(\\.\\d+)?[Yy])?(\\d+(\\.\\d+)?[Mm])?(\\d+(\\.\\d+)?[Ww])?(\\d+(\\.\\d+)?[Dd])?(T(?!$)(\\d+(\\.\\d+)?[Hh])?(\\d+(\\.\\d+)?[Mm])?(\\d+(\\.\\d+)?[Ss])?)?$';
	const ISO_DURATION_REGEX = new RegExp(`^${ISO_DURATION}$`);
	const ISO_CYCLE = `R(-1|\\d+)?/(${ISO_DATE}/)?${ISO_DURATION}`;
	const ISO_CYCLE_REGEX = new RegExp(`^${ISO_CYCLE}$`);

	iso8601 = {
	  validateCycle,
	  validateDate,
	  validateDuration
	};

	function validateCycle(value) {
	  return ISO_CYCLE_REGEX.test(value);
	}

	function validateDate(value) {
	  const result = ISO_DATE_REGEX.exec(value);

	  if (!result) {
	    return false;
	  }

	  return isDateValid(result);
	}

	function validateDuration(value) {
	  return ISO_DURATION_REGEX.test(value);
	}

	function isDateValid(result) {
	  const {
	    date,
	    month
	  } = result.groups;

	  const dateParsedMonth = new Date(date).getMonth() + 1;
	  const parsedMonth = Number.parseInt(month, 10);

	  return dateParsedMonth === parsedMonth;
	}
	return iso8601;
}

var timer;
var hasRequiredTimer;

function requireTimer () {
	if (hasRequiredTimer) return timer;
	hasRequiredTimer = 1;
	const { isNil } = require$$0;

	const {
	  is
	} = require$$1$1;

	const {
	  elementType: elementTypeConfig,
	  expressionType: expressionTypeConfig
	} = requireConfig();

	const { greaterOrEqual } = requireVersion();

	const {
	  getEventDefinition,
	  hasExpression,
	  hasProperties,
	  hasProperty
	} = requireElement();

	const { validateCronExpression } = requireCron();

	const {
	  validateCycle: validateISO8601Cycle,
	  validateDate: validateISO8601Date,
	  validateDuration: validateISO8601Duration
	} = requireIso8601();

	const { reportErrors } = requireReporter();

	const { skipInNonExecutableProcess } = requireRule();

	timer = skipInNonExecutableProcess(function({ version }) {
	  function check(node, reporter) {
	    if (!is(node, 'bpmn:Event')) {
	      return;
	    }

	    const eventDefinition = getEventDefinition(node);

	    if (!eventDefinition || !is(eventDefinition, 'bpmn:TimerEventDefinition')) {
	      return;
	    }

	    let errors = checkTimePropertyExists(eventDefinition, node, version);

	    if (errors && errors.length) {
	      reportErrors(node, reporter, errors);

	      return;
	    }

	    errors = checkTimeProperty(eventDefinition, node, version);

	    if (errors && errors.length) {
	      reportErrors(node, reporter, errors);
	    }
	  }

	  return {
	    check
	  };
	});

	function checkTimePropertyExists(eventDefinition, node, version) {
	  const timePropertyName = getTimePropertyName(eventDefinition);

	  if (timePropertyName) {
	    const allowedVersion = getAllowedVersionForTimeProperty(node, timePropertyName),
	          allowed = isNil(allowedVersion) ? false : greaterOrEqual(version, allowedVersion);

	    return hasProperties(eventDefinition, {
	      [ timePropertyName ]: {
	        allowed,
	        allowedVersion
	      }
	    }, node);
	  }

	  return hasProperty(eventDefinition, getAllowedTimePropertiesForVersion(node, version), node);
	}

	function checkTimeProperty(eventDefinition, event, version) {
	  const timeCycle = eventDefinition.get('timeCycle'),
	        timeDate = eventDefinition.get('timeDate'),
	        timeDuration = eventDefinition.get('timeDuration');

	  if (timeCycle) {
	    return hasExpression(eventDefinition, 'timeCycle', {
	      allowed: cycle => validateCycle(cycle, version)
	    }, event);
	  } else if (timeDate) {
	    return hasExpression(eventDefinition, 'timeDate', {
	      allowed: date => validateDate(date, version)
	    }, event);
	  } else if (timeDuration) {
	    return hasExpression(eventDefinition, 'timeDuration', {
	      allowed: duration => validateDuration(duration, version)
	    }, event);
	  }
	}



	// helpers //////////
	function validateCycle(cycle, version) {
	  if (validateExpression(cycle)) {
	    return true;
	  }

	  if (validateISO8601Cycle(cycle)) {
	    return greaterOrEqual(version, expressionTypeConfig.iso8601);
	  }

	  if (validateCronExpression(cycle)) {
	    return greaterOrEqual(version, expressionTypeConfig.cron) || { allowedVersion: expressionTypeConfig.cron };
	  }
	}

	function validateDate(date, version) {
	  if (validateExpression(date)) {
	    return true;
	  }

	  if (validateISO8601Date(date)) {
	    return greaterOrEqual(version, expressionTypeConfig.iso8601);
	  }
	}

	function validateDuration(duration, version) {
	  if (validateExpression(duration)) {
	    return true;
	  }

	  if (validateISO8601Duration(duration)) {
	    return greaterOrEqual(version, expressionTypeConfig.iso8601);
	  }
	}

	function validateExpression(text) {
	  if (text.startsWith('=')) {
	    return true;
	  }
	}

	function getTimePropertyName(eventDefinition) {
	  if (eventDefinition.get('timeCycle')) {
	    return 'timeCycle';
	  }

	  if (eventDefinition.get('timeDate')) {
	    return 'timeDate';
	  }

	  if (eventDefinition.get('timeDuration')) {
	    return 'timeDuration';
	  }

	  return null;
	}

	function getAllowedTimePropertiesForVersion(element, version) {
	  const config = elementTypeConfig[ element.$type ];

	  return Object.keys(config).filter((property) => {
	    const allowedVersion = config[ property ](isInterrupting(element), element.$parent);

	    return allowedVersion && greaterOrEqual(version, allowedVersion);
	  });
	}

	function getAllowedVersionForTimeProperty(element, property) {
	  const config = elementTypeConfig[ element.$type ];

	  return config[ property ](isInterrupting(element), element.$parent);
	}

	function isInterrupting(element) {
	  if (is(element, 'bpmn:BoundaryEvent')) {
	    return element.get('cancelActivity') !== false;
	  }

	  return element.get('isInterrupting') !== false;
	}
	return timer;
}

var timerExports = requireTimer();
var rule_44 = /*@__PURE__*/getDefaultExportFromCjs(timerExports);

const cache = {};

/**
 * A resolver that caches rules and configuration as part of the bundle,
 * making them accessible in the browser.
 *
 * @param {Object} cache
 */
function Resolver() {}

Resolver.prototype.resolveRule = function(pkg, ruleName) {

  const rule = cache[pkg + '/' + ruleName];

  if (!rule) {
    throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>: not bundled');
  }

  return rule;
};

Resolver.prototype.resolveConfig = function(pkg, configName) {
  throw new Error(
    'cannot resolve config <' + configName + '> in <' + pkg +'>: not bundled'
  );
};

const resolver = new Resolver();

const rules = {
  "ad-hoc-sub-process": "error",
  "conditional-flows": "error",
  "end-event-required": "error",
  "event-based-gateway": "error",
  "event-sub-process-typed-start-event": "error",
  "fake-join": "warn",
  "global": "warn",
  "label-required": "warn",
  "link-event": "error",
  "no-bpmndi": "error",
  "no-complex-gateway": "error",
  "no-disconnected": "error",
  "no-duplicate-sequence-flows": "error",
  "no-gateway-join-fork": "error",
  "no-implicit-split": "error",
  "no-implicit-end": 0,
  "no-implicit-start": "error",
  "no-inclusive-gateway": "warn",
  "no-overlapping-elements": "warn",
  "single-blank-start-event": "error",
  "single-event-definition": "error",
  "start-event-required": "error",
  "sub-process-blank-start-event": "error",
  "superfluous-gateway": "warn",
  "superfluous-termination": "warn",
  "camunda-compat/history-time-to-live": [
    "error",
    {
      "version": "7.24"
    }
  ],
  "camunda/avoid-lanes": "error",
  "camunda/forking-conditions": "error",
  "camunda/implementation": "error",
  "camunda-compat/inclusive-gateway": "error",
  "camunda-compat/message-reference": "error",
  "camunda-compat/collapsed-subprocess": "error",
  "camunda-compat/error-reference": "error",
  "camunda-compat/escalation-boundary-event-attached-to-ref": "error",
  "camunda-compat/escalation-reference": "error",
  "camunda-compat/executable-process": "error",
  "camunda-compat/link-event": "error",
  "camunda-compat/no-expression": "error",
  "camunda-compat/no-interrupting-event-subprocess": "error",
  "camunda-compat/no-multiple-none-start-events": "error",
  "camunda-compat/no-signal-event-sub-process": "error",
  "camunda-compat/sequence-flow-condition": "error",
  "camunda-compat/signal-reference": "error",
  "camunda-compat/wait-for-completion": "error",
  "camunda-compat/timer": [
    "error",
    {
      "version": "7.24"
    }
  ]
};

const config = {
  rules: rules
};

const moddleExtensions = {};

const bundle = {
  resolver: resolver,
  config: config,
  moddleExtensions: moddleExtensions
};

cache['bpmnlint/ad-hoc-sub-process'] = rule_0;

cache['bpmnlint/conditional-flows'] = rule_1;

cache['bpmnlint/end-event-required'] = rule_2;

cache['bpmnlint/event-based-gateway'] = rule_3;

cache['bpmnlint/event-sub-process-typed-start-event'] = rule_4;

cache['bpmnlint/fake-join'] = rule_5;

cache['bpmnlint/global'] = rule_6;

cache['bpmnlint/label-required'] = rule_7;

cache['bpmnlint/link-event'] = rule_8;

cache['bpmnlint/no-bpmndi'] = rule_9;

cache['bpmnlint/no-complex-gateway'] = rule_10;

cache['bpmnlint/no-disconnected'] = rule_11;

cache['bpmnlint/no-duplicate-sequence-flows'] = rule_12;

cache['bpmnlint/no-gateway-join-fork'] = rule_13;

cache['bpmnlint/no-implicit-split'] = rule_14;

cache['bpmnlint/no-implicit-start'] = rule_16;

cache['bpmnlint/no-inclusive-gateway'] = rule_17;

cache['bpmnlint/no-overlapping-elements'] = rule_18;

cache['bpmnlint/single-blank-start-event'] = rule_19;

cache['bpmnlint/single-event-definition'] = rule_20;

cache['bpmnlint/start-event-required'] = rule_21;

cache['bpmnlint/sub-process-blank-start-event'] = rule_22;

cache['bpmnlint/superfluous-gateway'] = rule_23;

cache['bpmnlint/superfluous-termination'] = rule_24;

cache['bpmnlint-plugin-camunda-compat/history-time-to-live'] = rule_25;

cache['bpmnlint-plugin-camunda/avoid-lanes'] = rule_26;

cache['bpmnlint-plugin-camunda/forking-conditions'] = rule_27;

cache['bpmnlint-plugin-camunda/implementation'] = rule_28;

cache['bpmnlint-plugin-camunda-compat/inclusive-gateway'] = rule_29;

cache['bpmnlint-plugin-camunda-compat/message-reference'] = rule_30;

cache['bpmnlint-plugin-camunda-compat/collapsed-subprocess'] = rule_31;

cache['bpmnlint-plugin-camunda-compat/error-reference'] = rule_32;

cache['bpmnlint-plugin-camunda-compat/escalation-boundary-event-attached-to-ref'] = rule_33;

cache['bpmnlint-plugin-camunda-compat/escalation-reference'] = rule_34;

cache['bpmnlint-plugin-camunda-compat/executable-process'] = rule_35;

cache['bpmnlint-plugin-camunda-compat/link-event'] = rule_36;

cache['bpmnlint-plugin-camunda-compat/no-expression'] = rule_37;

cache['bpmnlint-plugin-camunda-compat/no-interrupting-event-subprocess'] = rule_38;

cache['bpmnlint-plugin-camunda-compat/no-multiple-none-start-events'] = rule_39;

cache['bpmnlint-plugin-camunda-compat/no-signal-event-sub-process'] = rule_40;

cache['bpmnlint-plugin-camunda-compat/sequence-flow-condition'] = rule_41;

cache['bpmnlint-plugin-camunda-compat/signal-reference'] = rule_42;

cache['bpmnlint-plugin-camunda-compat/wait-for-completion'] = rule_43;

cache['bpmnlint-plugin-camunda-compat/timer'] = rule_44;

exports.config = config;
exports.default = bundle;
exports.moddleExtensions = moddleExtensions;
exports.resolver = resolver;
