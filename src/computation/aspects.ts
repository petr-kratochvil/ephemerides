import { aspectsConfig } from "../config";
import { Aspect, AspectWithPositions, Position } from "../types";

// Position difference is always in interval [0,180]
function positionDifference(pos1: number, pos2: number) {
  const min = Math.min(pos1, pos2);
  const max = Math.max(pos1, pos2);
  const diff1 = max - min;
  const diff2 = min + 360 - max;
  return Math.min(diff1, diff2);
}

// Add a difference to given position on the circle
function positionAdd(pos1: number, diff: number) {
  let result = pos1 + diff;
  if (result >= 360) {
    result -= 360;
  } else if (result < 0) {
    result += 360;
  }
  return result;
}

// Calculate exact position for pos1 to be in given aspect to pos2
// From two possible positions, return the nearest possible position
function aspectPosition(
  pos1: number,
  pos2: number,
  aspectDiff: number,
  // pos1Speed: number // speed is not used - the nearest position is selected
) {
  let option1 = positionAdd(pos2, aspectDiff);
  let option2 = positionAdd(pos2, -aspectDiff);
  // Math.abs can return -0
  let distance1 = positionDifference(pos1, option1);
  let distance2 = positionDifference(pos1, option2);
  if (distance1 < distance2) {
    return option1;
  } else {
    return option2;
  }
}

// Positive orbSpeed means aspect orb is increasing, aspect is getting weaker
// Negative orbSpeed means aspect is getting stronger
function orbSpeed(
  pos1: number,
  pos2: number,
  aspectDiff: number,
  pos1Speed: number,
) {
  let diff = aspectPosition(pos1, pos2, aspectDiff) - pos1;
  if (diff < 0) diff += 360;
  if (diff <= 0 || diff > 180) {
    return pos1Speed;
  } else {
    return -pos1Speed;
  }
}

export function aspect<T extends Position>(
  pos1: T,
  pos2: T,
  useMaxOrb = false,
  aspectDefinitions: typeof aspectsConfig.aspects = aspectsConfig.aspects,
): Aspect | null {
  const diff = positionDifference(pos1.position, pos2.position);
  for (const aspectDefinition of aspectDefinitions) {
    const orb = Math.abs(diff - aspectDefinition.diff);
    if (
      orb < (useMaxOrb ? aspectDefinition.maxOrb : aspectDefinition.mediumOrb)
    ) {
      const result: Aspect = {
        name: aspectDefinition.name,
        orb,
      };
      if ("speed" in pos1 && typeof pos1.speed === "number") {
        result.orbSpeed = orbSpeed(
          pos1.position,
          pos2.position,
          aspectDefinition.diff,
          pos1.speed,
        );
      }
      return result;
    }
  }
  return null;
}

export function aspects<T extends Position>(
  chart1: T[],
  chart2: T[],
  aspectDefinitions: typeof aspectsConfig.aspects = aspectsConfig.aspects,
): AspectWithPositions<T>[] {
  const result: AspectWithPositions<T>[] = [];
  for (const pos1 of chart1) {
    for (const pos2 of chart2) {
      const posAspect = aspect(pos1, pos2, false, aspectDefinitions);
      if (posAspect !== null) {
        result.push({ ...posAspect, pos1, pos2 });
      }
    }
  }
  return result;
}
