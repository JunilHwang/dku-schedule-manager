import { Lecture } from "./ScheduleTypes";

export const enum LectureType {
  MAJOR = "majors",
  LIBERAL_ARTS = "liberal-arts",
}

export const enum CampusType {
  JUKJEON = "Jukjeon",
  CHEONAN = "Cheonan",
}

export interface SchedulePayload {
  year: number;
  semester: number;
  lectureType: LectureType;
  campusType: CampusType;
}

function getDataPath(payload: SchedulePayload): string {
  const filename = [
    String(payload.year).substr(-2),
    payload.semester,
    payload.lectureType,
    payload.campusType,
  ].join("-");
  return `/data/${filename}.json`;
}

const cache: Record<string, Lecture[]> = {};

export async function getSchedules(
  payload: SchedulePayload
): Promise<Lecture[]> {
  const path = getDataPath(payload);
  if (!cache[path]) {
    const result = await import(getDataPath(payload));
    cache[path] = result.default as Lecture[];
  }
  return cache[path];
}

export async function getAllSchedules(
  year = 2022,
  semester = 1,
): Promise<Lecture[]> {
  const results = await Promise.all([
    getSchedules({ year, semester, lectureType: LectureType.MAJOR, campusType: CampusType.JUKJEON }),
    getSchedules({ year, semester, lectureType: LectureType.MAJOR, campusType: CampusType.CHEONAN }),
    getSchedules({ year, semester, lectureType: LectureType.LIBERAL_ARTS, campusType: CampusType.JUKJEON }),
    getSchedules({ year, semester, lectureType: LectureType.LIBERAL_ARTS, campusType: CampusType.CHEONAN }),
  ]);
  return results.flatMap(v => v);
}

export function loadSchedules () {
  getAllSchedules();
  getAllSchedules(2021, 2);
}