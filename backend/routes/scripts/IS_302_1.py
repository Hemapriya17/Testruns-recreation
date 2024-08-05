# import json

# class clause:
#     def __init__(self, arg):
#         self.arg = arg
        
#     def power_Input(self):
#         argument = self.arg[0:]
#         def Power_deviation(measured):
#             return measured - 500
#         def Power_deviation_efficiency(measured):
#             return ((measured - 500) / 500) * 100
#         Power_deviation1 = Power_deviation(int(argument[2]))
#         Power_deviation2 = Power_deviation(int(argument[4]))
#         Power_deviation3 = Power_deviation(int(argument[6]))
#         Power_deviationeff1 = Power_deviation_efficiency(float(argument[2]))
#         Power_deviationeff2 = Power_deviation_efficiency(float(argument[4]))
#         Power_deviationeff3 = Power_deviation_efficiency(float(argument[6]))
#         print(f"Power Deviations: {Power_deviation1}, {Power_deviation2}, {Power_deviation3}")
#         print(f"Power Deviations Efficiencies: {Power_deviationeff1}, {Power_deviationeff2}, {Power_deviationeff3}")
#         print(json.dumps({"answer":[{"Power deviation in watts" : str(Power_deviation1)+" W"+","+str(Power_deviation2)+" W"+","+str(Power_deviation3)+" W","Power deviation in %" : str(Power_deviationeff1)+"%"+","+str(Power_deviationeff2)+"%"+","+str(Power_deviationeff3)+"%"}]}))


import json

class clause:
    def __init__(self, arg):
        self.arg = arg
        
    def power_Input(self):
        argument = self.arg[0:]
        
        def Power_deviation(measured):
            return measured - 500
        
        def Power_deviation_efficiency(measured):
            return ((measured - 500) / 500) * 100
        
        Power_deviation1 = Power_deviation(int(argument[2]))
        Power_deviation2 = Power_deviation(int(argument[4]))
        Power_deviation3 = Power_deviation(int(argument[6]))
        
        Power_deviationeff1 = Power_deviation_efficiency(float(argument[2]))
        Power_deviationeff2 = Power_deviation_efficiency(float(argument[4]))
        Power_deviationeff3 = Power_deviation_efficiency(float(argument[6]))
        
        result = {
            "answer": [{
                "Power deviation in watts": f"{Power_deviation1} W, {Power_deviation2} W, {Power_deviation3} W",
                "Power deviation in %": f"{Power_deviationeff1}%, {Power_deviationeff2}%, {Power_deviationeff3}%"
            }]
        }
        
        print(json.dumps(result))

# Test the function directly to ensure it's working as expected
if __name__ == "__main__":
    test_args = ["script.py", "--foo", "0", "0", "505", "0", "510", "0", "515", "IS_4250_C_10", "Input"]
    clause(test_args).power_Input()
