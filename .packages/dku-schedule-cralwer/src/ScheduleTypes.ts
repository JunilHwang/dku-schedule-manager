export interface ScheduleBase {
  totalCount: number; // 0
  checked: boolean; // false
  status: number; // 1
  inputUid?: string; // null
  inputUnm?: string; // null
  inputDm?: string; // null
  ltstUpdUid: string; // "12000288"
  ltstUpdUnm?: string; // null
  ltstUpdDm?: string; // null
  resultMessage?: string; // null
  resultCode: number; // 0
  affectedRows: number; // 0
  cmnCdId: string; // "DOW_CD"
  cmnCdval: string; // "0001"
  cmnCdvalNm: string; // "일요일"
  cmnCdvalEnm: string; // "Sunday"
  cmnCdvalAnm: string; // "일"
  cmnCdvalEanm: string; // "Sun"
  uprCmnCdId?: string; // null
  uprCmnCdval?: string; // null
  userInfoValu1?: string; // null
  userInfoValu2?: string; // null
  userInfoValu3?: string; // null
  userInfoValu4?: string; // null
  userInfoValu5?: string; // null
  addtInfoValu1?: string; // null
  addtInfoValu2?: string; // null
  addtInfoValu3?: string; // null
  addtInfoValu4?: string; // null
  addtInfoValu5?: string; // null
  useYn: boolean; // true
  sortOer: number; // 1
  updateYn?: string; // null
  befCmnCdval1: string; // "1"
  befCmnCdval2?: string; // null
  allYn?: string; // null
  origRemoteAddr: string; // "122.42.159.31"
}

export interface LectureCategory {
  totalCount: number; // 0,
  checked: false; // false,
  status: number; // 1,
  inputUid: unknown; // null,
  inputUnm: unknown; // null,
  inputDm: unknown; // null,
  ltstUpdUid: unknown; // null,
  ltstUpdUnm: unknown; // null,
  ltstUpdDm: unknown; // null,
  resultMessage: unknown; // null,
  resultCode: number; // 0,
  affectedRows: number; // 0,
  cmnCdId: unknown; // null,
  cmnCdval: string; // "14190",
  cmnCdvalNm: string; // "공통교양",
  cmnCdvalEnm: unknown; // null,
  cmnCdvalAnm: unknown; // null,
  cmnCdvalEanm: unknown; // null,
  uprCmnCdId: unknown; // null,
  uprCmnCdval: unknown; // null,
  userInfoValu1: unknown; // null,
  userInfoValu2: unknown; // null,
  userInfoValu3: unknown; // null,
  userInfoValu4: unknown; // null,
  userInfoValu5: unknown; // null,
  addtInfoValu1: unknown; // null,
  addtInfoValu2: unknown; // null,
  addtInfoValu3: unknown; // null,
  addtInfoValu4: unknown; // null,
  addtInfoValu5: unknown; // null,
  useYn: boolean; // false,
  sortOer: number; // 100,
  updateYn: unknown; // null,
  befCmnCdval1: unknown; // null,
  befCmnCdval2: unknown; // null,
  allYn: unknown; // null,
  origRemoteAddr: string; // "122.42.159.31"
}

export type RemoteType = '원격수업' | '대면수업';

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

export interface ScheduleResponse {
  dowCdCparCdList: ScheduleBase[];
  semCdList: ScheduleBase[];
  grade?: unknown;
  lctTmtblDscMjList: Lecture[];
  lpciSearch: any;
  qrySxn: string; // 학기 정보인듯
  curiCparList: LectureCategory[]; // 과목 영역 정보
}
