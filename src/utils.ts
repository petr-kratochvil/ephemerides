function degMinSec(position: number) {
  const deg = Math.floor(position % 30);
  const remainderMin = (position % 30) - deg;
  const min = Math.floor(remainderMin * 60);
  const remainderSec = remainderMin * 60 - min;
  const sec = Math.floor(remainderSec * 60);
  return { deg, min, sec };
}

export function expandPosition(position: number) {
  const dms = degMinSec(position);
  return {
    sign: Math.floor(position / 30) + 1,
    degrees: dms.deg,
    minutes: dms.min,
    seconds: dms.sec,
  }
}