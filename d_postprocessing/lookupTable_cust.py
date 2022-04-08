# Hayley Yukihiro
# Lookup Table Class
# Created On: 2022-03-10 23:11:19
# Last updated by: Hayley Yukihiro, 2022-03-25 12:31:00
# Last updated by: L. Wu, 2022-03-31 21:32:00

import csv
import pandas as pd
import os
from os import listdir
from os.path import isfile, join
import re
import pandas as pd
import getpass as gt

#user = input("Hello, thank you for using the Cadence Lookup Table. Please provide your username (For reference, username would reside within this structure /Users/tsuru/OneDrive/): ")
user = gt.getuser()
print("Look Up Table is Processing")

# Establishes lookup table
df = pd.read_csv('/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Customer Data Offload/node_id__to__sim_id_lookup_manifest_3-30-2022.csv')
node = df['NodeID']
sim = df['ICCID(SIM)#']
#print(node)
#print(sim)
lookupNode = {}
lookupSIM = {}

updatedFile = set()

# Lookup SIMID from given NodeID
for x in range(node.size):
    lookupSIM[node[x]] = sim[x]
def findSIM(node):
    return lookupSIM.get(node)
    #if (lookupSIM[node]):
    #    return lookupSIM[node]
    #else:
    #    return "DNE in Manifest"

#print("Here is the lookupSIM result:\n")
#print(lookupSIM)
#print("==============================\n\n")

# Lookup NodeID from given SIMID
for x in range(sim.size):
    lookupNode[sim[x]] = node[x]
def findNode(sim):
    return lookupNode.get(sim)

#print("Here is the lookupNODE result:\n")
#print(lookupNode)
#print("==============================\n\n")

# Populate SIM IDs
def fillSIM(file):
    filesize = os.path.getsize(file)
    if filesize < 1000:
        return
    app = pd.read_csv(file)
    if app.shape[0] < 500:
        return
    nodeID = app['Node ID']
    #print("Here are our NodeIDs:", nodeID)
    simID = []
    for x in nodeID:
        #print(x)
        simID.append(findSIM(x))
        #print(simID)
    
    app['SIM ID'] = simID
    app.to_csv(file, index=False)
    updatedFile.add(file)

# Populate Node IDs
def fillNode(file):
    filesize = os.path.getsize(file)
    if filesize < 1000:
        return
    net = pd.read_csv(file)
    if net.shape[0] < 1000:
        return
    simID = net['ICCID']
    nodeID = []
    for x in simID:
        nodeID.append(findNode(x))
    net['NodeID'] = nodeID
    net.to_csv(file, index=False)
    updatedFile.add(file)

try:
    while True:
        onlyfiles = [f for f in listdir('/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Customer Data Offload/') if isfile(join('/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Customer Data Offload/', f))]
        appReports = []
        networkReports = []
        for file in onlyfiles:
            if re.match(r'^heartbeat-logs', file):
                appReports.append('/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Customer Data Offload/'+file)
            
            if re.match(r'^Itemised', file):
                networkReports.append('/Users/' + user + '/Liberty University/Group-Cadence Data Simulator-Document Platform - Documents/Customer Data Offload/'+file)

        for x in appReports:
            if x not in updatedFile:
                #print(x, "Tada! This is the file we are working with!\n")
                fillSIM(x)

        for x in networkReports:
            if x not in updatedFile:
                fillNode(x)

except KeyboardInterrupt:
    print("Finished Program")
