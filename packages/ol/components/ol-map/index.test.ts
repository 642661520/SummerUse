import type { Map } from 'ol'
import type { OlMapProps } from './props'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import OlMap from './index.vue'

describe('olMap', () => {
  it('should render', async () => {
    const props: OlMapProps = {
      center: [0, 0],
      zoom: 10,
      showZoom: true,
      showFullScreen: true,
    }

    const wrapper = mount(OlMap, {
      props,
    })
    const map = (wrapper.vm as any).olMap as Map
    expect(wrapper.exists()).toBe(true)
    expect(map.getView().getZoom()).toBe(10)
    expect(map.getView().getCenter()).toEqual([0, 0])
    expect(map.getLayers().getArray().length).toBe(0)
    await wrapper.vm.$nextTick()
    const zoomIn = wrapper.find('.ol-zoom-in')
    zoomIn.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(map.getView().getZoom()).toBeGreaterThan(10)
  })
})
