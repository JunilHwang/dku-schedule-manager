export type RemoteType = "원격수업" | "대면수업";

export interface Lecture {
  buldAndRoomCont: string; // "목7~12"
  wkLecrEmpnm: string; // "스튜어트존스"
  subjMethod: string; // "외국인유학생전용"
  cybCoronaTyNm: RemoteType; // "원격수업"
  cybCoronaTyNm2: RemoteType; // "원격수업"
  cybCoronaTyNm3: RemoteType; // "원격수업"
  cybCoronaTyNm4: RemoteType; // "원격수업"
  dvclsNb: number; // 1
  opOrgid: string; // "2000000989"
  dsgnCrd: 0; // 0
  oglngLctLanggCdnm: string; // "영어A"
  yy: string; // "2021"
  cybLtrTyNm: string; // "(원어)"
  curiCparNm: string; // "공통교양"
  kor: number; // 11
  crd: string; // "3(0)"
  tmtblChgSxnCd: null; // null
  tmtblChgSxnNm: null; // null
  grade: number; // 1
  eng: number; // 10
  tkcrsEcaOrgnm: string; // "SW융합대학<p>SW융합학부<p>글로벌SW융합전공"
  pfltId: string; // "12090278"
  status: number; // 1
  subjKnm: string; // "College Writing"
  tkcrsEcaOrgid: string; // "2000004917"
  subjId: string; // "528380"
  semCd: string; // "2"
  oglngLctLanggCd: string; // "0011"
  checked: string; // "0"
}

export interface Schedule {
  lecture: Lecture;
  dayIndex: number;
  range: number[];
  room?: string;
}
