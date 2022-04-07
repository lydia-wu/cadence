# last edited by Michael Di Girolamo at 3/30/22 7:20 PM
# last edited by L. Wu at 3/31/22 8:06 PM

import os, zipfile
from datetime import datetime
import csv
import schedule
import time
import shutil # to move files from "active" directory to "archive"/"transferred" directory


# ====== Setup Variables =======

#user = input("Hello, thank you for using the Cadence Unzip Tool. Please provide your username (For reference, username would reside within this structure /Users/tsuru/OneDrive/): ")
user = 'tsuru'
unzip_dir = 'C:/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Data Simulator Offload'
heartbeat_dir = unzip_dir + '/'
archive_dir = 'C:/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Data Simulator Offload/archive'
extension = ".zip"
filecount = 0

# CHECK FOR DIRECTORIES
if os.path.isdir(archive_dir) is True:
    print("Existing archive directory is being written to.")
else: 
    os.makedirs(archive_dir)
    print("A new archive directory has been created and is being written to.")

# ====== Heartbeat Code =======

# do once
heartbeat_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
with open(heartbeat_dir + '/UnzipHEARTBEAT_' + heartbeat_time + '.csv', 'w+', newline = '') as file1:
    UnzipHeartbeat = csv.writer(file1)
    UnzipHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    UnzipHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])

# Function to generate a heartbeat every 5 minutes
def heartbeat():
    with open(heartbeat_dir + 'UnzipHEARTBEAT_' + heartbeat_time + '.csv', 'a', newline = '') as file1:
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
                #os.remove(file_name)                    # delete zipped file
                shutil.move(item, archive_dir)          # moves log file to archive directory
                filecount = filecount + 1               # increment filecount for heartbeat
        os.chdir(heartbeat_dir)                       # revert directory to heartbeat location
        schedule.run_pending()
        time.sleep(1)
    except KeyboardInterrupt:
        print("Exiting Program...")
        quit()

