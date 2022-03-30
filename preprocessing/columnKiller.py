#created: 2022-03-25 Friday, 2:00P ET, L. Wu
#last edited: 2022-03-30 Wednesday, 5:47P ET, L. Wu

print ("Commencing Column Killer Function")

import pandas as pd # for the csv column cleaning function
import csv
import random
import time              # to create time delays
import os                # to check if a path exists
import shutil            # to move files between locations
from pathlib import Path # this is for checking to see if "archive" already exists
import psutil            # this is for checking to see if a file is being actively written (pip install psutil)



# VARIABLES TO SPECIFY:
#directory = '/Users/lydia/downloads/BookTest'   # the STARTING directory with the CSVs
#timeDelayMinutes = 30                           # "wait" time minutes before script runs again
#newFolder = 'clean'                             # the "column killed" file landing folder:
#newDirectory = directory + '/' + newFolder      # the LANDING directory for the cleaned CSVs
#keep_col = ['Column 1', 'Column 2', 'Column 3'] # column names to KEEP (all other columsn will be deleted
#main(directory, timeDelayMinutes, newFolder, newDirectory, keep_col)

#import sys # for passing in varables from the top level PYTHON
#directory        = sys.argv[1]                 # the STARTING directory with the CSVs
#timeDelayMinutes = sys.argv[2]                 # "wait" time minutes before script runs again
#newFolder        = sys.argv[3]                 # the "column killed" file landing folder:
#newDirectory     = directory + '/' + newFolder # the LANDING directory for the cleaned CSVs
#keep_col         = sys.argv[4]                 # column names to KEEP (all other columsn will be deleted)

def main(directory, timeDelayMinutes, newFolder, newDirectory, keep_col):
    # SPECIFY LOCATION OF FILES
    #directory = input("Hello, thank you for using Cadence. Please provide the filepath where you would like to pull the uncleaned CSVs? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
    #newFolder = input("Folder name for cleaned files: ")
    #newFolder = 'clean' # the "column killed" file landing folder:
    #newDirectory = directory + "/" + newFolder

    timeDelaySeconds = timeDelayMinutes*60 # seconds; hard-coded source here; 

    # START PROGRAM
    print("Commencing Column Destruction")

    # CHECK FOR DIRECTORIES
    if os.path.isdir(newDirectory) is True:
        print("Existing processing directory is being written to.")
    else: 
        os.makedirs(newDirectory)
        print("A new directory has been created and is being written to.")

    # MAIN CODE
    try:
        # run this loop continuously to check for files and send them!
        while (True):

            # check the current directory
            dir_list = os.listdir(directory)
            dir_list.sort()
            print(dir_list)

            # load the directory into a local array
            filesim = []  # rset directory cache
            filecount = 0 # reset file count
            filename = [] # reset file name cache

            for documentName in dir_list:
                if len(documentName.split(newFolder)) - 1 == 0:
                    filesim.append(directory+"/"+documentName)
                    print("Grabbing: ", documentName)
                    filecount = filecount + 1

            print("\n")

            if filecount > 0:
                for documentPath in filesim:
                    # read_csv function which is used to read the required CSV file
                    ourData = pd.read_csv(documentPath) 
                    print("Reading: ", documentPath)

                    # DISPLAY 
                    #print("Original CSV Data: \n")
                    #print(ourData)

                    # drop function which is used in removing or deleting rows or columns from the CSV files
                    #keep_col = ['Column 1', 'Column 2', 'Column 3']
                    newOurData = ourData[keep_col]
                    newOurData = pd.DataFrame(newOurData)
                    newOurData_NewName = documentPath.removesuffix('.csv') + '_cleaned.csv'
                    newOurData.to_csv(newOurData_NewName, index=False)

                    # DISPLAY 
                    #print("\nCSV Data after deleting columns:\n")
                    #print(newOurData)

                    # move attachment to archive folder!
                    print("now moving this file: ", newOurData_NewName, "\n")

                    NewFolder = Path(newDirectory)
                    if NewFolder.is_dir():
                        shutil.copy(newOurData_NewName, newDirectory) # copy over newly made file
                        os.remove(newOurData_NewName)                 # delete newly made file 
                    else:
                        shutil.move(newOurData_NewName, newDirectory)
                        print("Folder error: Create folder to house `cleaned` CSVs first.")

                    # decrement tracking file count
                    filecount -= 1

                    time.sleep(1)


            print("Waiting for " + str(timeDelayMinutes) + " minutes on new files...")
            time.sleep(timeDelaySeconds) # seconds

    except KeyboardInterrupt:  
            print("You have issued a keyboard interrupt; you are exiting the program...")      