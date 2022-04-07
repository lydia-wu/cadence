# Hunter Alloway
# Cadence-Data Simulator
# Created On: 2022-01-24 14:31:46.415580
# Last updated by: Hayley Yukhiro, 2022-04-07 1:04:00 --- added heartbeat class functionalities
# Last updated by: Lydia Wu,       2022-03-30 23:21:00

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
parentLocation = 'C:/Users/tsuru/Downloads/'
path = parentLocation + 'cadence_1/tmp'
pathHB = parentLocation + 'cadence_1'
#path = 'C:/Users/baseb/Downloads'
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
s = server(5601)
s.start_server(10)
    
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
        s.send_data('Beginning of Device 1 Log')
        s.send_data('Beginning of Device 2 Log')
        s.send_data('Beginning of Device 3 Log')
        s.send_data('Beginning of Device 4 Log')
        s.send_data('Beginning of Device 5 Log')

        # Creates file for Network and App reports
        with open(path + '/NetworkReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file2:
            with open(path + '/AppReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file3:
                # with open(path + '/DeviceLogA1.csv', 'w+', newline = '') as file4:
                #     with open(path + 'DeviceLogA2.csv', 'w+', newline = '') as file5:
                #         with open(path + '/DeviceLogA3.csv', 'w+', newline = '') as file6:
                #             with open(path + '/DeviceLogA4.csv', 'w+', newline = '') as file7:
                #                 with open(path + '/DeviceLogA5.csv', 'w+', newline = '') as file8:
                                    NetworkReport = csv.writer(file2)
                                    NetworkReport.writerow(['Time', 'ICCID(SIM ID)', "Arbitrary Column",'Connection Event', 'Bytes Used'])
                                    AppReport = csv.writer(file3)
                                    AppReport.writerow(['Time', 'NodeID', 'Message'])
                                    # DeviceLogA1 = csv.writer(file4)
                                    # DeviceLogA1.writerow(['Beginning of Device 1 Log'])
                                    # DeviceLogA2 = csv.writer(file5)
                                    # DeviceLogA2.writerow(['Beginning of Device 2 Log'])
                                    # DeviceLogA3 = csv.writer(file6)
                                    # DeviceLogA3.writerow(['Beginning of Device 3 Log'])
                                    # DeviceLogA4 = csv.writer(file7)
                                    # DeviceLogA4.writerow(['Beginning of Device 4 Log'])
                                    # DeviceLogA5 = csv.writer(file8)
                                    # DeviceLogA5.writerow(['Beginning of Device 5 Log'])
                                    schedule.run_pending()

                                    # First run (for the sake of starting count at zero)
                                    if runs == 1:
                                        count = 0
                                        while count < 100:
                                            count = count+1
                                            schedule.run_pending()
                                
                                            # Create Device Logs
                                            # DeviceLogA1.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            # DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            # DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                            # DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                            # if count == random.randint(1,10):
                                            #     DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            #     time.sleep(random.randint(2,10))
                                            # if count == random.randint(11,50):
                                            #     DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                            #     DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                            # if count != random.randint(51,101):
                                            #     DeviceLogA2.writerow([datetime.now(), "Device NodeID A000002 Sending Hello World " + str(count)])
                                            #     DeviceLogA4.writerow([datetime.now(), "Device NodeID A000004 Sending Hello World " + str(count)])
                                            # DeviceLogA1.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA2.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA3.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA4.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA5.writerow(['This is some arbitrary log data'])
                                            # if count == random.randint(10,20) or count == random.randint(30,45) or count == random.randint(50,70) or count == random.randint(75,90):
                                            #     DeviceLogA1.writerow(['This is some fluff'])
                                            #     DeviceLogA2.writerow(['Fell for the fluff once more'])
                                            #     DeviceLogA3.writerow(['The Hufflepuff Jigglypuff fluff'])
                                            #     DeviceLogA4.writerow(['The worst fluff you can find'])
                                            #     DeviceLogA5.writerow(['Please end the fluff before the fluff gets you'])
                                            # schedule.run_pending()
                                            # # time.sleep(0.01)
                                            # time.sleep(1)

                                            timeDate = datetime.now()
                                            s.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                                            s.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                                            s.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                                            if count == random.randint:
                                                s.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                                                time.sleep(random.randint(2,10))
                                            if count == random.randint:
                                                s.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                                                s.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                                            if count != random.randint:
                                                    s.send_data(f"{timeDate} Device NodeID A000002 Sending Hello World {count}")
                                                    s.send_data(f"{timeDate} Device NodeID A000004 Sending Hello World {count}")
                                            s.send_data(f"Device 1 This is some arbitrary log data")
                                            s.send_data(f"Device 2 This is some arbitrary log data")
                                            s.send_data(f"Device 3 This is some arbitrary log data")
                                            s.send_data(f"Device 4 This is some arbitrary log data")
                                            s.send_data(f"Device 5 This is some arbitrary log data")
                                            if count == random.randint:
                                                s.send_data(f"Device 1 This is some fluff")
                                                s.send_data(f"Device 2 Fell for the fluff once more")
                                                s.send_data(f"Device 3 The Hufflepuff Jigglypuff fluff")
                                                s.send_data(f"Device 4 The worst fluff you can find")
                                                s.send_data(f"Device 5 Please end the fluff before the fluff gets you")
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
                                            # DeviceLogA1.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            # DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            # DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                            # DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                            # if count == random.randint(1,10):
                                            #     DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            #     time.sleep(random.randint(2,10))
                                            # if count == random.randint(11,50):
                                            #     DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                            #     DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                            # if count != random.randint(51,101):
                                            #     DeviceLogA2.writerow([datetime.now(), "Device NodeID A000002 Sending Hello World " + str(count)])
                                            #     DeviceLogA4.writerow([datetime.now(), "Device NodeID A000004 Sending Hello World " + str(count)])
                                            # DeviceLogA1.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA2.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA3.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA4.writerow(['This is some arbitrary log data'])
                                            # DeviceLogA5.writerow(['This is some arbitrary log data'])
                                            # if count == random.randint(10,20) or count == random.randint(30,45) or count == random.randint(50,70) or count == random.randint(75,90):
                                            #     DeviceLogA1.writerow(['This is some fluff'])
                                            #     DeviceLogA2.writerow(['Fell for the fluff once more'])
                                            #     DeviceLogA3.writerow(['The Hufflepuff Jigglypuff fluff'])
                                            #     DeviceLogA4.writerow(['The worst fluff you can find'])
                                            #     DeviceLogA5.writerow(['Please end the fluff before the fluff gets you'])
                                            # schedule.run_pending()
                                            # # time.sleep(0.01)
                                            # time.sleep(1)

                                            timeDate = datetime.now()
                                            s.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                                            s.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                                            s.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                                            if count == random.randint:
                                                s.send_data(f"{timeDate} Device NodeID A000001 Sending Hello World {count}")
                                                time.sleep(random.randint(2,10))
                                            if count == random.randint:
                                                s.send_data(f"{timeDate} Device NodeID A000003 Sending Hello World {count}")
                                                s.send_data(f"{timeDate} Device NodeID A000005 Sending Hello World {count}")
                                            if count != random.randint:
                                                    s.send_data(f"{timeDate} Device NodeID A000002 Sending Hello World {count}")
                                                    s.send_data(f"{timeDate} Device NodeID A000004 Sending Hello World {count}")
                                            s.send_data(f"Device 1 This is some arbitrary log data")
                                            s.send_data(f"Device 2 This is some arbitrary log data")
                                            s.send_data(f"Device 3 This is some arbitrary log data")
                                            s.send_data(f"Device 4 This is some arbitrary log data")
                                            s.send_data(f"Device 5 This is some arbitrary log data")
                                            if count == random.randint:
                                                s.send_data(f"Device 1 This is some fluff")
                                                s.send_data(f"Device 2 Fell for the fluff once more")
                                                s.send_data(f"Device 3 The Hufflepuff Jigglypuff fluff")
                                                s.send_data(f"Device 4 The worst fluff you can find")
                                                s.send_data(f"Device 5 Please end the fluff before the fluff gets you")
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
    s.stop_server()  
    print("Completed Program Run") 

