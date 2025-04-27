import type { ComputedRef, InjectionKey, PropType } from 'vue'
import { computed, defineComponent, Fragment, h, inject, provide, ref } from 'vue'

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
  },
  render() {
    return h(Fragment, null, [
      this.$slots.default?.(),
    ])
  },
})
