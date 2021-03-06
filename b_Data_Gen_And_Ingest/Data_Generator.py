# Hunter Alloway
# Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580
# Last updated by: Hayley Yukhiro, 2022-04-18 03:55:00 --- added heartbeat keyboard interrupt functionality
# Last updated by: Lydia Wu,       2022-03-30 23:21:00
# Last updated by: Michael DiGirolamo, 2022-04-07 16:30:00

print ("Generating Simulated Data")
from fileinput import filename
import pandas as pd
import csv
import schedule
import time
#from Data_Ingestion.server import *
from server import * 
from datetime import datetime
import random
import os
import shutil
import heartbeat
import getpass as gt
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

#path = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
#parentLocation = 'C:/Users/baseb/Downloads/'
user = gt.getuser()
parentLocation = 'C:/Users/' + user + '/Downloads/'
path = parentLocation + 'cadence_1/tmp'
pathHB = parentLocation + 'cadence_1'
print("Generating App and Network Files Now")

# CHECK FOR DIRECTORIES
if os.path.isdir(path) is True:
    print("Existing processing directory is being written to.")
else: 
    os.makedirs(path)
    print("A new directory has been created and is being written to.")

# Instantiates run count
runs = 0
filecount = 0

# Instantiate server
timeout_period = 10

s1 = server(5601)
s1.start_server(timeout_period)

s2 = server(5602)
s2.start_server(timeout_period)

s3 = server(5603)
s3.start_server(timeout_period)

s4 = server(5604)
s4.start_server(timeout_period)

s5 = server(5605)
s5.start_server(timeout_period)
    
# Creates and establishes the Generator Heartbeat file
heartbeat = heartbeat.Heartbeat("Generator")
    

