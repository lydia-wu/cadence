# Hunter Alloway
#Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580

# Note-Run the following in command prompt if running this code for the first time: "pip install pandas --user"

print ("Hello World")
# try: 
#    f = open("airlines.csv", encoding = 'utf-8')
    #perform file operations
#finally: 
#    f.close()

# import time
# gmt = time.gmtime(time.time())

import csv
with open('/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/simulator.csv', 'w', newline = '') as file:
    writer = csv.writer(file)
    writer.writerow(["Time", 1111111111, "A000001", "Connected", "0-bytes"])
    writer.writerow(["Time", 2222222222, "A000002", "Connected", "0-bytes"])
    writer.writerow(["Time", 1111111111, "A000001", "Disconnected", "2000-bytes"])
    writer.writerow(["This time is a test", 2222222222, "A000002", "Disconnected", "2000000-bytes"])

import pandas
df = pandas.read_csv("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/simulator.csv",
index_col='NodeID', 
header=0,
names=['Time', 'ICCID(SIM ID)', 'NodeID', 'Connection', 'Bytes Used'])
df.to_csv('/Users/Hunter/Downloads/simulator_modified.csv')
print(df)

# for x in df:
 #  print (x)
  #if x == 'break':
 #   break