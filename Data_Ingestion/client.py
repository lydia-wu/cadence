# last edited by Michael Di Girolamo at 3/30/22 2:30 PM

from logging import exception
import socket
import time
from zipfile import ZipFile
from datetime import datetime
import csv
import schedule
import shutil
import os

# ------- Heartbeat Code ------
# path = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
hb_path = 'D:/Users/baseb/Documents/GitHub/cadence/Data_Ingestion' # path for the heartbeat file

# do once
heartbeat_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
with open(hb_path + '/ClientHeartbeat_' + heartbeat_time + '.csv', 'w+', newline = '') as file1:
    ClientHeartbeat = csv.writer(file1)
    ClientHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])

# Function to generate a heartbeat every 5 minutes
def heartbeat():
    with open('ClientHEARTBEAT_' + heartbeat_time + '.csv', 'a', newline = '') as file1:
        ClientHeartbeat = csv.writer(file1)
        ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])

schedule.every(5).seconds.do(heartbeat) # shortened time for testing purposes
#schedule.every(5).minutes.do(heartbeat)
   
# ------ Receive Data Code ------

zip_path = ''           # file path for the zipped log files (relative or absolute path)
arch_path = 'archive/'  # file path for archived original log files (relative or absolute path)

def receive_data(port):
    global filecount
    filecount = 0
    while True:
        start_time = time.time()
        file_seconds = 5 # write duration for one log file
        elapsed_time = 0

        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        filename = 'DeviceLog_' + timestamp

        with open(zip_path + filename + '.log','w+') as file:
            while elapsed_time < file_seconds:
                schedule.run_pending()
                current_time = time.time()
                elapsed_time = current_time - start_time

                s = socket.socket()
                print("client socket created")
                try:
                    s.connect(('127.0.0.1', port)) # times out here if connection is not made
                    data = s.recv(1024) # throws exception here if server is closed
                    print (data.decode())
                except ConnectionResetError:
                    print("Error: Connection was likely closed by the server")
                    s.close()                 # closes socket
                    file.close()
                    zip_logfile(filename)     # Zip the file
                    archive_logfile(filename) # Archive the log file
                    quit()
                except ConnectionRefusedError:
                    print("Error: Connection may have never been established")
                    s.close()                 # closes socket
                    file.close()
                    zip_logfile(filename)     # Zip the file - should zip an empty log?
                    archive_logfile(filename) # Archive the log file
                    quit()
                except KeyboardInterrupt:
                    print("Keyboard Interrupt - Closing...")
                    s.close()                 # closes socket
                    file.close()
                    zip_logfile(filename)     # Zip the file
                    archive_logfile(filename) # Archive the log file
                    quit()
                except Exception as e:
                    print("An unexpected error occured")
                    print(e)
                    quit()

                DeviceLog = csv.writer(file)
                #file.write(data.decode())
                #file.writelines(array) # can you dynamically add to an array? -> yes -> append
                DeviceLog.writerow([data.decode()]) # is this function causing the empty rows?

                print ("Closing socket")
                s.close()
                schedule.run_pending()
                #time.sleep(1)
        filecount = filecount + 1

        zip_logfile(filename)     # Zip the file
        archive_logfile(filename) # Archive the log file

# Zip Log File Function
def zip_logfile(filename):
    with ZipFile(zip_path + filename + '.zip', 'w') as zipObj:
            zipObj.write(filename + '.log')

# Archive Log File Function
def archive_logfile(filename):
    srcpath = zip_path + filename + '.log'
    destpath = arch_path + filename + '.log'
    shutil.move(srcpath, destpath)

# Run the program
receive_data(5601)
