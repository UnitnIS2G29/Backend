import csv
import os

with open('issues.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    last_name = ""
    last_description = ""
    for row in csv_reader:
        if "Sviluppo UI" not in row[2]:
            if(row[0] != ""):
                last_name = row[0]
                last_description = row[1]
            elif(row[0] == ""):
                row[0] = last_name
                row[1] = last_description

            os.system(f'gh issue create -p Backend -t "UserStory: {row[0]} - {row[2]}" -b "{row[1]}"')
            line_count += 1
    print(f'Processed {line_count} lines.')


