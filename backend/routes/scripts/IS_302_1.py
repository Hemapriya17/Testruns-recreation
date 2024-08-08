import argparse
import json

class Clause:
    def __init__(self, arg):
        self.arg = arg

    def power_Input(self):
        # Extract the relevant arguments
        argument = self.arg
        
        # Define the calculation functions
        def Power_deviation(measured):
            return measured - 500
        
        def Power_deviation_efficiency(measured):
            return ((measured - 500) / 500) * 100
        
        # Print argument length for debugging
        print(f"Arguments received: {argument}")
        print(f"Number of arguments: {len(argument)}")
        
        # Initialize variables
        Power_deviation_values = []
        Power_deviation_efficiency_values = []

        # Check and compute for available arguments
        if len(argument) >= 3:
            Power_deviation_values.append(Power_deviation(float(argument[2])))
            Power_deviation_efficiency_values.append(Power_deviation_efficiency(float(argument[2])))

        if len(argument) >= 5:
            Power_deviation_values.append(Power_deviation(float(argument[4])))
            Power_deviation_efficiency_values.append(Power_deviation_efficiency(float(argument[4])))

        if len(argument) >= 7:
            Power_deviation_values.append(Power_deviation(float(argument[6])))
            Power_deviation_efficiency_values.append(Power_deviation_efficiency(float(argument[6])))
        
        if not Power_deviation_values:
            return {"error": "Index error: Not enough arguments provided"}
        
        # Format and return the result
        result = {
            "answer": [
                {
                    "Power deviation in watts": ", ".join(f"{value:.3f} W" for value in Power_deviation_values),
                    "Power deviation in %": ", ".join(f"{value:.3f}%" for value in Power_deviation_efficiency_values)
                }
            ]
        }
        
        return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--foo', nargs='+', help='List of measurement values')
    parser.add_argument('--title', help='Title of the measurement')
    args = parser.parse_args()
    
    # Create Clause instance
    clause = Clause(args.foo)
    result = clause.power_Input()
    
    # Output result as JSON
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
