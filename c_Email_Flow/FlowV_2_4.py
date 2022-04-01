#last edited by Hunter Alloway on 03/11/2022; 
#last edited by Lydia Wu @7:57PM, 2022-03-31
print ("Commencing Flow of Data from PC to SharePoint")

# LIBRARIES
import csv                                # to write to an EmailFlow HEARTBEAT File
import time                               # to create internal delays in the code
import win32com.client                    # to utilize Outlook
import schedule                           # to periodically write to the current EmailFlow HEARTBEAT File
import os                                 # to work with directories in local computer operating systems
import shutil                             # to move files from "active" directory to "archive"/"transferred" directory
import psutil                             # this is for checking to see if a file is being actively written (pip install psutil)
from   pathlib import Path                # this is for checking to see if "archive" already exists
from  datetime import datetime, timedelta # timedelta is for checking if a file was made in the last 10 minutes

# DIRECTORY VARIABLES
parentLocation = 'C:/Users/lydia/Downloads/'
#directory     = parentLocation + 'cadence_2022_03_30'
#newdirectory  = parentLocation + 'transferred'

# EMAIL VARIABLES
emailAddr      = 'ljwu@liberty.edu' # email to recieve data simulator outputs
#emailSubject  = 'Cadence Draft 2.1'

# DIRECTORY FOR CUSTOMER DEMO
directory      = parentLocation + 'cadence_customerData'
newdirectory   = directory + '/' + 'transferred'
emailSubject   = 'Cadence Draft 2.3: Customer Example'

ArchiveFolder  = Path(newdirectory)

# START PROGRAM
print("Generating Log Files Now")

# CHECK FOR DIRECTORIES
if os.path.isdir(newdirectory) is True:
    print("Existing processing directory is being written to.")
else: 
    os.makedirs(newdirectory)
    print("A new directory has been created and is being written to.")

# SEND MAIL, ONE ATTACHMENT
def sendTheMail(outlook, emailAddr, emailSubject, documentPath, ArchiveFolder, newdirectory):
    mail = outlook.CreateItem(0)

    mail.To       = emailAddr
    mail.Subject  = emailSubject
    mail.HTMLBody = '<h3>This is HTML Body</h3>'
    mail.Body     = "Sending Attachments from Simulator Output: " + documentPath 

    print(documentPath)
    mail.Attachments.Add(documentPath)
    #print("Attaching:                    ", documentPath)
    print("ATTACHED")
    time.sleep(1)

    # send mail!
    mail.Send()
    #print("File has been sent successfully")
    print("EMAILED")
    #schedule.run_all()
    #time.sleep(5) # seconds

    #print("now moving this file:         ", documentPath)
    if ArchiveFolder.is_dir():
        shutil.copy(documentPath, newdirectory)
        os.remove(documentPath)
    else:
        shutil.move(documentPath, newdirectory)
    print("MOVED OUT OF ACTIVE DIRECTORY")
    
    print("\n")
    del mail

# GENERATE HEARTBEAT EVERY 10 minutes
def heartbeat():
    EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", int(filecount)])
    #filecount = 0 # reset filecount

# CREATE Heartbeat for the EmailFlow Data Transfer
filecount              = 0 
heartbeatFileTimestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
heartbeatFileName      = 'EmailFlow_HEARTBEAT_'+ heartbeatFileTimestamp
print("Your heartbeatFileName for this run: ", heartbeatFileName)

# COMMENCE EmailFlow DATA TRANSFER
with open(directory + '/' + heartbeatFileName + '.csv', 'w+', newline = '') as file1:
    EmailFlowHeartbeat = csv.writer(file1)
    EmailFlowHeartbeat.writerow(['Time', 'Status', 'Files Processed'])
    EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
    
    schedule.every(10).seconds.do(heartbeat)

    try:
        outlook = win32com.client.Dispatch('outlook.application')

        # run this loop continuously to check for files and send them!
        while (True):
            schedule.run_pending()

            # check the current directory
            dir_list = os.listdir(directory)
            dir_list.sort()
            #print(dir_list)

            # load the directory into a local array
            filesim   = []  # reset directory cache
            filecount = 0   # reset file count

            for documentName in dir_list:
                # files to initially exclude from directory
                notHEARTBEATFile   = (len(documentName.split('HEARTBEAT'))   - 1 == 0)
                notLookupTableFile = (len(documentName.split('LookUpTable')) - 1 == 0)
                isDirectory        = os.path.isdir(directory+"/"+documentName)

                #if (isDirectory):
                #    print("Here are the directory contents that are not files: ")
                #    print(documentName, "\n")

                if (notHEARTBEATFile & notLookupTableFile & ~isDirectory) :
                    filesim.append(directory+"/"+documentName)
                    print("Grabbing: ", documentName)
                    filecount = filecount + 1

            schedule.run_pending()
            #print("filesim, all = ", filesim)

            if filecount > 0:
                # add attachment to mail message!
                for documentPath in filesim:
                    sendTheMail(outlook, emailAddr, emailSubject, documentPath, ArchiveFolder, newdirectory)

            print("Waiting on new files...")

            schedule.run_pending()
            time.sleep(30) # seconds

    except KeyboardInterrupt:  
            schedule.run_pending()                               
            EmailFlowHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount])  # close out heartbeat

            dir_list = os.listdir(directory)
            dir_list.sort()

            # load the directory into a local array
            filesim = []  # rset directory cache
            filecount = 0 # reset file count
            for documentName in dir_list:
                # files to continue to include/exclude from directory
                notEmailFlowHEARTBEATFile   = (len(documentName.split('HEARTBEAT')) - 1 == 0)
                isOtherHEARTBEATFile        = (len(documentName.split('heartbeat')) - 1 != 0)
                isDirectory                 = os.path.isdir(directory+"/"+documentName)

                if (notEmailFlowHEARTBEATFile & isOtherHEARTBEATFile & ~isDirectory):
                    filesim.append(directory+"/"+documentName)
                    print("Grabbing: ", documentName)
                    filecount = filecount + 1

            #print("filesim, all = ", filesim)
            schedule.run_pending()

            if len(dir_list):
                # add attachment to mail message!
                for documentPath in filesim:
                    sendTheMail(outlook, emailAddr, emailSubject, documentPath, ArchiveFolder, newdirectory)
                    print("Some heartbeat file(s) now sent successfully")
                
            print("This has closed with keyboard interference.\n\n")                

# Finally, send the current Email Flow Heartbeat file: close the file, then email
file1.close()

print("=== NOW SENDING CURRENT EmailFlow HEARTBEAT FILE ===")
sendTheMail(outlook, emailAddr, emailSubject, directory+"/"+heartbeatFileName+ '.csv', ArchiveFolder, newdirectory)

print("===================================\nWoot! End of program!")