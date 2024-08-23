import argparse
import json
from IS_302_1 import Clause
from Chemistry import FirstYChemistry  # Import the new Chemistry class

def main():
    parser = argparse.ArgumentParser(description='Process some arguments.')
    parser.add_argument('--foo', nargs='+', help='List of measurement values')
    parser.add_argument('--title', help='Title of the measurement')
    args = parser.parse_args()

    argument = args.foo
    title = args.title

    result = {}

    try:
        if title == "IS_4250_C_10_Input":
            if len(argument) < 6:  # Ensure there are at least 6 values
                raise IndexError("Not enough arguments provided")
                
            numeric_values = [float(x) for x in argument]
            result = Clause(numeric_values).power_Input()

        elif title == "Acetic_Acid":
            if len(argument) < 30:  # Ensure there are at least 18 values for the Chemistry calculation
                raise IndexError("Not enough arguments provided for Acetic_Acid")

            chemistry_calc = FirstYChemistry(argument)
            result = chemistry_calc.Acetic_acid()  # Assume this method returns JSON result

        elif title == "Conductometric":
            if len(argument) < 30:  
                raise IndexError("Not enough arguments provided for Conductometric")

            chemistry_calc = FirstYChemistry(argument)
            result = chemistry_calc.Conductometric()  # Call the Conductometric method
        
        elif title == "EDTA_Water":
            if len(argument) < 21:  # Ensure there are at least 15 values for Conductometric calculation
                raise IndexError("Not enough arguments provided for Conductometric")

            chemistry_calc = FirstYChemistry(argument)
            result = chemistry_calc.EDTA()
            
        elif title == "Dissolved_Oxygen":
            if len(argument) < 21:  # Ensure there are at least 15 values for Conductometric calculation
                raise IndexError("Not enough arguments provided for Dissolved Oxygen")

            chemistry_calc = FirstYChemistry(argument)
            result = chemistry_calc.oxygen()
            
        else:
            result = {"error": "Unknown title"}

    except ValueError as e:
        result = {"error": f"Invalid measurement value: {str(e)}"}
    except IndexError as e:
        result = {"error": f"Index error: {str(e)}"}
    except Exception as e:
        result = {"error": f"Error processing script: {str(e)}"}

    # Output only JSON result
    print(json.dumps(result))

if __name__ == "__main__":
    main()
