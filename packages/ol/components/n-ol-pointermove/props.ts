import type { PopoverPlacement } from 'naive-ui';
import type { Map as OLMap } from 'ol';
import type { Coordinate } from 'ol/coordinate';
import type { FeatureLike } from 'ol/Feature';
import type { Pixel } from 'ol/pixel';
import type { VNodeChild } from 'vue';

export interface NOlPointermoveOptions {
  pixel: Pixel;
  coordinate: Coordinate;
  features: FeatureLike[];
}

export interface NOlPointermoveProps {
  olMap: OLMap;
  createOptions: (data: NOlPointermoveOptions) =>
    | {
        content: (() => VNodeChild) | VNodeChild | string;
        raw?: boolean;
        showArrow?: boolean;
        placement?: PopoverPlacement;
      }
    | undefined;
}
