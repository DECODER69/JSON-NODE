from time import time
import cv2, pandas
import requests
from datetime import datetime


first_frame = None
status_list = [None,None]
times = []
df=pandas.DataFrame(columns=["Start","End"])

video = cv2.VideoCapture(0)
print('PROGRAM IS RUNNING!!!')

class send_payload:
    def __init__(self):
        self.payload_insert = {"id":'',"start":'',"end":''}

obj_send_payload = send_payload()
while True:
    check, frame = video.read()
    status = 0
    gray = cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray,(21,21),0)


    if first_frame is None:
        first_frame=gray
        continue
    delta_frame=cv2.absdiff(first_frame,gray)#calculates the absolute difference between current frame and reference frame
    thresh_frame=cv2.threshold(delta_frame, 30, 255, cv2.THRESH_BINARY)[1]
    thresh_frame=cv2.dilate(thresh_frame, None, iterations=2)

    (cnts,_)=cv2.findContours(thresh_frame.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    for contour in cnts:
        if cv2.contourArea(contour) < 10000: #excluding too small contours. Set 10000 (100x100 pixels) for objects close to camera
            continue
        status=1

        (x, y, w, h)=cv2.boundingRect(contour)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0,255,0), 3)
    status_list.append(status)
    # print(status)

    status_list=status_list[-2:]
   


    if status_list[-1]==1 and status_list[-2]==0:
        times.append(datetime.now())
        print(times)
    if status_list[-1]==0 and status_list[-2]==1:
        times.append(datetime.now())
        print(times)
        
        
      
 
        
        
    


    # cv2.imshow("Gray Frame",gray)
    # cv2.imshow("Delta Frame",delta_frame)
    # cv2.imshow("Threshold Frame",thresh_frame)
    cv2.imshow("Color Frame",frame)
    # print(status)

    key=cv2.waitKey(1)

    #PRESS 'p' TO SAVE
    if key == ord('q'):
        if status == 1:
            times.append(datetime.now())
        
          
        break

for i in range(0, len(times), 2):
    df = df.append({"Start": times[i],"End": times[i+1]}, ignore_index=True)
    start = (times[i])
    end = (times[i+1])
    print(status_list)
    print(times)
    print(start)
    print(end)
    obj_send_payload.payload_insert["start"] = str(start)
    obj_send_payload.payload_insert["end"] = str(end)
    check = requests.post('http://localhost:2022/connection',json=obj_send_payload.payload_insert)
    print(check.text)
    send_payload()
  

video.release()
cv2.destroyAllWindows