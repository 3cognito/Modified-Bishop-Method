from typing import List, Optional, Tuple
from utils import calculate_average, trig_in_degrees, TrigFunction


class Slice:
    def __init__(self, name, width, weight, internal_friction_angle, inclination, pore_pressure_coefficient=None, cohesion=None):
        self.name = name
        self.width = width
        self.weight = weight
        self.internal_friction_angle = internal_friction_angle
        self.inclination = inclination
        self.pore_pressure_coefficient = pore_pressure_coefficient
        self.cohesion = cohesion

    def __repr__(self):
        return (f"Slice(name={self.name}, width={self.width}, weight={self.weight}, "
                f"internal_friction_angle={self.internal_friction_angle}, inclination={self.inclination}, "
                f"pore_pressure_coefficient={self.pore_pressure_coefficient}, cohesion={self.cohesion})")



def check_convergence(
    slices: List['Slice'],
    initial_guess_fos: float,
    tolerance: float,
    max_iterations: int,
    cohesion: Optional[float] = None,
    pore_pressure_coefficient: Optional[float] = None,
    current_iteration: int = 0
) -> float:
    if current_iteration >= max_iterations:
        return initial_guess_fos

    individual_factors_of_safety = [
        calculate_next_factor_of_safety_per_slice(slice, initial_guess_fos)
        for slice in slices
    ]

    average = calculate_average(individual_factors_of_safety)
    
    next_fos = average['topSum'] / average['bottomSum']

    if abs(next_fos - initial_guess_fos) < tolerance:
        return next_fos

    return check_convergence(
        slices, next_fos, tolerance, max_iterations, cohesion, pore_pressure_coefficient, current_iteration + 1
    )

def calculate_next_factor_of_safety_per_slice(slice: 'Slice', current_factor_of_safety: float) -> Tuple[float, float]:
    cos_of_inclination = round(trig_in_degrees(slice.inclination, TrigFunction.COSINE), 2)
    tan_of_inclination = round(trig_in_degrees(slice.inclination, TrigFunction.TANGENT), 2)
    tan_of_internal_friction_angle = round(trig_in_degrees(slice.internal_friction_angle, TrigFunction.TANGENT), 2)

    M = cos_of_inclination * (1 + (tan_of_inclination * tan_of_internal_friction_angle) / current_factor_of_safety)
    M = round(M, 2)
    one_over_M = round(1 / M, 3)

    weight_minus_pore_pressure_coefficient_times_width = slice.weight - (slice.pore_pressure_coefficient or 0) * slice.width
    cohesion_times_width = (slice.cohesion or 0) * slice.width
    weight_times_sine_of_inclination = slice.weight * trig_in_degrees(slice.inclination, TrigFunction.SINE)

    top = (cohesion_times_width + weight_minus_pore_pressure_coefficient_times_width * tan_of_internal_friction_angle) * one_over_M
    bottom = weight_times_sine_of_inclination

    return top, bottom

# Example 
# slices = [
#     Slice("1", 4.5, 0.9, 32, -1.7191, 0, 0.0889),
#     Slice("2", 3.2, 1.7, 32, 2.866, 0, 0.0906),
#     Slice("2a", 1.8, 1.3, 32, 8.0478, 0.0278, 0.0889),
#     Slice("3", 5, 4.6, 32, 14.4775, 0.21, 0.09),
#     Slice("4", 5, 5.6, 32, 24.8346, 0.29, 0.09),
#     Slice("5", 5, 5.8, 32, 35.4505, 0.25, 0.09),
#     Slice("6", 4.4, 4.6, 32, 47.7314, 0.1136, 0.0909),
#     Slice("6a", 0.6, 0.5, 32, 55.0848, 0, 0.0833),
#     Slice("7", 3.2, 1.5, 32, 60.4586, 0, 0.0906)
# ]

# result = check_convergence(slices, 90, 0.00001, 5000)
# print(result)
