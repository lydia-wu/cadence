# Hunter Alloway
# Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580

# Note-Run the following in command prompt if running this code for the first time: "pip install pandas --user"
# test
print ("Hello World")
# try: 
#    f = open("airlines.csv", encoding = 'utf-8')
    #perform file operations
#finally: 
#    f.close()
# from time import gmtime, strftime
# import time 
# print("\nGMT: "+time.strftime("%b %I %Y:%M:%S %p %Z", time.gmtime()))
import random
import csv
import pandas
byte = random.randint(2000, 3000)
Node = random.randint(0,2)



with open('/Users/baseb/Downloads/Source 2.csv', 'w+', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+1])
    writer.writerow(["Time", 2222222222, "A000002", "Connected", byte+2])
    writer.writerow(["Time", 1111111111, "A000001", "Disconnected", byte+3])
    writer.writerow(["Time", 2222222222, "A000001", "Disconnected", byte+4])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+5])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+6])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+7])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+8])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+9])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+10])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+11])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+12])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", byte+13])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+14])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+15])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+16])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+17])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+18])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+19])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+20])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+21])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+22])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+23])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+24])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+25])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+26])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+27])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+28])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+29])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+30])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+31])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+32])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+33])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+34])
    writer.writerow(["Time", 1111111111, "A000001", "Connected",byte+35])
    # to be removed following the integration of Cadence Data SimulatorModel2

df = pandas.read_csv("/Users/baseb/Downloads/Source 2.csv",
index_col='NodeID', 
header=0,
names=['Time', 'ICCID(SIM ID)', 'NodeID', 'Connection', 'Bytes Used'])
df.to_csv('/Users/baseb/Downloads/Source 2.csv')


# for x in ("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/simulator.csv"):
#    if x == "Hello World":
#        break