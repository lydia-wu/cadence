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
import time
byte = random.randint(2000, 3000)
Node = random.randint(0,2)

NODEID = ('A0001', 'A0002', 'A0003', 'A0004', 'A0005', 'A0006', 'A0007', 'A0008', 'A0009', 'B0001', 'B0002', 'B0003', 'B0004', 'B0005')
NodeID = random.choice(NODEID)

from datetime import date
CurrentTime = (time.strftime("%a %d %b %Y %I:%M:%S %p", time.gmtime()))
# today = date.today()

#   Do “count” 10 times:
#   Write file 1:  actual time:  xyz, sending Hello World <count>
#	Wait 1 sec (simulate the delay of connecting the modem)
#   Write file 2:  actual time, 1111111111, xyz, connect, 0
#	Wait 1 sec (simulate the delay of communication)
#	Write file 3:  actual time, A00001, xyz, received Hello World <count>
#	Wait 1 sec (simulate the delay of the device timeout for disconnecting after transmission)
#	Write file 2:  actual time, 1111111111, xyz, disconnect, 0
#	Wait 10 sec (simulate the 1 minute delay between hello world messages)
#	Count++

with open('/Users/Hunter/Downloads/DeviceLog.log', 'w+', newline = '') as file1:
    with open('/Users/Hunter/Downloads/NetworkReport.csv', 'w+', newline = '') as file2:
        with open('/Users/Hunter/Downloads/AppReport.csv', 'w+', newline = '') as file3:
            DeviceLog = csv.writer(file1)
            DeviceLog.writerow(['Beginning of Log'])
            NetworkReport = csv.writer(file2)
            NetworkReport.writerow(['Time', 'ICCID(SIM ID)', 'NodeID', 'Connection', 'Bytes Used'])
            AppReport = csv.writer(file3)
            AppReport.writerow(['Time', 'NodeID', 'Random', 'Message From Device'])

            count = 0
            while count < 10:
                count = count+1
                DeviceLog.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                time.sleep(1)
                NetworkReport.writerow([(time.strftime("%d %b %Y %I:%M:%S %p", time.gmtime())), 1111111111, "xyz", "Network SIM Connected", 0])
                time.sleep(1)
                AppReport.writerow([(time.strftime("%d %b %Y %I:%M:%S %p", time.gmtime())), "A000001", "Cloud App Received Hello World " + str(count)])
                time.sleep(1)
                NetworkReport.writerow([(time.strftime("%d %b %Y %I:%M:%S %p", time.gmtime())), 1111111111, "xyz", "Network SIM Disconnected", 2000])
                time.sleep(5)
    
#df = pandas.read_csv("/Users/Hunter/Downloads/Source 2.csv",
#index_col='NodeID', 
#header=0,
#names=['Time', 'ICCID(SIM ID)', 'NodeID', 'Connection', 'Bytes Used'])
#df.to_csv('/Users/Hunter/Downloads/Source 2.csv')


# for x in ("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/simulator.csv"):
#    if x == "Hello World":
#        break
