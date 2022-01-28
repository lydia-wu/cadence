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
from time import gmtime, strftime
import time 
print("\nGMT: "+time.strftime("%b %I %Y:%M:%S %p %Z", time.gmtime()))

import csv
with open('/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/data_simulator.csv', 'w', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])
    writer.writerow(["Time", 2222222222, "A000002", "Connected", "0-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Disconnected", "2000-bytes"])
    writer.writerow(["Time", 2222222222, "A000002", "Disconnected", "2000000-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])

import pandas
df = pandas.read_csv("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/data_simulator.csv",
index_col='NodeID', 
header=0,
names=['Time', 'ICCID(SIM ID)', 'NodeID', 'Connection', 'Bytes Used'])
df.to_csv('/Users/Hunter/Downloads/simulator_modified.csv')
print(df)

for x in ("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/simulator.csv"):
    if x == "Hello World":
        break