<script lang="ts">
import type { PropType, VNodeChild } from 'vue'
import { defineComponent, h, isVNode } from 'vue'

export default defineComponent({
  props: {
    dynamicVNode: {
      type: [Function, String, Object] as PropType<
          (() => VNodeChild) | VNodeChild | string
      >,
      default: undefined,
    },
  },
  setup(props) {
    return () => {
      if (!props.dynamicVNode)
        return h('span')
      if (typeof props.dynamicVNode === 'string')
        return props.dynamicVNode
      if (isVNode(props.dynamicVNode))
        return props.dynamicVNode
      if (typeof props.dynamicVNode === 'function') {
        const vNode = props.dynamicVNode()
        if (isVNode(vNode))
          return vNode
        return vNode
      }
    }
  },
})
</script>