# runs = 0
# while runs < 10:
try:
    while True:
        schedule.run_pending()
        runs = runs + 1
        filecount = filecount + 7
        
        # Begins sending data to the port
        s1.send_data('Beginning of Device 1 Log')
        s2.send_data('Beginning of Device 2 Log')
        s3.send_data('Beginning of Device 3 Log')
        s4.send_data('Beginning of Device 4 Log')
        s5.send_data('Beginning of Device 5 Log')

        # Creates file for Network and App reports
        with open(path + '/NetworkReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file2:
            with open(path + '/AppReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file3:
                NetworkReport = csv.writer(file2)
                NetworkReport.writerow(['Time', 'ICCID(SIM ID)', "Arbitrary Column",'Connection Event', 'Bytes Used'])
                AppReport = csv.writer(file3)
                AppReport.writerow(['Time', 'NodeID', 'Message'])
                schedule.run_pending()

                # First run (for the sake of starting count at zero)
                if runs == 1:
                    count = 0
                    while count < 100:
                        count = count+1
                        schedule.run_pending()

                        # Create Device Logs
                        timeDate = datetime.now()
                        s1.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                        s3.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                        s5.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                        if count == random.randint:
                            s1.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                            time.sleep(random.randint(2,10))
                        if count == random.randint:
                            s3.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                            s5.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                        if count != random.randint:
                                s2.send_data(f"{timeDate} Device NodeID A000002 Sending Hello World {count}")
                                s4.send_data(f"{timeDate} Device NodeID A000004 Sending Hello World {count}")
                        s1.send_data(f"Device 1 This is some arbitrary log data")
                        s2.send_data(f"Device 2 This is some arbitrary log data")
                        s3.send_data(f"Device 3 This is some arbitrary log data")
                        s4.send_data(f"Device 4 This is some arbitrary log data")
                        s5.send_data(f"Device 5 This is some arbitrary log data")
                        if count == random.randint:
                            s1.send_data(f"Device 1 This is some fluff")
                            s2.send_data(f"Device 2 Fell for the fluff once more")
                            s3.send_data(f"Device 3 The Hufflepuff Jigglypuff fluff")
                            s4.send_data(f"Device 4 The worst fluff you can find")
                            s5.send_data(f"Device 5 Please end the fluff before the fluff gets you")
                        schedule.run_pending()
                        time.sleep(1)


                        #Create Network Logs for Connection
                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0])
                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                        if count == random.randint(1,50):
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                        if count != random.randint(51,101):
                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0])
                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0])
                        schedule.run_pending()
                        # time.sleep(0.01)
                        time.sleep(1)

                        #Create App Logs
                        AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count)])
                        AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                        AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                        if count == random.randint(1,50):
                            AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                            AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                        if count != random.randint(51,101):
                            AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count)])
                            AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count)])
                        schedule.run_pending()
                        # time.sleep(0.01)
                        time.sleep(1)

                        #Create Network Logs for Disconnection
                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000])
                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                        if count == random.randint(1,50):
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                        if count != random.randint(51,101):
                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000])
                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000])
                        schedule.run_pending()
                        # time.sleep(0.01)
                        time.sleep(5)
                        schedule.run_pending()

                else:
                    logs = count + 100
                    while count < logs:
                        count = count+1
                        schedule.run_pending()

                        # Create Device Logs
                        timeDate = datetime.now()
                        s1.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                        s3.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                        s5.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                        if count == random.randint:
                            s1.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                            time.sleep(random.randint(2,10))
                        if count == random.randint:
                            s3.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                            s5.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                        if count != random.randint:
                                s2.send_data(f"{timeDate} Device NodeID A000002 Sending Hello World {count}")
                                s4.send_data(f"{timeDate} Device NodeID A000004 Sending Hello World {count}")
                        s1.send_data(f"Device 1 This is some arbitrary log data")
                        s2.send_data(f"Device 2 This is some arbitrary log data")
                        s3.send_data(f"Device 3 This is some arbitrary log data")
                        s4.send_data(f"Device 4 This is some arbitrary log data")
                        s5.send_data(f"Device 5 This is some arbitrary log data")
                        if count == random.randint:
                            s1.send_data(f"Device 1 This is some fluff")
                            s2.send_data(f"Device 2 Fell for the fluff once more")
                            s3.send_data(f"Device 3 The Hufflepuff Jigglypuff fluff")
                            s4.send_data(f"Device 4 The worst fluff you can find")
                            s5.send_data(f"Device 5 Please end the fluff before the fluff gets you")
                        schedule.run_pending()
                        time.sleep(1)


                        #Create Network Logs for Connection
                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0])
                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                        if count == random.randint:
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                        if count != random.randint:
                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0])
                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0])
                        schedule.run_pending()
                        # time.sleep(0.01)
                        time.sleep(1)


                        #Create App Logs
                        AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count)])
                        AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                        AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                        if count == random.randint:
                            AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                            AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                        if count != random.randint:
                            AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count)])
                            AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count)])
                        schedule.run_pending()
                        # time.sleep(0.01)
                        time.sleep(1)


                        #Create Network Logs for Disconnection
                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000])
                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                        if count == random.randint:
                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                        if count != random.randint:
                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000])
                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000])
                        schedule.run_pending()
                        # time.sleep(0.01)
                        time.sleep(5)
                        schedule.run_pending()

                
                print("Generating Next Run") 
            heartbeat.fileProcessed()
        heartbeat.fileProcessed()
        # Moves finished files from temp to cadence1 folder
        file_names = os.listdir(path)
        for file_name in file_names:
            shutil.move(os.path.join(path, file_name), pathHB)

except KeyboardInterrupt:                                 
    heartbeat.endHeartbeat()
    heartbeat.keyboardInterrupt()
    # Moves finished files from temp to cadence1 folder
    file_names = os.listdir(path)
    for file_name in file_names:
        shutil.move(os.path.join(path, file_name), pathHB)
    s1.stop_server()
    s2.stop_server()
    s3.stop_server()
    s4.stop_server()
    s5.stop_server() 
    print("Completed Program Run") 

