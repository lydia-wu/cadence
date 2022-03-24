#last edited by Hunter Alloway on 03/11/2022; 
#last edited by Lydia Wu @1232PM, 2022-03-11
print ("Commencing Flow of Data from PC to SharePoint")

import csv
import time
from datetime import datetime, timedelta # timedelta is for checking if a file was made in the last 10 minutes
import random
import win32com.client
import schedule
import time
import os
import shutil
from pathlib import Path # this is for checking to see if "archive" already exists
import psutil            # this is for checking to see if a file is being actively written (pip install psutil)

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

# Create function to check for active file use in system:
def has_handle(fpath):
    for proc in psutil.process_iter():
        try:
            for item in proc.open_files():
                if fpath == item.path:
                    return True
        except Exception:
            pass

    return False

# Creates Heartbeat for the EmailFlow Data Transfer
filecount = 0 
heartbeatFileTimestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
heartbeatFileName = 'EmailFlowHEARTBEAT_'+ heartbeatFileTimestamp
print("Your heartbeatFileName for this run: ", heartbeatFileName)

with open(directory + '/' + heartbeatFileName + '.csv', 'w+', newline = '') as file1:
    EmailFlowHeartbeat = csv.writer(file1)
    EmailFlowHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
    # Function to generate a heartbeat every 10 minutes
    def heartbeat():
             EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    schedule.every(10).seconds.do(heartbeat)

    try:
        outlook = win32com.client.Dispatch('outlook.application')
        mail = outlook.CreateItem(0)

        # run this loop continuously to check for files and send them!
        while (True):
            schedule.run_pending()
            # check the current directory
            dir_list = os.listdir(directory)
            dir_list.sort()
            #print(dir_list)

            # load the directory into a local array
            filesim = []  # rset directory cache
            filecount = 0 # reset file count
            for documentName in dir_list:
                #if has_handle(directory+"/"+documentName) is False:
                if len(documentName.split('HEARTBEAT')) - 1 == 0:
                    if datetime.strptime(documentName[-21:-4], "%Y-%m-%d_%H%M%S") <= (datetime.now() - timedelta(minutes = 10)):
                        filesim.append(directory+"/"+documentName)
                        print("Grabbing: ", documentName)
                        filecount = filecount + 1

            schedule.run_pending()
            #print("filesim, all = ", filesim)

            if filecount > 0:
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
                schedule.run_all()

                # move attachment to archive folder!
                ArchiveFolder = Path(newdirectory)
                for documentPath in filesim:
                    print("now moving this file: ", documentPath)
                    if ArchiveFolder.is_dir():
                        shutil.copy(documentPath, newdirectory)
                        os.remove(documentPath)
                    else:
                        shutil.move(documentPath, newdirectory)

                print("Generating Next Run")

            print("Waiting on new files...")
                #schedule.every(1).minutes.do(func)
            schedule.run_pending()
            time.sleep(30) # seconds
            schedule.run_pending()
           # while True:
           #     schedule.run_pending()
           #     time.sleep(1)
    except KeyboardInterrupt:  
            schedule.run_pending()                               
            EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount])  # close out heartbeat

            # SEND OUT THE EMAIL FLOW HEARTBEAT FILE
            #mail.To = 'ljwu@liberty.edu'
            #mail.Subject = 'Cadence Draft 2.1'
            #mail.HTMLBody = '<h3>This is HTML Body</h3>'
            #mail.Body = "Sending Attachments from Simulator Output: Heartbeat of Hunter's Email Flow"  
            #mail.Attachments.Add(newdirectory+"/"+heartbeatFileName)
            #print("Attaching: ", newdirectory+"/"+heartbeatFileName)     
            #time.sleep(1)
            #mail.Send()
            #print("File has been sent successfully")

            # SEND OUT THE AppNetwork and DeviceLog HEARTBEAT FILES
            # check the current directory
            dir_list = os.listdir(directory)
            dir_list.sort()

            # load the directory into a local array
            filesim = []  # rset directory cache
            filecount = 0 # reset file count
            for documentName in dir_list:
                if len(documentName.split(heartbeatFileName)) - 1 == 0:
                    filesim.append(directory+"/"+documentName)
                    print("Grabbing: ", documentName)
                    filecount = filecount + 1

            #print("filesim, all = ", filesim)
            schedule.run_pending()

            if len(dir_list):
                mail.To = 'ljwu@liberty.edu'
                mail.Subject = 'Cadence Draft 2.1'
                mail.HTMLBody = '<h3>This is HTML Body</h3>'
                mail.Body = "Sending Attachments from Simulator Output: the AppReport, NetworkData, and DeviceLog HEARTBEAT files!"  

                # add attachment to mail message!
                for documentPath in filesim:
                    #if (len(documentPath.split('HEARTBEAT') == 0)):
                    mail.Attachments.Add(documentPath)
                    print("Attaching: ", documentPath)
                    time.sleep(1)

                # send mail!
                mail.Send()
                print("Some heartbeat file(s) now sent successfully")

                # move attachment to "archive" folder!
                ArchiveFolder = Path(newdirectory)
                for documentPath in filesim:
                    print("now moving this file: ", documentPath)
                    if ArchiveFolder.is_dir():
                        shutil.copy(documentPath, newdirectory)
                        os.remove(documentPath)
                    else:
                        shutil.move(documentPath, newdirectory)
                
            print("This has closed with keyboard interference.")                

# Finally, send the Email Flow Heartbeat file
file1.close() # close the current heartbeat file

schedule.run_pending()
mail.To = 'ljwu@liberty.edu'
mail.Subject = 'Cadence Draft 2.1'
mail.HTMLBody = '<h3>This is HTML Body</h3>'
mail.Body = "Sending Attachments from Simulator Output: Heartbeat of Hunter's Email Flow"  
print("Attaching: ", directory+"/"+heartbeatFileName+ '.csv') 
mail.Attachments.Add(directory+"/"+heartbeatFileName+ '.csv')
mail.Send()
shutil.move(directory+"/"+heartbeatFileName+ '.csv', newdirectory)

print("end of program.")