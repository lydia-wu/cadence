# Hunter Alloway
# AppNetwork_Data_Generator
# Created On: 2022-01-24 14:31:46.415580
# Last updated by: Hayley Yukhiro, 2022-03-10 21:41:00

import csv
import pandas as pd
import schedule
import time
from datetime import datetime
import random

path = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
print("Generating App and Network Files Now")

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

# Creates Heartbeat for the App/Network Data Generation 
with open(path + '/AppNetworkGeneratorHeartbeat_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
    AppNetworkHeartbeat = csv.writer(file1)
    AppNetworkHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    AppNetworkHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
    # Function to generate a heartbeat every 10 minutes
    def heartbeat():
             AppNetworkHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    schedule.every(10).minutes.do(heartbeat)

    try:
        while True:
            schedule.run_pending()
            runs = runs + 1
            filecount = filecount + 2
            # Creates new App and Network Report Files
            with open(path + '/NetworkReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file2:
                with open(path + '/AppReport_.'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file3:
                    NetworkReport = csv.writer(file2)
                    NetworkReport.writerow(['Time', 'ICCID(SIM ID)', "Arbitrary Column",'Connection Event', 'Bytes Used', 'NodeID'])
                    AppReport = csv.writer(file3)
                    AppReport.writerow(['Time', 'NodeID', 'Message', 'SIM ID'])

                    # First Run (for the sake of starting count at zero)
                    if runs == 1:
                        count = 0
                        while count < 100:
                            count = count+1
                            schedule.run_pending()

                            #Create Network Logs for Connection
                            NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0, findNode(1111111111)])
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                            if count == random.randint:
                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                            if count != random.randint:
                                NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0, findNode(4444444444)])
                                NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0, findNode(5555555555)])
                            schedule.run_pending()
                            time.sleep(1)

                            #Create App Logs
                            AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count), findSIM('A000001')])
                            AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                            AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                            if count == random.randint:
                                AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                                AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                            if count != random.randint:
                                AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count), findSIM('A000004')])
                                AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count), findSIM('A000005')])
                            schedule.run_pending()
                            time.sleep(1)

                            #Create Network Logs for Disconnection
                            NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000, findNode(1111111111)])
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                            if count == random.randint:
                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                            if count != random.randint:
                                NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000, findNode(4444444444)])
                                NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000, findNode(5555555555)])
                            schedule.run_pending()
                            time.sleep(5)
                            schedule.run_pending()
                    else:
                        # Runs after the first run (for the sake of count)
                        logs = count + 100
                        while count < logs:
                            count = count+1
                            schedule.run_pending()

                            #Create Network Logs for Connection
                            NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0, findNode(1111111111)])
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                            if count == random.randint:
                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0, findNode(2222222222)])
                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0, findNode(3333333333)])
                            if count != random.randint:
                                NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0, findNode(4444444444)])
                                NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0, findNode(5555555555)])
                            schedule.run_pending()
                            time.sleep(1)

                            #Create App Logs
                            AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count), findSIM('A000001')])
                            AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                            AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                            if count == random.randint:
                                AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count), findSIM('A000002')])
                                AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count), findSIM('A000003')])
                            if count != random.randint:
                                AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count), findSIM('A000004')])
                                AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count), findSIM('A000005')])
                            schedule.run_pending()
                            time.sleep(1)

                            #Create Network Logs for Disconnection
                            NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000, findNode(1111111111)])
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                            if count == random.randint:
                                NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000, findNode(2222222222)])
                                NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000, findNode(3333333333)])
                            if count != random.randint:
                                NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000, findNode(4444444444)])
                                NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000, findNode(5555555555)])
                            schedule.run_pending()
                            time.sleep(5)
                            schedule.run_pending()
                    
                    print("Generating Next Run")

    except KeyboardInterrupt:                                 
        AppNetworkHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount])  
        print("Completed Program Run")                


