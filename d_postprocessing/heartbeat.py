# Heartbeat Class
# last edited by Hayley Yukihiro at 4/18/22 03:56 -- added keyboard interrupt function
from asyncio.windows_events import NULL
import csv
import schedule
import time
from datetime import datetime
import os
import shutil

class Heartbeat:
    filesprocessed = 0
    Heartbeat = NULL
    fileName = ""
    def __init__(self, name):
        self.name = name
        path = 'C:/Users/lydia/Downloads/cadence_1/tmpHB'

        # CHECK FOR DIRECTORIES
        if os.path.isdir(path) is True:
            print("Existing heartbeat directory is being written to.")
        else: 
            os.makedirs(path)
            print("A new heartbeat directory has been created and is being written to.")

        # HEARTBEAT_<program name>_YYYY-MM-DD_HHMMSS.csv
        with open(path + '/HEARTBEAT_'+ name + '_' + datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
            self.fileName = file1.name
            self.Heartbeat = csv.writer(file1)
            self.Heartbeat.writerow(['Time', 'Status', 'Files Processed'])
            self.Heartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Begin Run", 0])
            # Function to generate a heartbeat every 10 minutes
            #schedule.every(10).minutes.do(heartbeat)
            schedule.every(1).seconds.do(self.heartbeat)
    
    def heartbeat(self):
        with open(self.fileName, 'a', newline = '') as file1:
            self.Heartbeat = csv.writer(file1)
            self.Heartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "Working", self.filesprocessed])

    def endHeartbeat(self):
         with open(self.fileName, 'a', newline = '') as file1:
            self.Heartbeat = csv.writer(file1)
            self.Heartbeat.writerow([datetime.now().strftime("%Y-%m-%d_%H%M%S"), "End Run", self.filesprocessed]) 

    def fileProcessed(self):
        self.filesprocessed += 1

    def getFileName(self):
        return self.fileName

    def keyboardInterrupt(self):
        pathHB = 'C:/Users/lydia/Downloads/cadence_1/tmpHB'
        path = 'C:/Users/lydia/Downloads/cadence_1'
        file_names = os.listdir(pathHB)
        for file_name in file_names:
            shutil.move(os.path.join(pathHB, file_name), path)