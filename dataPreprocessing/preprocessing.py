# -*- coding: utf-8 -*-

import pandas as pd


#dataset = pd.read_csv(r"dataset/Aleppo.csv")
#datasetDeaths = pd.read_csv(r"dataset/Aleppo-deaths.csv")


dataset = pd.read_csv(r"dataset/Karachi.csv")
datasetDeaths = pd.read_csv(r"dataset/Karachi-deaths.csv")



#
#merged = pd.read_csv(r"dataset/merged.csv")
#
#
#merged.iloc[14543598][:]

########################### CREATE DEATH DICTIONARY
death_data={}
def creatDict(row) :
    death_data[row['ID']]=row['DATE_OF_DEATH']
#    print("--",row)

datasetDeaths.apply(creatDict,axis=1)
    
##########################################


#SYN_ALP =ALP[:]['SYNDROME']

dfpart1 = dataset.iloc[:,:]
df_alp=dfpart1.copy(deep='True')

#df_alp['SYM']=[[]]*len(df_alp)



df_alp['country']=["karachi"]*len(df_alp)#### set country name





df_alp['SYM_GROUP']=[[]]*len(df_alp)
df_alp['DEATH']=[0]*len(df_alp)
df_alp['DATE_OF_DEATH']=["0-0-0"]*len(df_alp)
df_alp['DAYS_ALIVE']=["0-0-0"]*len(df_alp)







###########################################



#set_symp = set()


spellings ={"ache":"ache",       
 "abcess":"abscess",
"abd":"abdomen",
"abdomen":"abdomen",
"abdominal":"abdomen",
"abdmnal":"abdomen",
"abdback":"abdomen",
"ankle":"ankle",
"assaulted":"assault",
"assult":"assault",
"bleeds":"bleeding",
"blood":"bleeding",
"bleed":"bleeding",
"blurry":"blurred",
"blurried":"blurred",
"cough":"cough",
"cardiac":"heart",
"card":"heart",
"cardio":"card",
"defecit":"deficit",
"difficulties":"difficulty",
"diff":"difficulty",
"disturbance":"disturb",
"disturbancies":"disturb",
"heart":"heart",
"dizzy":"dizzy",
"dizziness":"dizzy",
"elev":"elevated",
"eval":"evaluation",
"facial":"face",
"fever":"fever",
"gen":"general",
"generalized":"general",
"giddiness":"dizzy",
"handwrist":"handwrist",
"headache":"headache",
"headaches":"headache",
"inj":"injury",
"lac":"laceration",
"l":"left",
"lt":"left",
"med":"medical",
"migrane":"migraine",
"migrain":"migraine",
"neckback":"neck",
"neck":"neck",
"nec":"neck",
"nos":"nose",
"pain":"pain",
"poss":"possible",
"pregnant":"preg",
"pregnancy":"preg",
"r":"right",
"rt":"right",
"respiratory":"resp",
"speach":"speech",
"urinary":"urinate",
"urinates":"urinate",
"urination":"urinate",
"urinating":"urinate",
"vag":"vaginal",
"visual":"vision",
"vomit":"vomiting",
"vomting":"vomiting",
"vomitting":"vomiting",
"vomiting":"vomiting",
"winjury":"winjury",
"sinusitis":"sinus",
"head":"ache",
"injury":"inj",
"ears":"ear",
"ear":"ear"


}
 
 ######################################
correction_KV =list(spellings.values())

def checkSpelling(word) :
    if word in spellings:
        return spellings[word]
    else : 
            for w in correction_KV :
                if w in word :
                    return w
            

    return word


########################################

