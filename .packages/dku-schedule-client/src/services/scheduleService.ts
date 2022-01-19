export const enum LectureType {
  MAJOR = "majors",
  LIBERAL_ARTS = "liberal-arts",
}

export const enum CampusType {
  JUKJEON = 'Jukjeon',
  CHEONAN = 'Cheonan',
}

export interface PayloadBody {
  year: number;
  semester: number;
  lectureType: LectureType;
  campusType: CampusType;
}

function getFileName({ year, semester, lectureType, campusType }: PayloadBody) {
  return `/data/${String(year).substr(-2)}-${semester}-${lectureType}-${campusType}.json`;
}

export function getSchedules() {

  import(getFileName({
    year: 21,
    semester: 2,
    lectureType: LectureType.LIBERAL_ARTS,
    campusType: CampusType.JUKJEON
  })).then(console.log)

}
