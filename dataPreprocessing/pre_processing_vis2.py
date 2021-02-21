import pandas as pd 

# you mf, don't run again and again 
data = pd.read_csv(r'D:/Graduation Courses/Semester 2/DV/Project/Preprocessed Data/UpdatedMergedData/updatedmerged.csv')
# run from here

col = data.columns

symptoms = [col[6]]+list(col[8:16])+list(col[17:])

frames = {}

for i in symptoms:
    df = data[:][[col[0],col[4],col[5],i]]
    df = df.loc[df[i]==1]
    df['AGE_Range'] = 'R'
    df.loc[df["AGE"]<30,'AGE_Range'] = 'R1'
    df.loc[(df["AGE"]>=30) & (df["AGE"]<=60),'AGE_Range'] = 'R2'
    df.loc[df["AGE"]>60,'AGE_Range'] = 'R3'
    df.drop('AGE',axis=1,inplace=True)
    frames[i] = df
    

result = {}

for i in symptoms:
    kf = frames[i].groupby(["GENDER", "DEATH","AGE_Range"])[i].count().reset_index(name="count")
    kf["Symptom"] = i
    result[i] = kf

file_name =  r'D:/Graduation Courses/Semester 2/DV/Project/Viz 2/preprocessed_data.csv'
k = 0
for i in symptoms:
    #print(result[i])
    if k==0: result[i].to_csv(file_name, sep=',', encoding='utf-8',mode='a',index=False)
    else: result[i].to_csv(file_name, sep=',', encoding='utf-8',mode='a',header=False,index=False)
    k += 1
        