import { ONE_NM } from '../../constants'

/** 公里转海里 */
export function kmToNauticalMiles(km: number) {
  return (km * 1000) / ONE_NM
}

/** 海里转公里 */
export function nauticalMilesToKm(nauticalMiles: number) {
  return (nauticalMiles * ONE_NM) / 1000
}
