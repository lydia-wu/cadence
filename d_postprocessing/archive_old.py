# last edited by Michael Di Girolamo at 4/8/22 2:20 PM

import re
import os
import glob
import shutil
import schedule
import time
from datetime import datetime
import getpass as gt

#user = input("Hello, thank you for using the Cadence Archive Tool. Please provide your username (For reference, username would reside within this structure /Users/tsuru/OneDrive/): ")
#user = 'lydia'
user = gt.getuser()

def archive_old():
    old_path = 'C:/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Data Simulator Offload/' # file path where old files are located
    arch_path = 'Archived/' # file path to where the old files will be archived
    old_ext = '.zip'        # extension of old files (include the '.' i.e. -> '.zip')
    days_old = 23           # days until file is archived
    curr_date = datetime.now()

    os.chdir(old_path)          # changes directory to defined file path
    for file in glob.glob("*" + old_ext):
        file_res = re.findall("DeviceLog_(\d+)-(\d+)-(\d+)_", file) # grabs the date from filename
        if not file_res: continue
        file_year, file_month, file_day = file_res[0]
        file_string = file_year + ' ' + file_month + ' ' + file_day
        file_date = datetime.strptime(file_string, "%Y %m %d")      # turns the date info into a datetime object

        # Checks if file is old
        days_between = (curr_date - file_date).days
        if days_between > days_old:
            print(file + " ** File is " + str(days_between) + " days old\n")
            srcpath = file
            destpath = arch_path + file
            shutil.move(srcpath, destpath)

def archive_monitor():
    monitor_time = datetime.now()
    print(f"archive_old is still running ({monitor_time})")

# Run the script
schedule.every().day.at("01:00").do(archive_old)
#schedule.every().day.at("19:56").do(archive_old)    # for testing purposes

while True:
    schedule.run_pending()
    time.sleep(10) # wait one minute
            


    