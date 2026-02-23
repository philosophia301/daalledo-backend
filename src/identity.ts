import { UserIdentity } from "./types";

const AVATARS = [
  "🐦", "🦭", "🐙", "🦀", "🐟", "🐚", "🌊", "⛵",
  "🏄", "🎣", "🦐", "🐳", "🦑", "🐠", "🦈", "🐬",
  "🥩", "🍜", "🍲", "🍱", "🍣", "🍢", "🌶️", "🧊",
];

const NAMES = [
  "갈매기", "바다사자", "해운대꿀벌", "광안리파도",
  "국밥킬러", "어묵달인", "씨앗호떡", "밀면장인",
  "돼지국밥", "자갈치고수", "태종대바람", "감천별빛",
  "송정서퍼", "기장멸치", "영도다리", "남포동쥔장",
  "센텀러너", "동백섬산책", "온천천오리", "부평시장",
  "초량밀면", "해리단길", "다대포석양", "이기대탐험",
];

const BADGES: UserIdentity["badge"][] = [
  { label: "📍 로컬", variant: "local" },
  { label: "🎒 방문 예정", variant: "visitor" },
  { label: "📍 토박이", variant: "local" },
  { label: "🎒 여행중", variant: "visitor" },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateIdentity(): UserIdentity {
  return {
    avatar: pick(AVATARS),
    name: pick(NAMES),
    badge: pick(BADGES),
  };
}
