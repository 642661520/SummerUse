import type { Map as OLMap } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import type { Extent } from 'ol/extent';
import type { InjectionKey } from 'vue';

export type OlMapProps = {
  olMap?: OLMap; // ol map实例 非响应式
  center?: Coordinate; // 地图中心点 需要对应projection
  zoom?: number; // 地图缩放级别
  minZoom?: number; // 地图最小缩放级别
  maxZoom?: number; // 地图最大缩放级别
  constrainResolution?: boolean; // 是否整数缩放级别 默认true
  projection?: string; // 地图投影 默认EPSG:3857 非响应式
  extent?: Extent; // 地图范围 需要对应projection 非响应式
  showZoom?: boolean; // 是否显示缩放控件 默认隐藏
  showAttribution?: boolean; // 是否显示版权控件 默认隐藏
  showRotate?: boolean; // 是否显示旋转控件 默认隐藏
  showFullScreen?: boolean; // 是否显示全屏控件 默认隐藏
  showOverview?: boolean; // 是否显示鹰眼控件 默认隐藏
  showScale?: boolean; // 是否显示比例尺控件 默认隐藏
  dragPan?: boolean; // 是否开启拖拽平移 默认开启
  mouseWheelZoom?: boolean; // 是否开启鼠标滚轮缩放 默认开启
  doubleClickZoom?: boolean; // 是否开启双击缩放 默认关闭
  pinchRotate?: boolean; // 是否开启双指旋转 默认开启
  pinchZoom?: boolean; // 是否开启双指缩放 默认开启
  altShiftDragRotate?: boolean; // 是否开启Alt+Shift拖拽旋转 默认关闭
};

export const olMapInjectionKey = Symbol() as InjectionKey<OLMap>;
