# Heartbeat Class
# last edited by Hayley Yukihiro at 4/7/22 01:15
from asyncio.windows_events import NULL
import csv
import schedule
import time
from datetime import datetime

class Heartbeat:
    filesprocessed = 0
    Heartbeat = NULL
    fileName = ""
    def __init__(self, name):
        self.name = name
        pathHB = 'C:/Users/lydia/Downloads/cadence_1/'
        # HEARTBEAT_<program name>_YYYY-MM-DD_HHMMSS.csv
        with open(pathHB + 'HEARTBEAT_'+ name + '_' + datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.csv', 'w+', newline = '') as file1:
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