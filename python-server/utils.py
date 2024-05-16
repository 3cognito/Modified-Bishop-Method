
import pandas as pd
import os
import math
from enum import Enum, auto

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



async def convert_to_json(path: str):
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
    df = pd.read_excel(path, sheet_name=0)

    json_data = df.to_dict(orient='records')
    
    return json_data



def degrees_to_radians(degrees: float) -> float:
    return degrees * (math.pi / 180)

class TrigFunction(Enum):
    SINE = auto()
    COSINE = auto()
    TANGENT = auto()

# Function to calculate trigonometric functions in degrees
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

