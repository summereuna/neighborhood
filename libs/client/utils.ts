/** 클래스네임 가져와서 합쳐주는 함수
 * [1, 2, 3].join("") => "123"
 * [1, 2, 3].join("/") => "1/2/3"
 */
export function cls(...classname: string[]) {
  return classname.join(" ");
}

/** UTC 시간 한국 시간으로 표시하는 함수
//  */
// export function utcToKoreanTime(utcDateAndTimeString: Date | undefined) {
//   const utcDate = new Date(`${utcDateAndTimeString}`);
//   return utcDate.toLocaleString("kst").slice(0, -3);
// }

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import { chatMessage } from "@/pages/chats/[id]";

export function getTimeInterval(dataCreatedTime: Date | string) {
  return dayjs(dataCreatedTime).fromNow();

  // const currentTime = dayjs(new Date());
  // const createdTime = dayjs(dataCreatedTime);
  // const year = currentTime.diff(createdTime, "year");
  // const month = currentTime.diff(createdTime, "month");
  // const date = currentTime.diff(createdTime, "day");
  // const hour = currentTime.diff(createdTime, "hour");
  // const minute = currentTime.diff(createdTime, "minute");
  // const second = currentTime.diff(createdTime, "second");

  // if (year > 0) {
  //   return `${year}년 전`;
  // } else if (month > 0) {
  //   return `${month}개월 전`;
  // } else if (date > 0) {
  //   return `${date}일 전`;
  // } else if (hour > 0) {
  //   return `${hour}시간 전`;
  // } else if (minute > 0) {
  //   return `${minute}분 전`;
  // } else if (second > 0) {
  //   return `${second}초 전`;
  // }
}

export function getMessageTime(dataCreatedTime: Date | string) {
  return dayjs(dataCreatedTime).format("LT");
  // const createdTime = dayjs(dataCreatedTime);

  // const hour: number = createdTime.hour();
  // const minute: number = createdTime.minute();

  // //이 방법 말고 dayjs 내부적으로 뭐 없나... 역시 있었구요 ^^!하핫
  // const getMinute = () => {
  //   if (minute < 10) {
  //     return `0${minute}`;
  //   } else {
  //     return minute;
  //   }
  // };

  // if (hour > 12) {
  //   return `오후 ${hour - 12}:${getMinute()}`;
  // } else if (hour === 0) {
  //   return `오전 12:${getMinute()}`;
  // } else {
  //   return `오전 ${hour}:${getMinute()}`;
  // }
}

export function getReservationTime(dataCreatedTime: Date | string) {
  return dayjs(dataCreatedTime).format("LLLL");

  // const createdTime = dayjs(dataCreatedTime);
  // const month: number = createdTime.month() + 1;
  // const date: number = createdTime.date();
  // const day: string = createdTime.format("dd");
  // const hour: number = createdTime.hour();
  // const minute: number = createdTime.minute();
  // const getMinute = () => {
  //   if (minute < 10) {
  //     return `0${minute}`;
  //   } else {
  //     return minute;
  //   }
  // };

  // if (hour > 12) {
  //   return `${month}월 ${date}일 (${day}) 오후 ${hour - 12}:${getMinute()}`;
  // } else if (hour === 0) {
  //   return `${month}월 ${date}일 (${day}) 오전 12:${getMinute()}`;
  // } else {
  //   return `${month}월 ${date}일 (${day}) 오전 ${hour}:${getMinute()}`;
  // }
}

interface divideDateSection {
  [key: string]: chatMessage[];
}

export function divideDate(chatList: chatMessage[]) {
  const sections: divideDateSection = {};

  chatList.forEach((chat) => {
    // const chatCreateDate = dayjs(chat.created);
    // const year: number = chatCreateDate.year();
    // const month: number = chatCreateDate.month() + 1;
    // const date: number = chatCreateDate.date();
    // const formattedChatCreateDate = `${year}년 ${month}월 ${date}일`;
    const formattedChatCreateDate = dayjs(chat.created).format("LL");

    if (sections[formattedChatCreateDate]) {
      sections[formattedChatCreateDate].push(chat);
    } else {
      sections[formattedChatCreateDate] = [chat];
    }
  });
  return sections;
}

export function changeStringToArrayReviewBoxes(reviews: string): string[] {
  const reviewReg = reviews!.match(/"([^"]*)"/g);
  const reviewMatch = reviewReg!.map((match) => match.slice(1, -1));
  return reviewMatch;
}

export const getMannerDegree = (
  initialDegree: number,
  reviewsScore: number[]
) => {
  for (let i = 0; i < reviewsScore.length; i++) {
    switch (reviewsScore[i]) {
      case 1:
        initialDegree += -0.5;
        break;
      case 2:
        initialDegree += -0.25;
        break;
      case 3:
        initialDegree += 0.25;
        break;
      case 4:
        initialDegree += 0.5;
        break;
      case 5:
        initialDegree += 0.75;
        break;
      default:
        break;
    }
  }
  return initialDegree;
};
