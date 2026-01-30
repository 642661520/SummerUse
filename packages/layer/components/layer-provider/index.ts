import type { ComputedRef, InjectionKey, PropType } from 'vue'
import type { LayerProps } from '@/components/layer/props'
import type { _LayerOptions } from '@/composables/injectLayer'
import { computed, defineComponent, Fragment, h, inject, provide, ref } from 'vue'
import { layerProviderInjectionKey } from '@/composables/injectLayer'
import InjectLayer from '@/composables/injectLayer/index.vue'

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
  open: () => void
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

    const layerList = ref<_LayerOptions[]>([])
    const layerInstRefs: Record<string, LayerInst | undefined> = {}

    function destroyAll(): void {
      Object.keys(layerInstRefs).forEach((key) => {
        const layer = layerList.value.find(item => item.key === key)
        if (layer) {
          layer.isDestroyed = true
        }
        layerInstRefs[key]?.hide()
      })
    }

    function hideAll(): void {
      Object.keys(layerInstRefs).forEach((key) => {
        layerInstRefs[key]?.hide()
      })
    }

    function create(options: LayerProps = {}) {
      const key = createId()
      const layerRef = ref({
        ...options,
        key,
        isDestroyed: false,
        destroy: () => {
          // 销毁标识
          layerRef.value.isDestroyed = true
          layerInstRefs[key]?.hide()
        },
        hide: () => {
          layerInstRefs[key]?.hide()
        },
        open: () => {
          layerInstRefs[key]?.open()
        },
      })
      layerList.value.push(layerRef.value)
      return layerRef.value
    }

    provide(layerProviderInjectionKey, {
      destroyAll,
      create,
      hideAll,
    })

    return {
      layerList,
      layerInstRefs,
    }
  },
  render() {
    return h(Fragment, null, [
      this.layerList.map((item) => {
        const { destroy: _destroy, hide: _hide, open: _open, isDestroyed: _isDestroyed, ...props } = item
        return h(InjectLayer, {
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
            if (item.isDestroyed && index > -1) {
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
