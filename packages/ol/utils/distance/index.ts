import { ONE_NM } from '../../constants';

/** 公里转海里 */
export const kmToNauticalMiles = (km: number) => {
  return (km * 1000) / ONE_NM;
};

/** 海里转公里 */
export const nauticalMilesToKm = (nauticalMiles: number) => {
  return (nauticalMiles * ONE_NM) / 1000;
};
