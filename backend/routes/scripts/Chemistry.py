from ast import Return
import json


class FirstYChemistry:
    def __init__(self, arg):
        self.arg = arg
    def Acetic_acid(self):
        argument = self.arg[0:]
        
        Norm1 = round((float(argument[12])*float(argument[13])/float(argument[14])),3)
        Norm2 = round((float(argument[26])*float(argument[27])/float(argument[28])),3)
        Acetic= round((Norm2/10*60),2)
        Percent =round((100*Acetic)/float(argument[16]),2)
        
        print(json.dumps({"ESTIMATION OF VINEGAR":[{"Normality of NaOH":str(Norm1),"Normality of oxalic acid in Vinegar":str(Norm2),"Amount of acetic acid present in the given vinegar sample":str(Acetic),"Percentage of acetic acid present in the given vinegar sample":str(Percent)+"%"}]}))
    
    
    def Conductometric(self):
        argument = self.arg[0:]
        V1 = (float(argument[1]) + float(argument[2]) + float(argument[3]) + float(argument[4]) + float(argument[5]) + float(argument[6]) + float(argument[7]) + float(argument[8]) + float(argument[9]) + float(argument[10]) + float(argument[11]) + float(argument[12]) + float(argument[13]) + float(argument[14]))/14
        N2 = (V1*float(argument[1]))/float(argument[1])
        M = (N2 * float(argument[1]) * 100)/1000
        print(json.dumps({"Volume":[{"The  Volume of k2cr2o4" : str(V1) + " N"}], "Normality":[{"The  Normality of Iron" : str(N2) + " N"}], "Amount":[{"The  amount of Lead " : str(M) + " "}]}))
        
    def EDTA(self):
        argument = self.arg[0:]
        
        EDTA = round((float(argument[1])/float(argument[5])),3)
        Hard = round((float(argument[15])*EDTA),3)
        Sample=round((Hard*1000/20),2)
        
        print(json.dumps({"TOTAL HARDNESS OF WATER BY EDTA METHOD":[{"1ml of EDTA":str(EDTA)+"mg of CaCO3","20ml of Hard water":str(Hard)+"mg of CaCO3","1000ml of Sample hard water contains":str(Sample)+"ppm"}]}))
        
    def oxygen(self):
        argument = self.arg[0:]
         
        Norm1 = round((float(argument[12])*float(argument[13])/float(argument[14])),4)
        Norm2 = round((float(argument[25])*Norm1/float(argument[27])),3)
        Amount= round((Norm2*8*1000),4)
        
        print(json.dumps({"ans":[{"Normality of Thio":str(Norm1),"Normality of Dissolved oxygen":str(Norm2),"Amount of Dissolved Oxygen in the given solution":str(Amount)}]}))