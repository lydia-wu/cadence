#last edited by Hunter Alloway on 03/11/2022; 
#lost edited by Lydia Wu @1209AM, 2022-03-11
print ("Generating Simulated Data")

import csv
import time
from datetime import datetime
import random
from importlib_metadata import files
import win32com.client
import schedule
import time
import os
#from decouple import config
import shutil

# C:/Users/lydia/Downloads/cadence_demo_0311
directory = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
newdirectory = 'C:/Users/lydia/Downloads/transferred/'


print("Generating Log Files Now")


if os.path.isdir(newdirectory) is True:
    print("Existing processing directory is being written to.")
else: 
    os.makedirs(newdirectory)
    print("A new directory has been created and is being written to.")

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
        filesim = []
        for i in dir_list:
            filesim.append(directory+"/"+i)
            print("Grabbing: ", i)

        #print("filesim, all = ", filesim)

        if len(dir_list):
            mail.To = 'ljwu@liberty.edu'
            mail.Subject = 'Cadence Draft 2.1'
            mail.HTMLBody = '<h3>This is HTML Body</h3>'
            mail.Body = "Sending Attachments from Simulator Output"  

            # add attachment to mail message!
            for i in filesim:
                #print("entering test ", i)
                mail.Attachments.Add(i)
                print("Attaching: ", i)
                time.sleep(1)

            # send mail!
            mail.Send()
            print("File has been sent successfully")

            # move attachment to "archive" folder!
            for i in filesim:
                print("now moving this file: ", i)
                shutil.move(i, newdirectory)

            print("Generating Next Run")


            #schedule.every(1).minutes.do(func)

        time.sleep(30) # seconds

       # while True:
       #     schedule.run_pending()
       #     time.sleep(1)
except KeyboardInterrupt:                                 
        #AppNetworkHeartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", filecount])  
        print("Completed Program Run")                

print("Completed Program Run")