#last edited by Lydia Wu @ 11:35P, 2022-03-26 (Sat)
# x1 == columnKiller
# x2 == Data Simulator
print ("Commencing Top-Level Cadence")

from columnKiller import main as colKill_main
from Data_Generator_static import main as dataGen_main
import threading

def thread_function(scriptName, kwargs):
    print("Entering thread: ", scriptName)
    exec(open(scriptName).read(), {kwargs})

# Execute columnKiller.py
CleanedDataDirectory = '/Users/lydia/downloads/BookTest' # the STARTING directory with the CSVs
timeDelayMinutes = 1           # "wait" time minutes before script runs again
newFolder = 'clean'            # the "column killed" file landing folder:
newDirectory = CleanedDataDirectory + '/' + newFolder    # the LANDING directory for the cleaned CSVs
keep_col = ['Column 1', 'Column 2', 'Column 5'] # column names to KEEP (all other columns deleted)

# Execute Data_Generator_static.py
DataSimOutputDirectory = '/Users/lydia/downloads/dataSimOutput' # this is where simulated files will land


# MAIN CODE
try:
    # run this loop continuously!
    while (True):
       #x1 = threading.Thread(target=colKill_main, args=(CleanedDataDirectory, timeDelayMinutes, newFolder, newDirectory, keep_col))
       #x1.start()

        x2 = threading.Thread(target=dataGen_main, args=(DataSimOutputDirectory))
        x2.start()  
        
        # close threads
        #x1.join()
        x2.join()           

except KeyboardInterrupt:  
        print("You have issued a keyboard interrupt; you are exiting the program...") 

#x2 = threading.Thread(target=thread_function, args=("AppNetwork_Data_Generator.py",))
#x2.start()
#print("/Users/lydia/downloads/dataSimulatorOutput")