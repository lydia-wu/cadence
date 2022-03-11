# last edited by Michael Di Girolamo at 3/11 2:18 PM

import socket
import time
from zipfile import ZipFile
from datetime import datetime
import csv
import schedule

# ------- Heartbeat Code ------

# do once
heartbeat_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
with open('ClientHeartbeat_' + heartbeat_time + '.csv', 'w+', newline = '') as file1:
    ClientHeartbeat = csv.writer(file1)
    ClientHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])

# Function to generate a heartbeat every 5 minutes
def heartbeat():
    with open('ClientHeartbeat_' + heartbeat_time + '.csv', 'a', newline = '') as file1:
        ClientHeartbeat = csv.writer(file1)
        ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])

schedule.every(10).seconds.do(heartbeat) # shortened time for testing purposes
#schedule.every(5).minutes.do(heartbeat)
   
# ------ Receive Data Code -----

def receive_data(port):
    global filecount
    filecount = 0
    while True:
        #schedule.run_pending()
        start_time = time.time()
        seconds = 5 # duration of writing for one device log file
        elapsed_time = 0

        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = 'logs/DeviceLog_' + timestamp
        with open(filename + '.log','w+') as file:
            while elapsed_time < seconds:
                schedule.run_pending()
                current_time = time.time()
                elapsed_time = current_time - start_time

                s = socket.socket()
                print("client socket created")

                global is_running
                is_running = False

                s.connect(('127.0.0.1', port)) # times out here if connection is not made

                is_running = True

                data = s.recv(1024)
                print (data.decode())

                DeviceLog = csv.writer(file)
                #file.write(data.decode())
                #file.writelines(array) # can you dynamically add to an array? -> yes -> append
                DeviceLog.writerow([data.decode()]) # is this function causing the empty rows?

                print ("Closing socket")
                s.close()
                schedule.run_pending()
                time.sleep(1)
        filecount = filecount + 1

        # Zip the file
        with ZipFile(filename + '.zip', 'w') as zipObj: #change filename so that the log file isn't created in the zip?
            zipObj.write(filename + '.log')

# Run the program
receive_data(5601)
