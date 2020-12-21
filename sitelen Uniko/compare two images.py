# import our stuffz
import cv2 as cv 	# analyse & compare image 
import argparse 	# let -a and -b be in any order

# construct the argument parser and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-a", "--first", required = True,
	help = "image used as a base")
ap.add_argument("-b", "--second", required = True,
	help = "image to compare with")
args = vars(ap.parse_args())
 
# import the images and resize them
img1 = cv.resize(cv.imread(args["first"],0), (300, 300))
img2 = cv.resize(cv.imread(args["second"],0), (300, 300))

# idk make them black and white so u can analyse them
ret, thresh = cv.threshold(img1, 127, 255,0)
ret, thresh2 = cv.threshold(img2, 127, 255,0)

# find their contours or whatever
contours,hierarchy = cv.findContours(thresh,2,1)
cnt1 = contours[0]
contours,hierarchy = cv.findContours(thresh2,2,1)
cnt2 = contours[0]

# then compare them and output their closeness
ret = cv.matchShapes(cnt1,cnt2,1,0.0)
print( ret )

#show images
cv.imshow('base', img1)
cv.imshow('base threshold', thresh)
cv.imshow('compare',img2)
cv.imshow('compare threshold', thresh2)

cv.waitKey(0)
cv.destroyAllWindows()
