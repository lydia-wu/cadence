# last edited by Michael Di Girolamo at 3/25 4:45 PM

import re
import os
import glob
import shutil
import schedule
import time
from datetime import datetime

def archive_old():
    days_old = 23              # days until file is archived
    curr_date = datetime.now()

    os.chdir('logs/')          # changes directory to inside the logs folder
    for file in glob.glob("*.zip"):
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
            destpath = 'archive/' + file
            shutil.move(srcpath, destpath)

# Run the script
schedule.every().day.at("01:00").do(archive_old)

while True:
    schedule.run_pending()
    time.sleep(60) # wait one minute
            


    