groups = {"ab":"abdominal pain",
"abdmnal":"abdominal pain",
"abdomen":"abdominal pain",
"adb":"abdominal pain",
"adbback":"abdominal pain",
"addominal":"abdominal pain",
"abdominal":"abdominal pain",
"genital":"abdominal pain",
"abscess":"abscess",
"abcess":"abscess",
"accident":"injury",
"assault":"injury",
"bite":"injury",
"assaulted":"injury",
"inj":"injury",
"bleeding":"bleeding",
"bled":"bleeding",
"bleed":"bleeding",
"bleeds":"bleeding",
"blood":"bleeding",
"epistaxis":"bleeding",
"nosebleed":"bleeding",
"ear" : "body pain",
"ache":"body pain",
"ankle":"body pain",
"hurts":"body pain",
"leg":"body pain",
"neck":"body pain",
"pain":"body pain",
"pn":"body pain",
"stomach":"body pain",
"asthama":"breathing",
"breathing":"breathing",
"breath":"breathing",
"resp":"breathing",
"respira":"breathing",
"wheezing":"breathing",
"chest":"chest",
"cold":"cough",
"cough":"cough",
"sinu":"cough",
"sinus":"cough",
"sore":"cough",
"cramp":"cramp",
"cramping":"cramp",
"defecit":"deficit",
"diab":"diabetic",
"diarr":"diarrhea",
"diarrhea":"diarrhea",

"gastro":"diarrhea",
"stool":"diarrhea",
"dizz":"dizziness",
"giddiness":"dizziness",
"vertigo":"dizziness",
"dizziness":"dizziness",
"dizzy":"dizziness",
"fatigue":"fatigue",
"letharg":"fatigue",
"lighthead":"fatigue",
"seizure":"fatigue",
"weak":"fatigue",
"fever":"fever",
"febril":"fever",
"ill":"fever",
"temp":"fever",
"headache":"headache",
"head":"headache",
"headaches":"headache",
"allerg":"infections",
"allergy":"infections",
"infections":"infections",

"lac":"laceration",
"migraine":"migraine",
"migrain":"migraine",
"migrane":"migraine",
"contraction":"pregnant",
"csection":"pregnant",
"preg":"pregnant",
"labor":"pregnant",
"miscarria":"pregnant",
"pregnancy":"pregnant",
"pregnant":"pregnant",
"spotting":"pregnant",
"itch":"rash",
"rash":"rash",
"skin":"rash",
"eczema":"rash",
"hives":"rash",
"urinate":"urinate",
"urin":"urinate",
"urinates":"urinate",
"urinating":"urinate",
"urine":"urinate",
"vag":"vaginal",
"vaginal":"vaginal",
"blur":"vision",
"obscur":"vision",
"blurred":"vision",
"blurried":"vision",
"blurry":"vision",
"eye":"vision",
"visio":"vision",
"vision":"vision",
"visual":"vision",
"vom":"vomiting",
"vomiting":"vomiting",
"nausea":"vomiting",
"vomit":"vomiting",
"diabetic":"diabetic",
"injury":"injury",
"heart":"Heart Problems",
"laceration":"laceration",
"nose":"cough",
"speech":"Vocal Problems",
"others":"others"

}
        
        
        
        
 ################################  Create empty new colums with group name     
for sym in set(groups.values()) :
    df_alp[sym]=[0]*len(df_alp)

#####################################################



def checkGroup(word) :
    if word in groups :
        return groups[word]
    
    else :
        return "others"
    

 
def change_df(syndrome,check) :
#    sym=row['SYNDROME']
    sym=syndrome
    sym=sym.replace(',',' ')
    sym=sym.replace('"',' ')
    sym=sym.replace('.',' ')
    sym=sym.lower()
    symp=sym.split()
    
    SYM_CORRECT=[]
    SYM_GROUP=set()
    for word in symp :
        z=checkSpelling(word)
#        print(z)
        SYM_CORRECT.append(z) 
        
        g=checkGroup(z)
        SYM_GROUP.add(g)
    
    if(len(SYM_GROUP)>1 and "others" in SYM_GROUP) :
        SYM_GROUP.remove("others")
    
    if check =="group" :
        return list(SYM_GROUP)
    elif check=="sym" :     
        return SYM_CORRECT 
    elif check in SYM_GROUP :
        return 1
    else :
        return 0
    
    

    
def change_death(row,check)  :
    pid=row['PATIENT_ID']
    if check=="death" :
        if pid in death_data :
            return 1
        else :
            return 0
    if check=="death_date" :
        if pid in death_data :
            return death_data[pid]
        else :
            return "0-0-0"    

 
from datetime import date
def noOfDays(row,check) :
    pid=row['PATIENT_ID']
    
    if pid in death_data :
        start =row['DATE']
        end = death_data[pid]
        s=start.split('-')
        e=end.split('-')

        f_date = date(int(s[2]), int(s[0]), int(s[1]))
        l_date = date(int(e[2]), int(e[0]), int(e[1]))
        delta = l_date - f_date
        return delta.days
        
    return 0


    
###################################################################    
df_alp['SYM_GROUP']= df_alp['SYNDROME'].apply(change_df,check="group")
#df_alp['SYM']= df_alp['SYNDROME'].apply(change_df,check="sym")
df_alp['DEATH']= df_alp.apply(change_death,check="death",axis=1)
df_alp['DATE_OF_DEATH']= df_alp.apply(change_death,check="death_date",axis=1)

df_alp['DAYS_ALIVE']= df_alp.apply(noOfDays,check="",axis=1)





for sym in set(groups.values()) :
    print("loading..."+sym)
    df_alp[sym]= df_alp['SYNDROME'].apply(change_df,check=sym)

 




df_alp = df_alp.drop('USER_WARNING', 1)
df_alp = df_alp.drop('SYM_GROUP', 1)
df_alp = df_alp.drop('SYNDROME', 1)



#
df_alp.to_csv("karachi.csv",index=False)###########edit file name
#
#


y=df_alp.iloc[1:10,:]


#################################################################################################
