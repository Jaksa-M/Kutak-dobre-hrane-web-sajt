export class Rezervacija{
  restoran: string
  request: string
  time: string
  date: string
  people: number
  grade: number
  comment: string = ""
  tableNum: number
  reservationTime: number
  state: string
  rejectedComment: string = ""
  user: string
  konobar: string
}

/*
  state has 4 possible values:
  1) neobradjena
  2) odbijena - when konobar rejected reservation
  3) potvrdjena - when konobar confirmed reservation
  4) nije se pojavio - when konobar selected that user showed up
  5) pojavio se - when konobar selected that user didn't show
*/
