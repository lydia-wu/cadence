#last edited by Hunter Alloway on 03/11/2022; 
#last edited by Lydia Wu @1232PM, 2022-03-11
print ("Generating Simulated Data")

import csv
import time
from datetime import datetime
import random
import win32com.client
import schedule
import time
import os
import shutil

# C:/Users/lydia/Downloads/cadence_demo_0311
directory = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
newdirectory = 'C:/Users/lydia/Downloads/transferred'

# START PROGRAM
print("Generating Log Files Now")

# CHECK FOR DIRECTORIES
if os.path.isdir(newdirectory) is True:
    print("Existing processing directory is being written to.")
else: 
    os.makedirs(newdirectory)
    print("A new directory has been created and is being written to.")

# Creates Heartbeat for the EmailFlow Data Transfer
filecount = 0 
with open(newdirectory + '/EmailFlowHeartbeat_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
    EmailFlowHeartbeat = csv.writer(file1)
    EmailFlowHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
    # Function to generate a heartbeat every 10 minutes
    def heartbeat():
             EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    schedule.every(10).minutes.do(heartbeat)

    try:
        outlook = win32com.client.Dispatch('outlook.application')
        mail = outlook.CreateItem(0)

        # run this loop continuously to check for files and send them!
        while (True):
            # check the current directory
            dir_list = os.listdir(directory)
            dir_list.sort()
            print(dir_list)

            # load the directory into a local array
            filesim = []  # rset directory cache
            filecount = 0 # reset file count
            for documentName in dir_list:
                filesim.append(directory+"/"+documentName)
                print("Grabbing: ", documentName)
                filecount = filecount + 1

            #print("filesim, all = ", filesim)

            if len(dir_list):
                mail.To = 'ljwu@liberty.edu'
                mail.Subject = 'Cadence Draft 2.1'
                mail.HTMLBody = '<h3>This is HTML Body</h3>'
                mail.Body = "Sending Attachments from Simulator Output"  

                # add attachment to mail message!
                for documentPath in filesim:
                    mail.Attachments.Add(documentPath)
                    print("Attaching: ", documentPath)
                    time.sleep(1)

                # send mail!
                mail.Send()
                print("File has been sent successfully")

                # move attachment to "archive" folder!
                for documentPath in filesim:
                    print("now moving this file: ", documentPath)
                    shutil.move(documentPath, newdirectory)

                print("Generating Next Run")


                #schedule.every(1).minutes.do(func)

            time.sleep(30) # seconds

           # while True:
           #     schedule.run_pending()
           #     time.sleep(1)
    except KeyboardInterrupt:                                 
            EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount])  # close out heartbeat
            print("Completed Program Run")                

print("This has closed without keyboard interference.")