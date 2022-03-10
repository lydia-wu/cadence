#log file type
#file name should follow simulator convention
#read everything from port for a configured amount of time before dropping the next file-->
#"I want to be able to tell it in the command line how long I want you to be reading for each file" (i.e., 10 minutes per file)
#ZIP should happen for every file
#run until manual termination

import socket
import sys
import time
from zipfile import ZipFile
from datetime import datetime

def receive_data(port):

    while True:
        start_time = time.time()
        seconds = 30
        current_time = time.time()
        elapsed_time = current_time - start_time
        # while elapsed_time < seconds:
        s = socket.socket()
        print("client socket created")
        s.connect(('127.0.0.1', port)) # times out here if connection is not made

        data = s.recv(1024)
        print (data.decode())

        with open('logs/DeviceLog_' + datetime.now().strftime("%Y-%m-%d_%H%M%S") + '.log','w+') as file:
            file.write(data.decode())
            #file.writelines(array) # can you dynamically add to an array? -> yes -> append

        print ("Closing socket")
        s.close()
        time.sleep(1)
        #break

receive_data(5601)

# within the python script for the Stream Reader, there should be a feature that writes to a "heartbeat" data file every 5 minutes
# to indicate that the "data cleaner" is up and working as planned.

# It can be a CSV, excel, log--whatever file format you prefer.
# There should be no dirty data.

# The write should increment every 5 minutes relative to the actual time, not some internal clock in the script 
# (i,e, if you run the script at 3:30, then you stop it at 3:42, then you start again at 3:46, 
# it should have the times: 3:30/3:35/3:40/3:46/3:51/etc.)

# The write should include timestamp, status ("working", for now), and how many files processed since script start (integer)