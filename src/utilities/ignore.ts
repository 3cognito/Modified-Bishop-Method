//Regular iterative approach using a while loop
// export function checkConvergence(
//   slices: Slice[],
//   initialGuessFOS: number,
//   tolerance: number,
//   maxIterations: number, // Maximum number of iterations allowed
//   cohesion?: number,
//   porePressureCoefficient?: number
// ): number {
//   let currentFOS = initialGuessFOS;
//   let iteration = 0;

//   while (iteration < maxIterations) {
//     const individualFactorsOfSafety = slices.map((slice) => {
//       return calculateNextFactorOfSafetyPerSlice(slice, currentFOS);
//     });
//     const nextFOS = calculateAverage(individualFactorsOfSafety);

//     if (Math.abs(nextFOS - currentFOS) < tolerance) {
//       // Convergence criteria met, return the converged FoS
//       return nextFOS;
//     }

//     // Update current FoS for the next iteration
//     currentFOS = nextFOS;
//     iteration++;
//   }

//   // If the maximum number of iterations is reached without convergence, return the current FoS.
//   return currentFOS;
// }
