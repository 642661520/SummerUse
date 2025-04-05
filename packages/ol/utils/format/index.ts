/** 任意角度转换为 0-360 */
export const toOlAngle = (angle: number): number => {
  if (angle < 0) {
    return toOlAngle(angle + 360);
  } else if (angle > 360) {
    return toOlAngle(angle - 360);
  }
  return angle;
};

/** 任意角度转换为 -180-180 */
export const toTurfAngle = (angle: number): number => {
  if (angle < -180) {
    return toTurfAngle(angle + 360);
  } else if (angle > 180) {
    return toTurfAngle(angle - 360);
  }
  return angle;
};
