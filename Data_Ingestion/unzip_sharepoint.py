# last edited by Michael Di Girolamo at 3/23 8:20 PM

import os, zipfile
from datetime import datetime
import csv
import schedule
import time

unzip_dir = 'C:/Users/baseb/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Test Zips'
heartbeat_dir = 'D:/Users/baseb/Documents/GitHub/cadence/Data_Ingestion'
extension = ".zip"
filecount = 0

# ====== Heartbeat Code =======

# do once
heartbeat_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
with open('UnzipHeartbeat_' + heartbeat_time + '.csv', 'w+', newline = '') as file1:
    UnzipHeartbeat = csv.writer(file1)
    UnzipHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    UnzipHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])

# Function to generate a heartbeat every 5 minutes
def heartbeat():
    with open('UnzipHeartbeat_' + heartbeat_time + '.csv', 'a', newline = '') as file1:
        UnzipHeartbeat = csv.writer(file1)
        UnzipHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
schedule.every(5).seconds.do(heartbeat) # shortened time for testing purposes
#schedule.every(5).minutes.do(heartbeat)

# ======= Unzip Code =======

#os.chdir(dir_name) # change directory from working dir to dir with files
while True:
    try:
        os.chdir(unzip_dir)                           # change directory to directory with zipped files
        for item in os.listdir(unzip_dir):              # loop through items in dir
            if item.endswith(extension):                # check for ".zip" extension
                file_name = os.path.abspath(item)       # get full path of files
                zip_ref = zipfile.ZipFile(file_name)    # create zipfile object
                zip_ref.extractall(unzip_dir)           # extract file to dir
                zip_ref.close()                         # close file
                os.remove(file_name)                    # delete zipped file
                filecount = filecount + 1               # increment filecount for heartbeat
        os.chdir(heartbeat_dir)                       # revert directory to heartbeat location
        schedule.run_pending()
        time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting Program...")
        quit()

