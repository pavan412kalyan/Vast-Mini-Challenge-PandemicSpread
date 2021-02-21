# -*- coding: utf-8 -*-


#import numpy as np 
#import pandas as pd 
#from mlxtend.frequent_patterns import apriori, association_rules 
#
#
#total_df = pd.read_csv(r"preprocessed/updatedmerged.csv")
#
##total = total_df.iloc[:,:]
#
#allcountries=total_df.copy(deep='True')
#
#
##df.loc[(df['column_name'] >= A) & (df['column_name'] <= B)]
#
#removecolumns =['AGE', 'DATE', 'DATE_OF_DEATH', 'DAYS_ALIVE', 'DEATH', 'GENDER','country','PATIENT_ID']
#allcountries.drop(removecolumns, axis=1, inplace=True)
#
#
#
#x=allcountries.iloc[1:1000000,:]
#
#
#frq_items = apriori(x, min_support = 0.0045, use_colnames = True) 
## Collecting the inferred rules in a dataframe 
#rules = association_rules(frq_items, metric ="lift", min_threshold = 1) 
#rules = rules.sort_values(['confidence', 'lift'], ascending =[False, False]) 
#print(rules.head()) 
#

#############################################################################

import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules 


onehotcolumns =['Heart Problems', 'Vocal Problems', 'abdominal pain', 'abscess', 'bleeding', 'body pain', 
 'breathing', 'chest', 'cough', 'cramp', 'deficit', 'diabetic', 'diarrhea', 'dizziness',
 'fatigue', 'fever', 'headache', 'infections', 'injury', 'laceration', 'migraine', 'others', 'pregnant', 'rash',
 'urinate', 'vaginal', 'vision', 'vomiting']


#####################################################################
##aleppo data
def myapriori(dataframe) :

    frq_items = apriori(dataframe[onehotcolumns], min_support = 0.0045, use_colnames = True) 
    # Collecting the inferred rules in a dataframe 
    rules = association_rules(frq_items, metric ="lift", min_threshold = 1) 
    rules = rules.sort_values(['confidence', 'lift'], ascending =[False, False]) 
    print(rules.iloc[0:5,:]) 
    return rules.iloc[0:3,:]









def generate_output(apriori_result,gender,death,country):
    
    
    ##create data frames
    result = pd.DataFrame()
    for col in onehotcolumns :
        result[col]=[0]*len(apriori_result)
    result['GENDER']=[0]*len(apriori_result)
    result['DEATH']=[0]*len(apriori_result)
    result['country']=[country]*len(apriori_result)

    
    for col in apriori_result.columns :
        result[col]=[0.0]*len(apriori_result)
    
      
    i=0
    for index, row in apriori_result.iterrows():   
        print(row)
        result['GENDER'][i]=gender
        result['DEATH'][i]=death
#        result['antecedents'][i]=row['antecedents']
#        result['consequents'][i]=row['consequents']
#        print("--",row['support'])
        result['support'][i]=row['support']

        result['confidence'][i]=row['confidence']
        result['lift'][i]=row['lift']
        
        result['conviction'][i]=row['conviction']
        result['leverage'][i]=row['leverage']


        
        result['antecedent support'][i]=row['antecedent support']
        result['consequent support'][i]=row['consequent support']

        
        
        
        for col in onehotcolumns :
            if col in row.antecedents : 
                result[col][i]=1
      

#                print(col)
        for col in onehotcolumns :
            if col in row.consequents : 
                result[col][i]=-1
        
        
        i=i+1    
            
    result.drop(['antecedents','consequents'], axis=1, inplace=True)

    return result    




def read_data_apriori(filename) : 
    
    #    aleppo=pd.read_csv(r"aleppo.csv")
    
    country=filename[:-4]
    aleppo=pd.read_csv("dataset/"+filename)
    aleppo = aleppo.sample(frac=1).reset_index(drop=True)
    aleppo=aleppo.iloc[0:6000000]
#    print(len(df))
#    aleppo=df

    
    aleppo.drop([ 'DATE', 'DATE_OF_DEATH','PATIENT_ID'], axis=1, inplace=True)
        
        #df.loc[(df['column_name'] >= A) & (df['column_name'] <= B)]
    aleppo=aleppo #all   
    aleppo_males = aleppo.loc[(aleppo['GENDER'] == 'M')]
    aleppo_females = aleppo.loc[(aleppo['GENDER'] == 'F')]
    aleppo_death = aleppo.loc[(aleppo['DEATH'] == 1)]
    aleppo_death_males = aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'M')]
    aleppo_death_females = aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'F')]
        
    
    aleppo_result= myapriori(aleppo)   
    aleppo_males_result = myapriori(aleppo_males)
    aleppo_females_result = myapriori(aleppo_females)
    aleppo_death_result = myapriori(aleppo_death)
    aleppo_death_males_result = myapriori(aleppo_death_males)
    aleppo_death_females_result=myapriori(aleppo_death_females)
    
    ###########################################
    df1 =generate_output(aleppo_result,'A',0,country)
    df2 =generate_output(aleppo_males_result,'M',0,country)
    df3=generate_output(aleppo_females_result,'F',0,country)
    df4=generate_output(aleppo_death_result,'A',1,country)
    df5=generate_output(aleppo_death_males_result,'M',1,country)
    df6=generate_output(aleppo_death_females_result,'F',1,country)

    return pd.concat([df1, df2,df3,df4,df5,df6])
    
    
all_files = [
#  'aleppo.csv',
# 'colombia.csv',
# 'iran.csv',
# 'karachi.csv',
# 'lebanon.csv',
# 'nairobi.csv',
# 'saudiarabia.csv',
# 'thailand.csv',
# 'turkey.csv',
# 'venezuela.csv',
 'yemen.csv']


for file in all_files:
#    read_data_apriori('aleppo.csv')
#    file='iran.csv'
    print(file)
    ans=read_data_apriori(file)
    ans.to_csv("apriori_"+file,index=False)###########edit file name























#
#
#aleppo=pd.read_csv(r"aleppo.csv")
#aleppo.drop([ 'DATE', 'DATE_OF_DEATH','PATIENT_ID'], axis=1, inplace=True)
#
##df.loc[(df['column_name'] >= A) & (df['column_name'] <= B)]
#
#aleppo_males = aleppo.loc[(aleppo['GENDER'] == 'M')]
#aleppo_females = aleppo.loc[(aleppo['GENDER'] == 'F')]
#aleppo_death = aleppo.loc[(aleppo['DEATH'] == 1)]
#aleppo_death_males = aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'M')]
#aleppo_death_females = aleppo.loc[(aleppo['DEATH'] == 1) & (aleppo['GENDER'] == 'F')]
#
#
#
#
#    
#
#aleppo_males_result = myapriori(aleppo_males)
#aleppo_females_result = myapriori(aleppo_females)
#aleppo_death_result = myapriori(aleppo_death)
#aleppo_death_males_result = myapriori(aleppo_death_males)
#aleppo_death_females_result=myapriori(aleppo_death_females)
#
#
#
#
#
