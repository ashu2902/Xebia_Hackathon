import yaml
import numpy as np
import cv2

'''path references'''
fn = "testvideo_01.mp4" #3
'''fn = "datasets\parkinglot_1_720p.mp4" '''
'''#fn = "datasets\street_high_360p.mp4" '''
fn_yaml = "yml_01.yml"
fn_out =  "outputvideo_01.avi"
cascade_src = 'classifier_02.xml'
car_cascade = cv2.CascadeClassifier(cascade_src)
global_str = "Last change at: "
change_pos = 0.00
dict =  {
        'text_overlay': True,
        'parking_overlay': True,
        'parking_id_overlay': True,
        'parking_detection': True,
        'motion_detection': True,
        'pedestrian_detection': False, '''takes a lot of processing power'''
        'min_area_motion_contour': 500, '''area given to detect motion'''
        'park_laplacian_th': 2.8,
        'park_sec_to_wait': 1, '''4  wait time for changing the status of a region'''
        'start_frame': 0, '''begin frame from specific frame number'''
        'show_ids': True,  '''shows id on each region'''
        'classifier_used': True,
        'save_video': False
        }

'''Set from video'''
cap = cv2.VideoCapture(fn)
video_info = {'fps': cap.get(cv2.CAP_PROP_FPS),
              'width': int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) * 0.6),
              'height': int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) * 0.6),
              'fourcc': cap.get(cv2.CAP_PROP_FOURCC),
              'num_of_frames': int(cap.get(cv2.CAP_PROP_FRAME_COUNT))}

cap.set(cv2.CAP_PROP_POS_FRAMES, dict['start_frame'])
'''jump to frame number specified'''


def run_classifier(img, id):
        '''gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)'''
        cars = car_cascade.detectMultiScale(img, 1.1, 1)
        if cars == ():
                return False
        else:
                '''parking_status[id] = False'''
                return True


'''Define the codec and create VideoWriter object'''
if dict['save_video']:
        '''options: ('P','I','M','1'), ('D','I','V','X'), ('M','J','P','G'), ('X','V','I','D')'''
        fourcc = cv2.VideoWriter_fourcc('X', 'V', 'I','D')
        out = cv2.VideoWriter(fn_out, -1, 25.0, (video_info['width'], video_info['height']))

'''initialize the HOG descriptor/person detector. It takes a lot of processing power'''
if dict['pedestrian_detection']:
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

        '''Use Background subtraction'''
if dict['motion_detection']:
        fgbg = cv2.createBackgroundSubtractorMOG2(history=300, varThreshold=16, detectShadows=True)

'''Read YAML data (parking space polygons)'''
with open(fn_yaml, 'r') as stream:
        parking_data = yaml.load(stream)
parking_contours = []
parking_bounding_rects = []
parking_mask = []
parking_data_motion = []
if parking_data != None:
        for park in parking_data:
                points = np.array(park['points'])
                rect = cv2.boundingRect(points)
                points_shifted = points.copy()

                '''shift contour to region of interest'''
                points_shifted[:, 0] = points[:, 0] - rect[0]

                points_shifted[:, 1] = points[:, 1] - rect[1]
                parking_contours.append(points)
                parking_bounding_rects.append(rect)
                mask = cv2.drawContours(np.zeros((rect[3], rect[2]), dtype=np.uint8), [points_shifted], contourIdx=-1,
                                        color=255, thickness=-1, lineType=cv2.LINE_8)
                mask = mask == 255
                parking_mask.append(mask)

'''morphological kernel'''
kernel_erode = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
kernel_dilate = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 19))
if parking_data != None:
        parking_status = [False] * len(parking_data)
        parking_buffer = [None] * len(parking_data)


'''bw = ()'''
def print_parkIDs(park, coor_points, frame_rev):
        moments = cv2.moments(coor_points)
        centroid = (int(moments['m10'] / moments['m00']) - 3, int(moments['m01'] / moments['m00']) + 3)
        '''putting numbers on marked regions'''
        cv2.putText(frame_rev, str(park['id']), (centroid[0] + 1, centroid[1] + 1), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(frame_rev, str(park['id']), (centroid[0] - 1, centroid[1] - 1), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(frame_rev, str(park['id']), (centroid[0] + 1, centroid[1] - 1), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(frame_rev, str(park['id']), (centroid[0] - 1, centroid[1] + 1), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                    (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(frame_rev, str(park['id']), centroid, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)


while (cap.isOpened()):
        '''Current position of the video file in seconds'''
        video_cur_pos = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
        '''Index of the frame to be decoded/captured next'''
        video_cur_frame = cap.get(cv2.CAP_PROP_POS_FRAMES)
        ret, frame_initial = cap.read()
        if ret == True:
                frame = cv2.resize(frame_initial, None, fx=0.6, fy=0.6)
        if ret == False:
                print("Video ended")
                break

