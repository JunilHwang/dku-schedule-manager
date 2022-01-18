import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ScheduleResponse } from './ScheduleTypes';

const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  accept: 'application/json',
};

@Injectable()
export class AppService {
  private readonly scheduleClient: AxiosInstance;

  constructor() {
    this.fetchSchedule();
  }

  getHello(): string {
    return 'Hello World!';
  }

  public async fetchSchedule() {
    const payload = Object.entries({
      yy: 2021,
      semCd: 2,
      qrySxn: 2,
      curiCparCd: null,
      lesnPlcCd: 1,
      mjSubjKnm: null,
      mjDowCd: null,
      grade: null,
      pfltNm: null,
    })
      .map(([k, v]) => `${k}=${v || ''}`)
      .join('&');
    const url =
      'https://webinfo.dankook.ac.kr/tiac/univ/lssn/lpci/views/lssnPopup/tmtbl.do';
    const { data } = await axios.post(url, payload, { headers });
    const { lctTmtblDscMjList } = data as ScheduleResponse;

    const keys = Object.keys(lctTmtblDscMjList[0]);

    for (const key of Object.values(keys)) {
      console.log(key, [...new Set(lctTmtblDscMjList.map((v) => v[key]))]);
    }
  }
}
