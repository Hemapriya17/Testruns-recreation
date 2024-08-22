import argparse
import json
from IS_302_1 import Clause

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
