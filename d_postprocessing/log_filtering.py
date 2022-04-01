# last edited by Michael Di Girolamo at 3/31/22 10:40 PM

import re
import os
import time

#user = input("Hello, thank you for using the Cadence Unzip Tool. Please provide your username (For reference, username would reside within this structure /Users/tsuru/OneDrive/): ")
#user = 'baseb'
user = 'lydia'
filter_dir = 'C:/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/'
#filter_dir = 'C:/Users/' + user + '/Downloads/archive/'
extension = ".log"
pattern = '\d{4}[-]\d{2}[-]\d{2}' # basic regex for proof of concept - may need to be more robust

while True:
    try:
        os.chdir(filter_dir)                            # change directory to directory with filter files
        for item in os.listdir(filter_dir):             # loop through items in dir
            if item.endswith(extension):                # check for ".log" extension
                file_name = os.path.abspath(item)       # get full path of files
                #print(f'NEW FILE ---- {file_name}')
                filtered_lines = []                     # declare empty array
                with open(file_name,"r") as file:
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

        time.sleep(10)
    except KeyboardInterrupt:
        print("Exiting Program...")
        quit()

