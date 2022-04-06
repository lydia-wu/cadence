#last edited by Hunter Alloway on 03/11/2022
print ("Generating Simulated Data")

import csv
import time
from datetime import datetime
import random
import win32com.client
import schedule
import time
import os
from decouple import config
import shutil

directory = input("Hello, thank you for using Cadence. Please provide the filepath where you would like the generated logs to reside? For reference, insert a response similar to this filepath structure /Users/tsuru/OneDrive/Documents/GitHub/cadence/Parent_Simulator: ")
newdirectory = 'C:/Users/Hunter/Documents/CadenceEmailDataTransferred/'


print("Generating Log Files Now")


if os.path.isdir(newdirectory) is True:
    print("Existing processing directory is being written to.")
else: 
    os.makedirs(newdirectory)
    print("A new directory has been created and is being written to.")

outlook = win32com.client.Dispatch('outlook.application')
mail = outlook.CreateItem(0)

runs = 0
while runs < 10:
    runs = runs + 1
    with open(directory + '/DeviceLogA1_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file1:
        with open(directory + '/NetworkReport_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file2:
            with open(directory + '/AppReport_.'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file3:
                with open(directory + '/DeviceLogA2_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file4:
                    with open(directory + '/DeviceLogA3_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file5:
                        with open(directory + '/DeviceLogA4_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file6:
                            with open(directory + '/DeviceLogA5_'+ datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log', 'w+', newline = '') as file7:
                                DeviceLogA1 = csv.writer(file1)
                                DeviceLogA1.writerow(['Beginning of Device 1 Log'])
                                NetworkReport = csv.writer(file2)
                                NetworkReport.writerow(['Time', 'ICCID(SIM ID)', "Arbitrary Column",'Connection Event', 'Bytes Used'])
                                AppReport = csv.writer(file3)
                                AppReport.writerow(['Time', 'NodeID', 'Message'])
                                DeviceLogA2 = csv.writer(file4)
                                DeviceLogA2.writerow(['Beginning of Device 2 Log'])
                                DeviceLogA3 = csv.writer(file5)
                                DeviceLogA3.writerow(['Beginning of Device 3 Log'])
                                DeviceLogA4 = csv.writer(file6)
                                DeviceLogA4.writerow(['Beginning of Device 4 Log'])
                                DeviceLogA5 = csv.writer(file7)
                                DeviceLogA5.writerow(['Beginning of Device 5 Log'])

                                if runs == 1:
                                    count = 0
                                    while count < 5:
                                        count = count+1
                            
                                # seconds = range (1,101)
                                # for x in seconds:

                                        # SIMID = 1111111111
                            
                                        # Create Device Logs
                                        # DeviceLogA1.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                                        DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                        DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                        DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                        if count == random.randint(1,10):
                                            DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            time.sleep(random.randint(2,10))
                                        if count == random.randint(11,50):
                                            DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                            DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                        if count != random.randint(51,101):
                                            DeviceLogA2.writerow([datetime.now(), "Device NodeID A000002 Sending Hello World " + str(count)])
                                            DeviceLogA4.writerow([datetime.now(), "Device NodeID A000004 Sending Hello World " + str(count)])
                                        DeviceLogA1.writerow(['This is some arbitrary log data'])
                                        DeviceLogA2.writerow(['This is some arbitrary log data'])
                                        DeviceLogA3.writerow(['This is some arbitrary log data'])
                                        DeviceLogA4.writerow(['This is some arbitrary log data'])
                                        DeviceLogA5.writerow(['This is some arbitrary log data'])
                                        if count == random.randint(10,20) or count == random.randint(30,45) or count == random.randint(50,70) or count == random.randint(75,90):
                                            DeviceLogA1.writerow(['This is some fluff'])
                                            DeviceLogA2.writerow(['Fell for the fluff once more'])
                                            DeviceLogA3.writerow(['The Hufflepuff Jigglypuff fluff'])
                                            DeviceLogA4.writerow(['The worst fluff you can find'])
                                            DeviceLogA5.writerow(['Please end the fluff before the fluff gets you'])
                                        time.sleep(1)
                            

                                        #Create Network Logs for Connection
                                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0])
                                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                                        if count == random.randint(1,50):
                                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                                        if count != random.randint(51,101):
                                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0])
                                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0])
                                        time.sleep(1)
                            
                                        #Create App Logs
                                        AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count)])
                                        AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                                        AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                                        if count == random.randint(1,50):
                                            AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                                            AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                                        if count != random.randint(51,101):
                                            AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count)])
                                            AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count)])
                                        time.sleep(1)
                            
                                        #Create Network Logs for Disconnection
                                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000])
                                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                                        if count == random.randint(1,50):
                                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                                        if count != random.randint(51,101):
                                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000])
                                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000])
                                        time.sleep(5)

                                else:
                                    logs = count + 5
                                    while count < logs:
                                        count = count+1
                            
                                        # Create Device Logs
                                        # DeviceLogA1.writerow([(time.strftime("%d %b %Y %I:%M:%S %p:", time.gmtime())), "Device NodeID A000001 Sending Hello World " + str(count)])
                                        DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                        DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                        DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                        if count == random.randint(1,10):
                                            DeviceLogA1.writerow([datetime.now(), "Device NodeID A000001 Sending Hello World " + str(count)])
                                            time.sleep(random.randint(2,10))
                                        if count == random.randint(11,50):
                                            DeviceLogA3.writerow([datetime.now(), "Device NodeID A000003 Sending Hello World " + str(count)])
                                            DeviceLogA5.writerow([datetime.now(), "Device NodeID A000005 Sending Hello World " + str(count)])
                                        if count != random.randint(51,101):
                                            DeviceLogA2.writerow([datetime.now(), "Device NodeID A000002 Sending Hello World " + str(count)])
                                            DeviceLogA4.writerow([datetime.now(), "Device NodeID A000004 Sending Hello World " + str(count)])
                                        DeviceLogA1.writerow(['This is some arbitrary log data'])
                                        DeviceLogA2.writerow(['This is some arbitrary log data'])
                                        DeviceLogA3.writerow(['This is some arbitrary log data'])
                                        DeviceLogA4.writerow(['This is some arbitrary log data'])
                                        DeviceLogA5.writerow(['This is some arbitrary log data'])
                                        if count == random.randint(10,20) or count == random.randint(30,45) or count == random.randint(50,70) or count == random.randint(75,90):
                                            DeviceLogA1.writerow(['This is some fluff'])
                                            DeviceLogA2.writerow(['Fell for the fluff once more'])
                                            DeviceLogA3.writerow(['The Hufflepuff Jigglypuff fluff'])
                                            DeviceLogA4.writerow(['The worst fluff you can find'])
                                            DeviceLogA5.writerow(['Please end the fluff before the fluff gets you'])
                                        time.sleep(1)
                            

                                        #Create Network Logs for Connection
                                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Connected", 0])
                                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                                        if count == random.randint(1,50):
                                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Connected", 0])
                                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Connected", 0])
                                        if count != random.randint(51,101):
                                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Connected", 0])
                                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Connected", 0])
                                        time.sleep(1)

                            
                                        #Create App Logs
                                        AppReport.writerow([datetime.now(), "A000001", "Cloud App Received Hello World " + str(count)])
                                        AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                                        AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                                        if count == random.randint(1,50):
                                            AppReport.writerow([datetime.now(), "A000002", "Cloud App Received Hello World " + str(count)])
                                            AppReport.writerow([datetime.now(), "A000003", "Cloud App Received Hello World " + str(count)])
                                        if count != random.randint(51,101):
                                            AppReport.writerow([datetime.now(), "A000004", "Cloud App Received Hello World " + str(count)])
                                            AppReport.writerow([datetime.now(), "A000005", "Cloud App Received Hello World " + str(count)])
                                        time.sleep(1)

                            
                                        #Create Network Logs for Disconnection
                                        NetworkReport.writerow([datetime.now(), 1111111111, "xyz", "Disconnected", 2000])
                                        NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                                        NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                                        if count == random.randint(1,50):
                                            NetworkReport.writerow([datetime.now(), 2222222222, "xyz", "Disconnected", 2000])
                                            NetworkReport.writerow([datetime.now(), 3333333333, "xyz", "Disconnected", 2000])
                                        if count != random.randint(51,101):
                                            NetworkReport.writerow([datetime.now(), 4444444444, "xyz", "Disconnected", 2000])
                                            NetworkReport.writerow([datetime.now(), 5555555555, "xyz", "Disconnected", 2000])
                                        time.sleep(1)
                            dir_list = os.listdir(directory)
                            dir_list.sort()
                            filesim = []
                            for i in len(dir_list):
                                filesim.append(directory+dir_list[i])
                            # filesim = [directory +dir_list[0], directory +dir_list[1], directory +dir_list[2], directory +dir_list[3], directory +dir_list[4], directory +dir_list[5]]

                            if len(dir_list) is True:
                                mail.To = 'haalloway@liberty.edu'
                                mail.Subject = 'Cadence Draft 1'
                                mail.HTMLBody = '<h3>This is HTML Body</h3>'
                                mail.Body = "Sending Attachments from Simulator Output"  
                                mail.Attachments.Add(filesim[0])
                                time.sleep(1)
                                mail.Attachments.Add(filesim[1])
                                time.sleep(1)
                                mail.Attachments.Add(filesim[2])
                                time.sleep(1)
                                mail.Attachments.Add(filesim[3])
                                time.sleep(1)
                                mail.Attachments.Add(filesim[4])
                                time.sleep(1)
                                mail.Attachments.Add(filesim[5])
                                time.sleep(1)
                                mail.Attachments.Add(filesim[6])
                                mail.Send()
                                print("File has been sent successfully")
                                shutil.move(filesim[0], newdirectory)
                                shutil.move(filesim[1], newdirectory)
                                shutil.move(filesim[2], newdirectory)
                                shutil.move(filesim[3], newdirectory)
                                shutil.move(filesim[4], newdirectory)
                                shutil.move(filesim[5], newdirectory)
                                shutil.move(filesim[6], newdirectory)
                                print("Generating Next Run")
                            







    

                                        # schedule.every(1).minutes.do(func)
                                        # time.sleep(5)

                                        # while True:
                                        #     schedule.run_pending()
                                        #     time.sleep(1)
print("Completed Program Run")



                                                     











# # set environment variable
# os.environ['user_defined_file_path'] = 'filepath'
# #get environment variable
# FILEPATH = os.getenv('user_defined_file_path')
# datapath = config('FILEPATH')


