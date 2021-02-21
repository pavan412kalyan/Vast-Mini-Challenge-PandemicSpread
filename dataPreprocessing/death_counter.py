# -*- coding: utf-8 -*-


import numpy as np 
import pandas as pd 



all_files = [
 'aleppo.csv',
 'colombia.csv',
 'iran.csv',
 'karachi.csv',
 'lebanon.csv',
 'nairobi.csv',
 'saudiarabia.csv',
 'thailand.csv',
 'turkey.csv',
 'venezuela.csv',
 'yemen.csv']





result =  pd.DataFrame(columns=['gender', 'country', 'count','status'])

onehotcolumns =['Heart Problems', 'Vocal Problems', 'abdominal pain', 'abscess', 'bleeding', 'body pain', 
 'breathing', 'chest', 'cough', 'cramp', 'deficit', 'diabetic', 'diarrhea', 'dizziness',
 'fatigue', 'fever', 'headache', 'infections', 'injury', 'laceration', 'migraine', 'others', 'pregnant', 'rash',
 'urinate', 'vaginal', 'vision', 'vomiting']


def read_data_count(filename) : 
    
    #    aleppo=pd.read_csv(r"aleppo.csv")
    
    country=filename[:-4]
    aleppo=pd.read_csv("dataset/"+filename)
    aleppo = aleppo.sample(frac=1).reset_index(drop=True)
    aleppo=aleppo.iloc[0:6000000]
    
    
#    print(len(df))
#    aleppo=df

    
    aleppo.drop([ 'DATE', 'DATE_OF_DEATH','PATIENT_ID'], axis=1, inplace=True)
    
    print(aleppo)
    
    
    new_rows = []
    
    
    for sym in onehotcolumns :
        
        print(sym)

        aleppo_death_males = len(aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'M') & (aleppo[sym] == 1)])
        DM= {'gender':'M','country':country , 'count': aleppo_death_males,'status':1, 'symptom': sym}
        
        aleppo_death_females = len(aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'F') & (aleppo[sym] == 1)])
        DF= {'gender':'F','country':country , 'count': aleppo_death_females,'status':1, 'symptom': sym}
        
#        aleppo_death_both = len(aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'F' aleppo['GENDER'] == 'M') & (aleppo[sym] == 1)])
        DB= {'gender':'A','country':country , 'count': aleppo_death_males + aleppo_death_females,'status':1, 'symptom': sym}
    
        
        aleppo_alive_males = len(aleppo.loc[(aleppo['DEATH'] == 0) & (aleppo['GENDER'] == 'M') & (aleppo[sym] == 1)])
        AM= {'gender':'M','country':country , 'count': aleppo_alive_males,'status':0, 'symptom': sym}
    
        aleppo_alive_females = len(aleppo.loc[(aleppo['DEATH'] == 0) & (aleppo['GENDER'] == 'F') & (aleppo[sym] == 1)])
        AF= {'gender':'F','country':country , 'count': aleppo_alive_females,'status':0 , 'symptom': sym}
        
        
#        aleppo_alive_both = len(aleppo.loc[(aleppo['DEATH'] == 1) & ((aleppo['GENDER'] == 'F' or aleppo['GENDER'] == 'M')) & (aleppo[sym] == 1)])
        AB= {'gender':'A','country':country , 'count': aleppo_alive_males + aleppo_alive_females,'status':0, 'symptom': sym}
    
        
        new_rows.append(DM)
        new_rows.append(DF)
        new_rows.append(DB)
        
        new_rows.append(AM)
        new_rows.append(AF)
        new_rows.append(AB)

    
     

    print("--------",result)

    return new_rows



    
    
    

    
    

for file in all_files:
    print(file)
    ans=read_data_count(file)
    print(ans[0])
    result = result.append(ans,ignore_index=True)
#    result =result.append(ans[1],ignore_index=True)
#    result =result.append(ans[2],ignore_index=True)
#    result =result.append(ans[3],ignore_index=True)

    
    
    
result.to_csv("counter.csv",index=False)###########edit file name
  
    