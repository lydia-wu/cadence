#log file type
#file name should follow simulator convention
#read everything from port for a configured amount of time before dropping the next file-->
#"I want to be able to tell it in the command line how long I want you to be reading for each file" (i.e., 10 minutes per file)
#ZIP should happen for every file
#run until manual termination ********

import socket
import sys
import time
from zipfile import ZipFile
from datetime import datetime
import csv
import schedule

# ------- Heartbeat Code ------

with open('/ClientHeartbeat_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
    ClientHeartbeat = csv.writer(file1)
    ClientHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])

    # Function to generate a heartbeat every 10 minutes
    def heartbeat():
             ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    #schedule.every(10).minutes.do(heartbeat)
    schedule.every(10).seconds.do(heartbeat)

# ------ Receive Data Code -----

def receive_data(port):
    global filecount
    filecount = 0
    while True:
        schedule.run_pending()
        start_time = time.time()
        seconds = 5
        elapsed_time = 0

        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = 'logs/DeviceLog_' + timestamp #datetime.now().strftime("%Y-%m-%d_%H%M%S")
        with open(filename + '.log','w+') as file:
            while elapsed_time < seconds:
                current_time = time.time()
                elapsed_time = current_time - start_time

                s = socket.socket()
                print("client socket created")
                s.connect(('127.0.0.1', port)) # times out here if connection is not made

                data = s.recv(1024)
                print (data.decode())

                DeviceLog = csv.writer(file)
                #file.write(data.decode())
                #file.writelines(array) # can you dynamically add to an array? -> yes -> append
                DeviceLog.writerow([data.decode()]) # is this function causing the empty rows?

                print ("Closing socket")
                s.close()
                time.sleep(1)
                #break
        filecount = filecount + 1
        with ZipFile(filename + '.zip', 'w') as zipObj: #need to change filename so that the log file isn't created in the zip 
            zipObj.write(filename + '.log')

receive_data(5601)


# within the python script for the Stream Reader, there should be a feature that writes to a "heartbeat" data file every 5 minutes
# to indicate that the "data cleaner" is up and working as planned.

# It can be a CSV, excel, log--whatever file format you prefer.
# There should be no dirty data.

# The write should increment every 5 minutes relative to the actual time, not some internal clock in the script 
# (i,e, if you run the script at 3:30, then you stop it at 3:42, then you start again at 3:46, 
# it should have the times: 3:30/3:35/3:40/3:46/3:51/etc.)

# The write should include timestamp, status ("working", for now), and how many files processed since script start (integer)