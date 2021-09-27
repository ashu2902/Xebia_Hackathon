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
        'min_area_motion_contour': 500, '''''''area given to detect motion'''
        'park_laplacian_th': 2.8,
        'park_sec_to_wait': 1, '''4  wait time for changing the status of a region'''
        'start_frame': 0, '''begin frame from specific frame number'''
        'show_ids': True,  '''shows id on each region'''
        'classifier_used': True,
        'save_video': False
        }
