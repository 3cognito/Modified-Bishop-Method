import { TrigFunction, trigInDegrees } from "./utilities/trigonometry";
import { Slice } from "./slice";
import { calculateAverage } from "./utilities/average";

//Recursive approach to checking convergence
export function checkConvergence(
  slices: Slice[],
  initialGuessFOS: number,
  tolerance: number,
  maxIterations: number, // Maximum number of iterations allowed
  cohesion?: number,
  porePressureCoefficient?: number,
  currentIteration: number = 0 // Default current iteration to 0
): number {
  // If the maximum number of iterations is reached without convergence, return the current FoS.

  if (currentIteration >= maxIterations) return initialGuessFOS;

  const individualFactorsOfSafety = slices.map((slice) => {
    return calculateNextFactorOfSafetyPerSlice(slice, initialGuessFOS);
  });

  const { topSum, bottomSum } = calculateAverage(individualFactorsOfSafety);

  const nextFOS = topSum / bottomSum;

  // Convergence criteria met, return the converged FoS
  if (Math.abs(nextFOS - initialGuessFOS) < tolerance) return nextFOS;

  // Recursive call with updated parameters till one of the above conditions is met
  return checkConvergence(
    slices,
    nextFOS,
    tolerance,
    maxIterations,
    cohesion,
    porePressureCoefficient,
    currentIteration + 1
  );
}

export function calculateNextFactorOfSafetyPerSlice(slice: Slice, currentFactorOfSafety: number) {
  const cosOfInclination = parseFloat(
    trigInDegrees(slice.inclination, TrigFunction.Cosine).toFixed(2)
  );
  const tanOfInclination = parseFloat(
    trigInDegrees(slice.inclination, TrigFunction.Tangent).toFixed(2)
  );
  const tanOfInternalFrictionAngle = parseFloat(
    trigInDegrees(slice.internalFrictionAngle, TrigFunction.Tangent).toFixed(2)
  );
  let M =
    cosOfInclination *
    (1 + (tanOfInclination * tanOfInternalFrictionAngle) / currentFactorOfSafety);

  M = parseFloat(M.toFixed(2));

  let oneOverM = 1 / M;
  oneOverM = parseFloat(oneOverM.toFixed(3));

  const weightMinusPorePressureCoefficientTimesWidth =
    slice.weight - slice.porePressureCoefficient! * slice.width;

  const cohesionTimesWidth = slice.cohesion! * slice.width;

  const weightTimesSineOfInclination =
    slice.weight * trigInDegrees(slice.inclination, TrigFunction.Sine);
  let top =
    (cohesionTimesWidth +
      weightMinusPorePressureCoefficientTimesWidth * tanOfInternalFrictionAngle) *
    oneOverM;

  let bottom = weightTimesSineOfInclination;

  return { top, bottom };
}

// const slice1 = new Slice("1", 4.5, 0.9, 32, -1.7191, 0, 0.0889);
// const slice2 = new Slice("2", 3.2, 1.7, 32, 2.866, 0, 0.0906);
// const slice2a = new Slice("2a", 1.8, 1.3, 32, 8.0478, 0.0278, 0.0889);
// const slice3 = new Slice("3", 5, 4.6, 32, 14.4775, 0.21, 0.09);
// const slice4 = new Slice("4", 5, 5.6, 32, 24.8346, 0.29, 0.09);
// const slice5 = new Slice("5", 5, 5.8, 32, 35.4505, 0.25, 0.09);
// const slice6 = new Slice("6", 4.4, 4.6, 32, 47.7314, 0.1136, 0.0909);
// const slice6a = new Slice("6a", 0.6, 0.5, 32, 55.0848, 0, 0.0833);
// const slice7 = new Slice("7", 3.2, 1.5, 32, 60.4586, 0, 0.0906);

//Parameters of the formula

// 1. Name of slice - Not necessary for computation
// 2. Width of slice
// 3. Effective cohesion along the potential failure or slip surface - Can be the effective value or individual values for each slice
// 4. Pore water pressure coefficient, can be local to each slice or global through the failure plane
// 5. Internal angle of friction of the slice
// 6. Weight of the slice
// 7. Inclination of the slice to the horizontal

// const slices = [slice1, slice2, slice2a, slice3, slice4, slice5, slice6, slice6a, slice7];

// const result = checkConvergence(slices, 90, 0.00001, 5000);

// console.log(result);
