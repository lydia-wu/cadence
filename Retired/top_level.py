#last edited by Lydia Wu @ 10:05P, 2022-03-27 (Sun)
# x1 == columnKiller
# x2 == Data Simulator
print ("Commencing Top-Level Cadence") 

#### Write out script ####
from a_preprocessing.columnKiller import main as colKill_main

from b_Data_Gen_And_Ingest.Data_Generator import *
from b_Data_Gen_And_Ingest.client import *
from c_Email_Flow.FlowV_2_3 import *
import threading
import time

def thread_function(scriptName, kwargs):
    print("Entering thread: ", scriptName)
    exec(open(scriptName).read(), {kwargs})

# Execute columnKiller.py
CleanedDataDirectory = '/Users/lydia/downloads/BookTest' # the STARTING directory with the CSVs
timeDelayMinutes = 1                                     # "wait" time minutes before script runs again
newFolder = 'clean'                                      # the "column killed" file landing folder:
newDirectory = CleanedDataDirectory + '/' + newFolder    # the LANDING directory for the cleaned CSVs
keep_col = ['Column 1', 'Column 2', 'Column 5']          # column names to KEEP (all other columns deleted)

# Execute Data_Generator_static.py
DataSimOutputDirectory = '/Users/lydia/downloads/dataSimOutput' # this is where simulated files will land


# MAIN CODE
try:
    #run_event = threading.Event() # to have a trigger
    #run_event.set()
    
    # run this loop continuously!
    while (True):
      # x1 = threading.Thread(target=colKill_main, args=(CleanedDataDirectory, timeDelayMinutes, newFolder, newDirectory, keep_col))
       #x1.start()
        x = 1
       #x2 = threading.Thread(target=dataGen_main, args=(DataSimOutputDirectory))
       #x2.start()
       
       #x2.join()           

except KeyboardInterrupt:  
        print("You have issued a keyboard interrupt; you are exiting the program...") 
        # close thread
        #run_event.clear()
        #x1.join()

#x2 = threading.Thread(target=thread_function, args=("AppNetwork_Data_Generator.py",))
#x2.start()
#print("/Users/lydia/downloads/dataSimulatorOutput")

