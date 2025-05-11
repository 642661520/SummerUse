import type { ComponentOptionsMixin } from 'vue'

import { defineComponent, h } from 'vue'

export function extendComponent<
  T extends ComponentOptionsMixin,
  S = T extends new () => { $slots: infer Slots } ? Slots : Record<string, never>,
  P = T extends new () => { $props: infer Props } ? Partial<Props> : Record<string, never>,
>(
  BaseComponent: T,
  options?: {
    defaultProps?: P
    name?: string
  },
) {
  const inheritedEmits = Array.isArray((BaseComponent as any).emits)
    ? (BaseComponent as any).emits
    : Object.keys((BaseComponent as any).emits || {})

  return defineComponent({
    name:
      options?.name || `Extended${(BaseComponent as any).name || 'Component'}`,
    extends: BaseComponent,
    emits: inheritedEmits,
    setup(props, { attrs, emit, slots }) {
      const listeners: Record<string, (...args: any[]) => void> = {}
      for (const event of inheritedEmits) {
        const handlerName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`
        listeners[handlerName] = (...args: any[]) => emit(event, ...args)
      }

      return () => {
        const mergedProps: Record<string, any> = {
          ...attrs,
          ...props,
          ...listeners,
        }

        const safeProps = props as Record<string, any>

        // 如果传入默认样式，则做合并
        if (options?.defaultProps) {
          for (const key in options.defaultProps) {
            mergedProps[key]
              = key.endsWith('Style')
                ? [options.defaultProps[key], safeProps[key]]
                : (safeProps[key] ?? attrs[key] ?? options.defaultProps[key])
          }
        }

        return h(BaseComponent, mergedProps, slots)
      }
    },
  }) as new () => {
    $props: Partial<P>
    $slots: S
  }
}
