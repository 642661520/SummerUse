import { describe, expect, it } from 'vitest'
import { getAngle, getArea, getCenter, getDestinationPoint, getExtentCenter, getLineLength } from '.'

describe('calculate', () => {
  it('getDestinationPoint getLineLength getAngle 1', () => {
    const start = [120.00, 30.00]
    const end = [121.00, 30.00]
    const angle = getAngle(start, end)
    const lineLength = getLineLength([start, end])
    expect(getDestinationPoint(start, lineLength, angle).map(v => +v.toFixed(2))).toStrictEqual(end)
  })

  it('getDestinationPoint getLineLength getAngle 2', () => {
    const start = [120.00, 30.00]
    const end = [120.00, 31.00]
    const angle = getAngle(start, end)
    const lineLength = getLineLength([start, end])
    expect(getDestinationPoint(start, lineLength, angle).map(v => +v.toFixed(2))).toStrictEqual(end)
  })

  it('getDestinationPoint getLineLength getAngle 3', () => {
    const start = [120.00, 30.00]
    const end = [121.00, 31.00]
    const angle = getAngle(start, end)
    const lineLength = getLineLength([start, end])
    expect(getDestinationPoint(start, lineLength, angle).map(v => +v.toFixed(2))).toStrictEqual(end)
  })

  it('getCenter', () => {
    const start = [120.00, 30.00]
    const end = [121.00, 31.00]
    const center = getCenter(start, end)
    expect(+getLineLength([start, center]).toFixed(2)).toBe(+getLineLength([center, end]).toFixed(2))
  })

  it('getExtentCenter', () => {
    const extent = [120.00, 30.00, 121.00, 31.00]
    const center = getExtentCenter(extent)
    expect(+getLineLength([[extent[0], extent[1]], center]).toFixed(2)).toBe(+getLineLength([center, [extent[2], extent[3]]]).toFixed(2))
  })

  it('getArea', () => {
    const coordinates = [[[120.00, 30.00], [120.01, 30.00], [120.01, 30.01], [120.00, 30.01], [120.00, 30.00]]]
    const topCenter = getCenter([120.00, 30.01], [120.01, 30.01])
    const bottomCenter = getCenter([120.00, 30.00], [120.01, 30.00])
    const leftArea = getArea([[coordinates[0][0], bottomCenter, topCenter, coordinates[0][3], coordinates[0][0]]])
    const rightArea = getArea([[coordinates[0][1], coordinates[0][2], topCenter, bottomCenter, coordinates[0][1]]])
    const area = getArea(coordinates)
    expect((leftArea + rightArea).toFixed(2)).toBe(area.toFixed(2))
  })
})
