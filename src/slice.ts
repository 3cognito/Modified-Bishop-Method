//This class represents a slice of the slope and its attendant properties

export class Slice {
  name: string;
  width: number;
  cohesion?: number;
  internalFrictionAngle: number;
  inclination: number;
  porePressureCoefficient?: number;
  weight: number;
  constructor(
    name: string,
    width: number,
    weight: number,
    internalFrictionAngle: number,
    inclination: number,
    porePressureCoefficient?: number,
    cohesion?: number
  ) {
    this.name = name;
    this.width = width;
    this.cohesion = cohesion;
    this.internalFrictionAngle = internalFrictionAngle;
    this.inclination = inclination;
    this.weight = weight;
    this.porePressureCoefficient = porePressureCoefficient;
  }
}
