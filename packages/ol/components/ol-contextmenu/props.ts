import type { Map as OLMap } from 'ol';
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import type { Pixel } from 'ol/pixel';
import type { Coordinate } from 'ol/coordinate';
import type { FeatureLike } from 'ol/Feature';

export interface Options {
  event: MouseEvent;
  pixel: Pixel;
  coordinate: Coordinate;
  features: FeatureLike[];
}

export interface Props {
  olMap: OLMap;
  createDropdownOptions: (options: Options) => DropdownMixedOption[];
}
