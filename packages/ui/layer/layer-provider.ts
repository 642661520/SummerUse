import type { ComputedRef, InjectionKey, PropType } from 'vue'

import type { LayerProps } from './props'
import type { LayerOptions } from './useLayer'
import { computed, defineComponent, Fragment, h, inject, provide, ref } from 'vue'
import UseLayer from './use-layer.vue'
import { layerProviderInjectionKey } from './useLayer'

export const layerIndexManagerKey = Symbol('layerIndexManagerKey') as InjectionKey<{
  nextZIndex: () => number
  defaultZIndex: number
  zIndex: ComputedRef<number>
}>

const defaultZIndex = 1000

function createLayerIndexManager(defaultZIndex: number) {
  const zIndex = ref(defaultZIndex)

  const nextZIndex = () => {
    zIndex.value += 1
    return zIndex.value
  }

  return {
    defaultZIndex,
    zIndex: computed(() => zIndex.value),
    nextZIndex,
  }
}

export function useLayerIndexManager() {
  const layerIndexManager = inject(layerIndexManagerKey, undefined)
  if (!layerIndexManager) {
    return createLayerIndexManager(defaultZIndex)
  }
  return layerIndexManager
}
let index = 0
function createId() {
  index += 1
  return `layer-${index}`
}

interface LayerInst {
  hide: () => void
}

export const LayerProvider = defineComponent({
  name: 'LayerProvider',
  props: {
    zIndex: {
      type: Number as PropType<number>,
      default: 1000,
    },
  },
  setup(props) {
    const layerIndexManager = createLayerIndexManager(props.zIndex)
    provide(layerIndexManagerKey, layerIndexManager)

    const layerList = ref<LayerOptions[]>([])
    const layerInstRefs: Record<string, LayerInst | undefined> = {}

    function destroyAll(): void {
      Object.values(layerInstRefs).forEach((layerInstRef) => {
        layerInstRef?.hide()
      })
    }

    function create(options: LayerProps = {}) {
      const key = createId()
      const layerRef = ref({
        ...options,
        key,
        destroy: () => {
          layerInstRefs[key]?.hide()
        },
      })
      layerList.value.push(layerRef.value)
      return layerRef.value
    }

    provide(layerProviderInjectionKey, {
      destroyAll,
      create,
    })

    return {
      layerList,
      layerInstRefs,
    }
  },
  render() {
    return h(Fragment, null, [
      this.layerList.map((item) => {
        const { destroy: _, ...props } = item
        return h(UseLayer, {
          ...props,
          ref: ((inst: LayerInst | null) => {
            if (inst === null) {
              delete this.layerInstRefs[item.key]
            }
            else {
              this.layerInstRefs[item.key] = inst
            }
          }) as any,
          onAfterLeave: () => {
            const index = this.layerList.indexOf(item)
            if (index > -1) {
              this.layerList.splice(index, 1)
            }
          },
        } as any)
      },
      ),
      this.$slots.default?.(),
    ])
  },
})
