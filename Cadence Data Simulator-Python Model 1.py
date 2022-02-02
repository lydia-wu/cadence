from turtle import end_fill
from urllib.parse import _ParseResultBase
import time 
import random
import threading 
import csv
import sys
from time import sleep
Redirect = sys.stdout
sys.stdout = open("/Users/baseb/Downloads/Source 1.txt", "w+")

NODEID = ('A0001', 'A0002', 'A0003', 'A0004', 'A0005', 'A0006', 'A0007', 'A0008', 'A0009', 'B0001', 'B0002', 'B0003', 'B0004', 'B0005')
NodeID = random.choice(NODEID)

Connect = ('Connected', 'Disconnected', 'Connected', 'Disconnected','Connected', 'Disconnected','Connected', 'Disconnected')
Connection = random.choice(Connect)

SIMID = 1000000000
while SIMID <= 5000000000:
    print ("SIM ID: ", SIMID)
    time.sleep(0.5)
    SIMID += 100000000


from datetime import date
today = date.today()

def print_nodeid_twenty_times():
    for i in range(len(NODEID)):
        time.sleep(1)
        print("The NODEID is:", NODEID[i])
t1 = threading.Thread(target=print_nodeid_twenty_times)
t1.start()
time.sleep(20)

def Print_Date_ten_times():
    for i in range(10):
        print("Device Logged on:", today)
t2 = threading.Thread(target=Print_Date_ten_times)
t2.start()
time.sleep(5)
def print_Connection_twenty_times():
    for i in range(len(Connect)):
        
        print("The device is:", Connect[i])
t3 = threading.Thread(target=print_Connection_twenty_times)
time.sleep(5)
t3.start()

# with open('/Users/Hunter/Downloads/count_loop.csv', 'w', newline = '') as file:
#   fieldnames = ['Time', 'ICCID (SIM ID)', 'Node ID', 'Connection', 'Bytes Used']
#    write = csv.DictWriter(file, fieldnames = fieldnames)

#   write.writeheader()
#    for i in range(0, 100):
#        write.writerow({'Time': '4-Oclock', 'ICCID (SIM ID)' : '1000000000', 'Node ID' : 'A00001', 'Connection' : 'Connected', 'Bytes Used' : '1000-bytes'})

        
sys.stdout.close()
sys.stdout = Redirect