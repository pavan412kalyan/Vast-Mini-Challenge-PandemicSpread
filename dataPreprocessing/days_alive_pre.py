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


#
#
#df = pd.read_csv(r"dataset/aleppo.csv")
#country=df.copy(deep='True')
#
#
#
#for i in range(0,9) :
#    print(i)
#    count_i = country.loc[(country['DAYS_ALIVE'] == i)]
#    print(len(count_i))
#



column_names = ["country","day1", "day2", "day3","day4","day5","day6","day7","day8", "day9","gender"]

days_count_viz = pd.DataFrame(columns = column_names)



for file in all_files:
    country_df = pd.read_csv(r"dataset/"+file)
    country=file[:-4]
    print(country)
    days=[]
    for i in range(1,10) :
        print(i)
        count_i = country_df.loc[(country_df['DAYS_ALIVE'] == i) & (country_df['GENDER'] == 'F')]
        y=len(count_i)
        days.append(y)
        print(y)
#   
        
    new_row = {'country':country, "day1": days[0],"day2": days[1],"day3": days[2],
               "day4": days[3],"day5": days[4],"day6": days[5],"day7": days[6],
               "day8": days[7],"day9": days[8],"gender" : 'F'}
    days_count_viz = days_count_viz.append(new_row, ignore_index=True)    
    
    
    
days_count_viz.to_csv('days_count_data.csv', index=False) 
        
        
    





