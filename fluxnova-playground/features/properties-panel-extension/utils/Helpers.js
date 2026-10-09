import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { find } from 'min-dash';

/**
 * isAsync - returns true if the attribute 'camunda:asyncAfter' or 'camunda:asyncBefore'
 * is set to true.
 *
 * @param  {ModdleElement} bo
 * @return {boolean}
 */
function isAsyncBefore(bo) {
  return !!(bo.get('camunda:asyncBefore') || bo.get('camunda:async'));
}

function isAsyncAfter(bo) {
  return !!bo.get('camunda:asyncAfter');
}

export function isAsync(bo) {
  return isAsyncAfter(bo) || isAsyncBefore(bo);
}

/**
 * isTimerEvent - returns true if the element is a bpmn:Event with a timerEventDefinition
 *
 * @param  {ModdleElement} element
 * @return {boolean}
 */
export function isTimerEvent(element) {
  return is(element, 'bpmn:Event') &&
    getTimerEventDefinition(element);
}

export function getTimerEventDefinition(element) {
  return getEventDefinition(element, 'bpmn:TimerEventDefinition');
}

export function getEventDefinition(element, eventType) {
  const businessObject = getBusinessObject(element);

  const eventDefinitions = businessObject.get('eventDefinitions') || [];

  return find(eventDefinitions, function(definition) {
    return is(definition, eventType);
  });
}

