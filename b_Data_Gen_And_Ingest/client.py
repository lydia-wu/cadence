# last edited by Michael Di Girolamo at 4/6/22 3:30 PM

from logging import exception
import socket
import time
from zipfile import ZipFile
from datetime import datetime
import csv
import schedule
import shutil
import os
import sys

# ------- File Paths -----------
#user = input("Hello, thank you for using the Cadence Client Tool. Please provide your username (For reference, username would reside within this structure /Users/tsuru/OneDrive/): ")
#user = 'lydia'
user = 'baseb'
zip_path = 'C:/Users/' + user + '/Downloads/'           # file path for the zipped log files (relative or absolute path)
arch_path = zip_path + 'archive/'  # file path for archived original log files (relative or absolute path)
hb_path = zip_path # path for the heartbeat file

# ------- Heartbeat Code ------
# path = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")

# do once
heartbeat_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
with open(hb_path + '/ClientHEARTBEAT_' + heartbeat_time + '.csv', 'w+', newline = '') as file1:
    ClientHeartbeat = csv.writer(file1)
    ClientHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])

# Function to generate a heartbeat every 5 minutes
def heartbeat():
    with open(hb_path + '/ClientHEARTBEAT_' + heartbeat_time + '.csv', 'a', newline = '') as file1:
        ClientHeartbeat = csv.writer(file1)
        ClientHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])

schedule.every(5).seconds.do(heartbeat) # shortened time for testing purposes
#schedule.every(5).minutes.do(heartbeat)
   
# ------ Receive Data Code ------

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
                    delemptyfiles(zip_path)
                    zip_logfile(filename)     # Zip the file
                    archive_logfile(filename) # Archive the log file
                    quit()
                except ConnectionRefusedError:
                    print("Error: Connection may have never been established")
                    s.close()                 # closes socket
                    file.close()
                    delemptyfiles(zip_path)
                    zip_logfile(filename)     # Zip the file - should zip an empty log?
                    archive_logfile(filename) # Archive the log file
                    try:
                        time.sleep(5)
                    except KeyboardInterrupt:
                        print("Accepted keyboard interrupt")
                        #zip_logfile(filename)     # Zip the file
                        #archive_logfile(filename) # Archive the log file
                        quit()
                    print("Retrying...")
                    #quit()
                    continue    # will continue retrying until a connection is made
                except KeyboardInterrupt:
                    print("Keyboard Interrupt - Closing...")
                    s.close()                 # closes socket
                    file.close()
                    delemptyfiles(zip_path)
                    zip_logfile(filename)     # Zip the file
                    archive_logfile(filename) # Archive the log file
                    quit()
                except Exception as e:
                    print("An unexpected error occured")
                    print(e)
                    delemptyfiles(zip_path)
                    quit()

                DeviceLog = csv.writer(file)
                #file.write(data.decode())
                #file.writelines(array) # can you dynamically add to an array? -> yes -> append
                DeviceLog.writerow([data.decode()]) # is this function causing the empty rows?

                print ("Closing socket")
                s.close()
                schedule.run_pending()
                #time.sleep(1) # for debugging purposes
        filecount = filecount + 1

        zip_logfile(filename)     # Zip the file
        archive_logfile(filename) # Archive the log file

# Zip Log File Function
def zip_logfile(filename):
    try:
        with ZipFile(zip_path + filename + '.zip', 'w') as zipObj:
            os.chdir(zip_path)   # changes directory so a 'logs' file is not included in the zip
            zipObj.write(filename + '.log')
            #os.chdir('..')      # reverts to parent directory
    except FileNotFoundError:
        print(f'(zip_logfile) File not found: {filename}.log')
        os.remove(filename + '.zip')

# Archive Log File Function
def archive_logfile(filename):
    srcpath = zip_path + filename + '.log'
    destpath = arch_path + filename + '.log'
    try:
        shutil.move(srcpath, destpath)
    except FileNotFoundError:
        print(f'(archive_logfile) File not found: {filename}.log')

# Delete Empty Files Function
def delemptyfiles(rootdir):
    for root, dirs, files in os.walk(rootdir):
        for f in files:
            fullname = os.path.join(root, f)
            if os.path.getsize(fullname) == 0:
                print (fullname)
                os.remove(fullname)
            
# Check for Specified Directory
def checkdir(directory_path):
    if os.path.isdir(directory_path) is True:
        print("Existing processing directory is being written to.")
    else: 
        os.makedirs(directory_path)
        print("A new directory has been created and is being written to.")

# Run the program
checkdir(arch_path)
receive_data(5601)
