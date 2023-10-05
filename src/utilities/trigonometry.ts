// Function to convert degrees to radians
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Function to calculate trigonometric functions in degrees
export function trigInDegrees(degrees: number, trigFunction: TrigFunction): number {
  const radians = degreesToRadians(degrees);

  switch (trigFunction) {
    case TrigFunction.Sine:
      return Math.sin(radians);
    case TrigFunction.Cosine:
      return Math.cos(radians);
    case TrigFunction.Tangent:
      return Math.tan(radians);
    default:
      throw new Error("Invalid trigonometric function specified");
  }
}

//Typescript enum to specify trigonometric function
export enum TrigFunction {
  Sine = "sin",
  Cosine = "cos",
  Tangent = "tan",
}
