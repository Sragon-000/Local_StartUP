// Replace these slots with the user's supplied artwork. Keep media local and
// register its exact URL in src/pages.mjs (images) or src/media.mjs (video).
// poster: image URL; video: optional MP4 URL. With neither, show an honest placeholder.
export const artworks = [{
  id: 'blue-resonance',
  title: '푸른 잔향',
  subtitle: 'BLUE RESONANCE — 어둠 위에 남겨진 빛의 물결',
  medium: 'MOVING IMAGE',
  description: '고요한 어둠 위로 푸른 빛의 선들이 물결을 이룹니다. 얇게 포개진 선은 파도의 능선을 따라 솟아오르고, 흩어진 빛의 입자는 다시 흐름 속으로 스며듭니다.\n\n〈푸른 잔향〉은 잠시 나타났다가 사라지는 파도의 형상을 따라, 움직임이 지나간 자리에 남는 감각을 들여다봅니다. 끊임없이 달라지는 푸른 표면을 바라보며 자신만의 속도로 장면에 머물러 보세요.',
  credit: '',
  duration: '4초',
  dimensions: '1280 × 720',
  presentation: '반복 재생',
  aspectRatio: '16 / 9',
  poster: '/Local_StartUP/assets/media/blue-resonance.jpg',
  video: '/Local_StartUP/assets/media/blue-resonance.mp4',
}, ...Array.from({ length: 5 }, (_, index) => ({
  id: `art-${index + 2}`,
  title: `작품 ${String(index + 2).padStart(2, '0')}`,
  subtitle: '아직 펼쳐지지 않은 장면',
  medium: 'MEDIA ART',
  description: '새로운 감각으로 채워질 자리. 곧 이곳에서 미디어아트 작품을 만나보세요.',
  credit: '',
  poster: null,
  video: null,
}))];
