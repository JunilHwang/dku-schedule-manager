import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Lecture, ScheduleResponse } from './ScheduleTypes';
import * as fs from 'fs';
import * as path from 'path';

const headers = {
  'content-type': 'application/x-www-form-urlencoded',
  accept: 'application/json',
};

const enum LectureType {
  LIBERAL_ARTS = 'liberal-arts',
  MAJORS = 'majors',
}

interface PayloadBody {
  yy: number;
  semCd: 1 | 2;
  qrySxn: 1 | 2;
  lesnPlcCd: 1 | 2;
}

function getPayloadKey({ yy, semCd, qrySxn, lesnPlcCd }: PayloadBody) {
  const campus = lesnPlcCd === 1 ? 'Jukjeon' : 'Cheonan';
  const lectureTypes = [
    undefined,
    LectureType.MAJORS,
    LectureType.LIBERAL_ARTS,
  ];
  return `${String(yy).substr(-2)}-${semCd}-${
    lectureTypes[qrySxn]
  }-${campus}.json`;
}

function parsePayloadToMap(
  payloads: PayloadBody[],
): Record<string, PayloadBody> {
  return payloads.reduce((obj, payload) => {
    obj[getPayloadKey(payload)] = payload;
    return obj;
  }, {});
}

const payloadMap = parsePayloadToMap([
  {
    yy: 2021,
    semCd: 2,
    qrySxn: 1,
    lesnPlcCd: 1,
  },
  {
    yy: 2021,
    semCd: 2,
    qrySxn: 1,
    lesnPlcCd: 2,
  },
  {
    yy: 2021,
    semCd: 2,
    qrySxn: 2,
    lesnPlcCd: 1,
  },
  {
    yy: 2021,
    semCd: 2,
    qrySxn: 2,
    lesnPlcCd: 2,
  },
  {
    yy: 2022,
    semCd: 1,
    qrySxn: 1,
    lesnPlcCd: 1,
  },
  {
    yy: 2022,
    semCd: 1,
    qrySxn: 1,
    lesnPlcCd: 2,
  },
]);

@Injectable()
export class AppService {
  private readonly scheduleClient: AxiosInstance;

  constructor() {
    const scheduleClient = axios.create({
      baseURL: 'https://webinfo.dankook.ac.kr',
    });
    scheduleClient.interceptors.response.use(({ data }) => data);

    this.scheduleClient = scheduleClient;
  }

  public async saveSchedule() {
    const dataPath = path.join(process.env.INIT_CWD, '../../data');

    for (const [filename, payload] of Object.entries(payloadMap)) {
      const lectures: Lecture[] = await this.fetchSchedule(payload);
      fs.writeFileSync(
        `${dataPath}/${filename}`,
        JSON.stringify(lectures),
        'utf-8',
      );
    }
  }

  public async fetchSchedule(payload: PayloadBody): Promise<Lecture[]> {
    const { scheduleClient } = this;
    const url = '/tiac/univ/lssn/lpci/views/lssnPopup/tmtbl.do';
    const data = Object.entries(payload)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    const config = { headers };

    const response: ScheduleResponse = await scheduleClient.post(
      url,
      data,
      config,
    );
    return response.lctTmtblDscMjList;
  }
}
