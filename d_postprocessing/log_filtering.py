# last edited by Michael Di Girolamo at 4/8/22 2:20 PM
# last edited by Hayley Yukihiro at 4/19/22 03:58 AM  -- added heartbeat keyboard interrupt functionality

import re
import os
import time
import getpass as gt
from datetime import datetime
import heartbeat

#user = input("Hello, thank you for using the Cadence Unzip Tool. Please provide your username (For reference, username would reside within this structure /Users/tsuru/OneDrive/): ")
#user = 'lydia'
user = gt.getuser()
filter_dir = 'C:/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Data Simulator Offload/'
#filter_dir = 'C:/Users/' + user + '/Downloads/archive/'
extension = ".log"
pattern = '\d{4}[-]\d{2}[-]\d{2}' # basic regex for proof of concept - may need to be more robust
# Instantiate Heartbeat
heartbeat = heartbeat.Heartbeat("Log_Filtering")
while True:
    try:
        os.chdir(filter_dir)                            # change directory to directory with filter files
        for item in os.listdir(filter_dir):             # loop through items in dir
            if item.endswith(extension):                # check for ".log" extension
                file_name = os.path.abspath(item)       # get full path of files
                #print(f'NEW FILE ---- {file_name}')
                filtered_lines = []                     # declare empty array
                with open(file_name,"r") as file:
                    file_time = datetime.now()
                    print(f'{file_name} is being filtered at {file_time}')
                    for line in file:
                        if re.search(pattern, line):
                            #print(f'MATCH: {line}')
                            filtered_lines.append(line) # add matched lines to filtered array
                        else:
                            print(f'Removed line: {line}')
                with open(file_name,"w") as file:
                    for line in filtered_lines:
                        file.write(line + '\n')         # overwrite existing log file with only the filtered lines
                        #file.write(line)         # overwrite existing log file with only the filtered lines
        heartbeat.fileProcessed()
        time.sleep(10)
    except KeyboardInterrupt:
        print("Exiting Program...")
        heartbeat.endHeartbeat()
        heartbeat.keyboardInterrupt()
        quit()

