# Hunter Alloway
# DeviceLog_Data_Generator
# Created On: 2022-01-24 14:31:46.415580
# Last updated by: Hayley Yukhiro, 2022-03-10 21:41:00

import csv
import pandas as pd
import schedule
import time
from Data_Ingestion.server import *
#from server import *
from datetime import datetime
import random

path = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
print("Generating Log Files Now")

runs = 0
filecount = 0

#Instantiate server
s = server(5601)
s.start_server(5) # parameter: time before timeout

# Generates Device heartbeat file
with open(path + '/DeviceGeneratorHeartbeat_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
    DeviceHeartbeat = csv.writer(file1)
    DeviceHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    DeviceHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
    # Function to generate a heartbeat every 10 minutes
    def heartbeat():
             DeviceHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    schedule.every(10).minutes.do(heartbeat)

    try:
        while True:
            schedule.run_pending()
            runs = runs + 1
            filecount = filecount + 7

            s.send_data('Beginning of Device 1 Log')
            s.send_data('Beginning of Device 2 Log')
            s.send_data('Beginning of Device 3 Log')
            s.send_data('Beginning of Device 4 Log')
            s.send_data('Beginning of Device 5 Log')

            if runs == 1:
                count = 0
                while count < 100:
                    count = count+1
                    schedule.run_pending()
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
            else:
                logs = count + 100
                while count < logs:
                    count = count+1
                    schedule.run_pending()
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
                    if count == random.randint(10,20) or count == random.randint(30,45) or count == random.randint(50,70) or count == random.randint(75,90):
                        s.send_data(f"Device 1 This is some fluff")
                        s.send_data(f"Device 2 Fell for the fluff once more")
                        s.send_data(f"Device 3 The Hufflepuff Jigglypuff fluff")
                        s.send_data(f"Device 4 The worst fluff you can find")
                        s.send_data(f"Device 5 Please end the fluff before the fluff gets you")
                    schedule.run_pending()
                    time.sleep(1)
            print("Generating Next Run")  

    except KeyboardInterrupt:                                 
        DeviceHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount]) 
        s.stop_server()  
        print("Completed Program Run")
