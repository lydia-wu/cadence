# Hunter Alloway
# Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580
# Last updated by: Hayley Yukhiro, 2022-03-01 23:00:00

# Note-Run the following in command prompt if running this code for the first time: "pip install pandas --user"
# test
print ("Generating Simulated Data")
# try: 
#    f = open("airlines.csv", encoding = 'utf-8')
    #perform file operations
#finally: 
#    f.close()
# from time import gmtime, strftime
# import time 
# print("\nGMT: "+time.strftime("%b %I %Y:%M:%S %p %Z", time.gmtime()))
import csv
import pandas as pd
import schedule
import time
from datetime import datetime
import random
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

path = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
print("Generating Log Files Now")

runs = 0
filecount = 0

# Establishes lookup table
df = pd.read_csv(path + '/NodeID_SIM_LookUpTable.csv')
node = df['Title']
sim = df['SIM ID']
lookupSIM = {}
lookupNode = {}

# Lookup SIMID from given NodeID
for x in range(node.size):
    lookupSIM[node[x]] = sim[x]
def findSIM(node):
    return lookupSIM[node]

# Lookup NodeID from given SIMID
for x in range(sim.size):
    lookupNode[sim[x]] = node[x]
def findNode(sim):
    return lookupNode[sim]
    
with open(path + '/GeneratorHeartbeat_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
    GeneratorHeartbeat = csv.writer(file1)
    GeneratorHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    GeneratorHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
    # Function to generate a heartbeat every 10 minutes
    def heartbeat():
             GeneratorHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    schedule.every(10).minutes.do(heartbeat)
    

    # runs = 0
    # while runs < 10:
    try:
        while True:
            schedule.run_pending()
            runs = runs + 1
            filecount = filecount + 7
            with open(path + '/DeviceLogA1_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file2:
                with open(path + '/NetworkReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file3:
                    with open(path + '/AppReport_.'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file4:
                        with open(path + '/DeviceLogA2_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file5:
                            with open(path + '/DeviceLogA3_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file6:
                                with open(path + '/DeviceLogA4_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file7:
                                    with open(path + '/DeviceLogA5_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file8:
                                        DeviceLogA1 = csv.writer(file2)
                                        DeviceLogA1.writerow(['Beginning of Device 1 Log'])
                                        NetworkReport = csv.writer(file3)
                                        NetworkReport.writerow(['Time', 'ICCID(SIM ID)', "Arbitrary Column",'Connection Event', 'Bytes Used', 'NodeID'])
                                        AppReport = csv.writer(file4)
                                        AppReport.writerow(['Time', 'NodeID', 'Message', 'SIM ID'])
                                        DeviceLogA2 = csv.writer(file5)
                                        DeviceLogA2.writerow(['Beginning of Device 2 Log'])
                                        DeviceLogA3 = csv.writer(file6)
                                        DeviceLogA3.writerow(['Beginning of Device 3 Log'])
                                        DeviceLogA4 = csv.writer(file7)
                                        DeviceLogA4.writerow(['Beginning of Device 4 Log'])
                                        DeviceLogA5 = csv.writer(file8)
                                        DeviceLogA5.writerow(['Beginning of Device 5 Log'])
                                        schedule.run_pending()

                                        if runs == 1:
                                            count = 0
                                            while count < 100:
                                                count = count+1
                                                schedule.run_pending()
                                        # seconds = range (1,101)
                                        # for x in seconds:

                                                # SIMID = 1111111111
                                    
                                                # Create Device Logs
                                                # DeviceLogA1.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                                                DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                                DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                                DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                                if count == random.randint(1,10):
                                                    DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                                    time.sleep(random.randint(2,10))
                                                if count == random.randint(11,50):
                                                    DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                                    DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                                if count != random.randint(51,101):
                                                    DeviceLogA2.writerow([datetime.now(), "Device NodeID A000002 Sending Hello World " + str(count)])
                                                    DeviceLogA4.writerow([datetime.now(), "Device NodeID A000004 Sending Hello World " + str(count)])
                                                DeviceLogA1.writerow(['This is some arbitrary log data'])
                                                DeviceLogA2.writerow(['This is some arbitrary log data'])
                                                DeviceLogA3.writerow(['This is some arbitrary log data'])
                                                DeviceLogA4.writerow(['This is some arbitrary log data'])
                                                DeviceLogA5.writerow(['This is some arbitrary log data'])
                                                if count == random.randint(10,20) or count == random.randint(30,45) or count == random.randint(50,70) or count == random.randint(75,90):
                                                    DeviceLogA1.writerow(['This is some fluff'])
                                                    DeviceLogA2.writerow(['Fell for the fluff once more'])
                                                    DeviceLogA3.writerow(['The Hufflepuff Jigglypuff fluff'])
                                                    DeviceLogA4.writerow(['The worst fluff you can find'])
                                                    DeviceLogA5.writerow(['Please end the fluff before the fluff gets you'])
                                                schedule.run_pending()
                                                time.sleep(0.01)
                                                # time.sleep(1)
                                    

                                                #Create Network Logs for Connection
                                                NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0, findNode(1111111111)])
                                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                                                if count == random.randint(1,50):
                                                    NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                                                    NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                                                if count != random.randint(51,101):
                                                    NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0, findNode(4444444444)])
                                                    NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0, findNode(5555555555)])
                                                schedule.run_pending()
                                                time.sleep(0.01)
                                                # time.sleep(1)
                                    
                                                #Create App Logs
                                                AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count), findSIM('A000001')])
                                                AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                                                AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                                                if count == random.randint(1,50):
                                                    AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                                                    AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                                                if count != random.randint(51,101):
                                                    AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count), findSIM('A000004')])
                                                    AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count), findSIM('A000005')])
                                                schedule.run_pending()
                                                time.sleep(0.01)
                                                # time.sleep(1)
                                    
                                                #Create Network Logs for Disconnection
                                                NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000, findNode(1111111111)])
                                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                                                if count == random.randint(1,50):
                                                    NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                                                    NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                                                if count != random.randint(51,101):
                                                    NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000, findNode(4444444444)])
                                                    NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000, findNode(5555555555)])
                                                schedule.run_pending()
                                                time.sleep(0.1)
                                                # time.sleep(5)
                                                schedule.run_pending()

                                        else:
                                            logs = count + 100
                                            while count < logs:
                                                count = count+1
                                                schedule.run_pending()
                                                # Create Device Logs
                                                # DeviceLogA1.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                                                DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                                DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                                DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                                if count == random.randint:
                                                    DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                                    time.sleep(random.randint(2,10))
                                                if count == random.randint:
                                                    DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                                    DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                                if count != random.randint:
                                                    DeviceLogA2.writerow([datetime.now(), "Device NodeID A000002 Sending Hello World " + str(count)])
                                                    DeviceLogA4.writerow([datetime.now(), "Device NodeID A000004 Sending Hello World " + str(count)])
                                                DeviceLogA1.writerow(['This is some arbitrary log data'])
                                                DeviceLogA2.writerow(['This is some arbitrary log data'])
                                                DeviceLogA3.writerow(['This is some arbitrary log data'])
                                                DeviceLogA4.writerow(['This is some arbitrary log data'])
                                                DeviceLogA5.writerow(['This is some arbitrary log data'])
                                                if count == random.randint:
                                                    DeviceLogA1.writerow(['This is some fluff'])
                                                    DeviceLogA2.writerow(['Fell for the fluff once more'])
                                                    DeviceLogA3.writerow(['The Hufflepuff Jigglypuff fluff'])
                                                    DeviceLogA4.writerow(['The worst fluff you can find'])
                                                    DeviceLogA5.writerow(['Please end the fluff before the fluff gets you'])
                                                schedule.run_pending()
                                                time.sleep(0.01)
                                                # time.sleep(1)
                                    

                                                #Create Network Logs for Connection
                                                NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0, findNode(1111111111)])
                                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                                                if count == random.randint(1,50):
                                                    NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                                                    NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                                                if count != random.randint(51,101):
                                                    NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0, findNode(4444444444)])
                                                    NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0, findNode(5555555555)])
                                                schedule.run_pending()
                                                time.sleep(0.01)
                                                # time.sleep(1)

                                    
                                                #Create App Logs
                                                AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count), findSIM('A000001')])
                                                AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                                                AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                                                if count == random.randint(1,50):
                                                    AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                                                    AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                                                if count != random.randint(51,101):
                                                    AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count), findSIM('A000004')])
                                                    AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count), findSIM('A000005')])
                                                schedule.run_pending()
                                                time.sleep(0.01)
                                                # time.sleep(1)

                                    
                                                #Create Network Logs for Disconnection
                                                NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000, findNode(1111111111)])
                                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                                                if count == random.randint(1,50):
                                                    NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                                                    NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                                                if count != random.randint(51,101):
                                                    NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000, findNode(4444444444)])
                                                    NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000, findNode(5555555555)])
                                                schedule.run_pending()
                                                time.sleep(0.1)
                                                # time.sleep(5)
                                                schedule.run_pending()

                                    
                                        print("Generating Next Run")  
    except KeyboardInterrupt:                                 
        GeneratorHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount])   
        print("Completed Program Run") 

    
#df = pandas.read_csv("/Users/Hunter/Downloads/Source 2.csv",
#index_col='NodeID', 
#header=0,
#names=['Time', 'ICCID(SIM ID)', 'NodeID', 'Connection', 'Bytes Used'])
#df.to_csv('/Users/Hunter/Downloads/Source 2.csv')


# for x in ("/Users/Hunter/Documents/Liberty University/Fourth Year/Classes/Spring 2022/ENGR 482/Visual Studios/Cadence Documentation/CSV/simulator.csv"):
#    if x == "Hello World":
#        break
