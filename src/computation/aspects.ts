import { aspectsConfig } from "../config";
import { Aspect, AspectWithPositions, Position } from "../types";

function positionDifference(pos1: number, pos2: number) {
  const min = Math.min(pos1, pos2);
  const max = Math.max(pos1, pos2);
  const diff1 = max - min;
  const diff2 = min + 360 - max;
  return Math.min(diff1, diff2);
}

export function aspect(
  pos1: Position,
  pos2: Position,
  useMaxOrb = false
): Aspect | null {
  const diff = positionDifference(pos1.position, pos2.position);
  for (const aspectDefinition of aspectsConfig.aspects) {
    const orb = Math.abs(diff - aspectDefinition.diff);
    if (
      orb < (useMaxOrb ? aspectDefinition.maxOrb : aspectDefinition.mediumOrb)
    ) {
      return {
        name: aspectDefinition.name,
        orb,
      };
    }
  }
  return null;
}

export function aspects(
  chart1: Position[],
  chart2: Position[]
): AspectWithPositions[] {
  const result: AspectWithPositions[] = [];
  for (const pos1 of chart1) {
    for (const pos2 of chart2) {
      const posAspect = aspect(pos1, pos2);
      if (posAspect !== null) {
        result.push({ ...posAspect, pos1, pos2 });
      }
    }
  }
  return result;
}
