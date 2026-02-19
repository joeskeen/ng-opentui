export interface EventPattern<T = {}> {
  eventType: string;
  typeProperty?: keyof T;
  angularBindingExpression?: string;
  eventParameters?: Record<keyof T, any>;
}

export function parseAngularEventBinding<T = {}>(binding: string): EventPattern<T> | null {
  let [scope, expression] = binding.split(':');
  if (!expression) {
    expression = scope;
    scope = '';
  }
  if (!expression) {
    return null;
  }

  const parts = expression.split('.');
  const eventType = parts.shift();
  if (!eventType) {
    return null;
  }

  const params = [...new Set(parts).values()];

  return {
    eventType,
    angularBindingExpression: binding,
    eventParameters: {
      ...params.reduce((acc, param) => ({ ...acc, [param]: true }), {} as Record<keyof T, boolean>),
    },
  };
}

export function isMatch<T>(pattern: EventPattern<T>, event: T): boolean {
  const eventType = (event as any)?.[pattern.typeProperty || 'eventType'] ?? (event as any)?.type;
  return (
    pattern.eventType === eventType &&
    Object.keys(pattern.eventParameters || {}).every(
      (param) => (pattern.eventParameters as any)[param] === (event as any)[param],
    )
  );
}

export function isKeyEventPattern(pattern: EventPattern): boolean {
  return pattern.eventType.toLowerCase().includes('key');
}

export function isMouseEventPattern(pattern: EventPattern): boolean {
  return pattern.eventType.toLowerCase().includes('mouse');
}
