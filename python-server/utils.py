
import pandas as pd
import os
import math
from enum import Enum, auto
from typing import Any, Hashable, List


def convert_to_slice(data: List[dict[Hashable, Any]]):
    """
    Convert a list of dictionaries to a list of Slice objects.

    :param data: List of dictionaries where each dictionary contains the attributes of a Slice.
    :return: List of Slice objects.
    """

    from sbishop import Slice
    
    slices = [
    Slice(
        name=d['name'],
        width=d['width'],
        weight=d['weight'],
        internal_friction_angle=d['internalFrictionAngle'],
        inclination=d['inclination'],
        pore_pressure_coefficient=d.get('porePressureCoefficient', None),
        cohesion=d.get('cohesion', None)
    )
    for d in data
            ]

    return slices

def calculate_average(numbers):
    """
    Calculate the sums of 'top' and 'bottom' values in a list of tuples
    and return these sums along with the length of the list.

    :param numbers: List of tuples where each tuple contains 'top' and 'bottom' values.
    :return: Dictionary with sums of 'top' and 'bottom' values and the length of the list.
    """

    # Initialize sums
    top_sum = 0
    bottom_sum = 0

    # Iterate over each tuple in the list
    for top, bottom in numbers:
        top_sum += top
        bottom_sum += bottom

    length = len(numbers)

    return {
        'topSum': top_sum,
        'bottomSum': bottom_sum,
        'length': length
    }



async def convert_to_json(path: str) -> List[dict[Hashable, Any]]:
    """
    Convert an Excel file to JSON format and delete the original file.

    :param path: The path to the Excel file.
    :return: The data from the Excel file in JSON format.
    """
    data =  parse_excel(path)
    
    os.remove(path)
    return data


def parse_excel(path: str):
    """
    Parse the first sheet of an Excel file and convert it to JSON format.

    :param path: The path to the Excel file.
    :return: The data from the Excel sheet in JSON format.
    """
    if not os.path.exists(path):        
        raise FileNotFoundError(f"File not found: {path}")

    df = pd.read_excel(path, sheet_name=0)

    json_data = df.to_dict(orient='records')
    
    return json_data



def degrees_to_radians(degrees: float) -> float:
    return degrees * (math.pi / 180)

class TrigFunction(Enum):
    SINE = auto()
    COSINE = auto()
    TANGENT = auto()



def trig_in_degrees(degrees: float, trig_function: TrigFunction) -> float:
    radians = degrees_to_radians(degrees)
    
    if trig_function == TrigFunction.SINE:
        return math.sin(radians)
    elif trig_function == TrigFunction.COSINE:
        return math.cos(radians)
    elif trig_function == TrigFunction.TANGENT:
        return math.tan(radians)
    else:
        raise ValueError("Invalid trigonometric function specified")

