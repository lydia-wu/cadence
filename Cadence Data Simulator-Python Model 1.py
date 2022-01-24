# Hunter Alloway
#Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580

print ("Hello World")
# try: 
#    f = open("airlines.csv", encoding = 'utf-8')
    #perform file operations
#finally: 
#    f.close()

# import time
# gmt = time.gmtime(time.time())

# import csv
# with open('airtravel.csv', 'w', newline = '') as file:
   #  writer = csv.writer(file)
  #  writer.writerow(["Time", "ICCID (SIM ID)", "NodeID", "Connection Event", "Bytes Used"])
   # writer.writerow(["Time", 1111111111, "A000001", "Connect", "0-bytes"])
   # writer.writerow(["time", 2222222222, "A000002", "Connect", "0-bytes"])
  #  writer.writerow(["Timestamp in GMT", 1111111111, "A000001", "Disconnect", "2000-bytes"])
  #  writer.writerow(["Timestamp in GMT", 2222222222, "A000002", "Disconnect", "2000-bytes"])

#run in command prompt if running code for the first time: pip install pandas --user

import pandas
df = pandas.read_csv("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/airtravel.csv", index_col='NodeID')
print(df)