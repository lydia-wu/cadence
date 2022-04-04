
import os
import pandas as pd
import csv
import schedule
import time

file_list = ["C:/Users/Hunter/Documents/ClonedRepositories/cadence-1/Top_Level_Processing/Data_Generator_Processing.py", "C:/Users/Hunter/Documents/ClonedRepositories/cadence-1/Top_Level_Processing/client_Processing.py"]

for file in file_list:
    exec(open(file_list[0], encoding = "utf8").read()) # UCF Transformation Format 8 Each character in the script represents 1-4 bytes of data
    time.sleep(1)
    exec(open(file_list[1], encoding = "utf8").read())


