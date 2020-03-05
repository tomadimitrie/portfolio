import SimplexNoise from "simplex-noise";
import Poisson from "poisson-disk-sampling";
import { mapRange } from "canvas-sketch-util/math";

const simplex = new SimplexNoise();
export function noise(...args) {
  switch (args.length) {
    case 1:
      return simplex.noise2D(0, args[0]);
    case 2:
      return simplex.noise2D(args[0], args[1]);
    case 3:
      return simplex.noise3D(args[0], args[1], args[2]);
    case 4:
      return simplex.noise4D(args[0], args[1], args[2], args[3]);
    default:
      return null;
  }
}

export function poisson(range, minRadius, maxRarius) {
  const scale = n => n * 100;
  const scaleInvert = n => n / 100;
  const rangeScaled = range.map(scale);
  return new Poisson(rangeScaled, minRadius, maxRarius, 10)
    .fill()
    .map(p => p.map(scaleInvert));
}

export function mapRangeTriple(
  value,
  inputMin,
  inputMiddle,
  inputMax,
  outputMin,
  outputMiddle,
  outputMax,
  clamp = false
) {
  if (inputMin <= value && value < inputMiddle) {
    return mapRange(
      value,
      inputMin,
      inputMiddle,
      outputMin,
      outputMiddle,
      clamp
    );
  } else {
    return mapRange(
      value,
      inputMiddle,
      inputMax,
      outputMiddle,
      outputMax,
      clamp
    );
  }
}

export function timed(fn, label) {
  return (...args) => {
    console.time(`⏱${label}`);
    const ret = fn(...args);
    console.timeEnd(`⏱${label}`);
    return ret;
  };
}

function impulse(x, strength) {
  const h = strength * x;
  return h * Math.exp(1.0 - h);
}

export function impulseMultiple(x, strength, interval) {
  return impulse(x % interval, strength);
}

export function dampedSin(x, attenuation, frequency, offset) {
  return (
    Math.exp(-x * attenuation) * Math.cos(2 * Math.PI * x * frequency + offset)
  );
}
