# last edited by Michael Di Girolamo at 3/11 2:15 PM

import os, zipfile
import time
from datetime import datetime
import csv
import schedule

dir_name = 'C:/lydia/baseb/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Test Zips'
extension = ".zip"
filecount = 0

os.chdir(dir_name) # change directory from working dir to dir with files

for item in os.listdir(dir_name): # loop through items in dir
    if item.endswith(extension): # check for ".zip" extension
        file_name = os.path.abspath(item) # get full path of files
        zip_ref = zipfile.ZipFile(file_name) # create zipfile object
        zip_ref.extractall(dir_name) # extract file to dir
        zip_ref.close() # close file
        os.remove(file_name) # delete zipped file
        filecount = filecount + 1

# ------- Heartbeat Code ------

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