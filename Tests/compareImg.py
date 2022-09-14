# import the necessary packages
from skimage.metrics import structural_similarity as ssim
import matplotlib.pyplot as plt
import numpy as np
import cv2

def mse(imageA, imageB):
	# the 'Mean Squared Error' between the two images is the
	# sum of the squared difference between the two images;
	# NOTE: the two images must have the same dimension
	err = np.sum((imageA.astype("float") - imageB.astype("float")) ** 2)
	err /= float(imageA.shape[0] * imageA.shape[1])
	
	# return the MSE, the lower the error, the more "similar"
	# the two images are
	return err
    
def compare_images(imageA, imageB, title):
	# compute the mean squared error and structural similarity
	# index for the images
	m = mse(imageA, imageB)
	s = ssim(imageA, imageB, channel_axis=2)
	# setup the figure
	fig = plt.figure(title)
	plt.suptitle("MSE: %.2f, SSIM: %.2f" % (m, s))
	# show first image
	ax = fig.add_subplot(1, 2, 1)
	imgplot = plt.imshow(imageA, cmap = plt.cm.gray)
	plt.axis("off")
	# show the second image
	ax = fig.add_subplot(1, 2, 2)
	plt.imshow(imageB, cmap = plt.cm.gray)
	plt.axis("off")
	# show the images
	plt.show()

def test_similarity(imageA, imageB):
	m = mse(imageA, imageB)
	s = ssim(imageA, imageB, channel_axis=2)
	# assert(m < 1 and s >= 0.98)
	return m, s

def print_test_result(testNumber, testName, testResult, aimedMSE, aimedSSIM):
	print("Test " + str(testNumber) + " -- " + testName + " : MSE = " + str(testResult[0]) + " [" + ("OK" if testResult[0] <= aimedMSE else "FAIL" ) + 
	"]; SSIM = " + str(testResult[1]) + " [" + ("OK" if testResult[1] >= aimedSSIM else "FAIL" ) + "]")

# load the images



# Test 0 -- Constant color map (1 color). All channel curves are in the form f(x) = a

# Full Black
refFullBlack = cv2.imread("images/reference_test_0_full_black_600x10.png")
mapFullBlack = cv2.imread("images/map_test_0_full_black_600x10.png")
testResult = test_similarity(refFullBlack, mapFullBlack)
print_test_result(0, "Full Black", testResult, 1, 0.95)

# Full White
refFullWhite = cv2.imread("images/reference_test_0_full_white_600x10.png")
mapFullWhite = cv2.imread("images/map_test_0_full_white_600x10.png")
testResult = test_similarity(refFullWhite, mapFullWhite)
print_test_result(0, "Full White", testResult, 1, 0.95)

# Full Grey
refFullGrey = cv2.imread("images/reference_test_0_full_grey_600x10.png")
mapFullGrey = cv2.imread("images/map_test_0_full_grey_600x10.png")
testResult = test_similarity(refFullGrey, mapFullGrey)
print_test_result(0, "Full Grey", testResult, 1, 0.95)

# Full Red
refFullRed = cv2.imread("images/reference_test_0_full_red_600x10.png")
mapFullRed = cv2.imread("images/map_test_0_full_red_600x10.png")
testResult = test_similarity(refFullRed, mapFullRed)
print_test_result(0, "Full Red", testResult, 1, 0.95)

# Full Green
refFullGreen = cv2.imread("images/reference_test_0_full_green_600x10.png")
mapFullGreen = cv2.imread("images/map_test_0_full_green_600x10.png")
testResult = test_similarity(refFullGreen, mapFullGreen)
print_test_result(0, "Full Green", testResult, 1, 0.95)

# Full Blue
refFullBlue = cv2.imread("images/reference_test_0_full_blue_600x10.png")
mapFullBlue = cv2.imread("images/map_test_0_full_blue_600x10.png")
testResult = test_similarity(refFullBlue, mapFullBlue)
print_test_result(0, "Full Blue", testResult, 1, 0.95)


# Test 1 -- Black to White color map. All channel curves are in the form f(x) = x
refBlackToWhite = cv2.imread("images/reference_test_1_black_to_white_600x10.png")
mapBlackToWhite = cv2.imread("images/map_test_1_black_to_white_600x10.png")
testResult = test_similarity(refBlackToWhite, mapBlackToWhite)
print_test_result(1, "Black To White", testResult, 1, 0.95)

# Test 2 -- Linear curve color map. All channel curves are in the form f(x) = a * x + b
refLinearCurve = cv2.imread("images/reference_test_2_linear_curve_600x10.png")
mapLinearCurve = cv2.imread("images/map_test_2_linear_curve_600x10.png")
testResult = test_similarity(refLinearCurve, mapLinearCurve)
print_test_result(2, "Linear Curve", testResult, 1, 0.95)

# Test 3 -- B-Spline, degree 2, 3 control points
refBSpline3CP = cv2.imread("images/reference_test_3_BSpline_3CP_600x10.png")
mapBSpline3CP = cv2.imread("images/map_test_3_BSpline_3CP_600x10.png")
testResult = test_similarity(refBSpline3CP, mapBSpline3CP)
print_test_result(2, "B-Spline (3 control points)", testResult, 1, 0.95)

# Test 4 -- B-Spline, degree 2, 4 control points
refBSpline4CP = cv2.imread("images/reference_test_4_BSpline_4CP_600x10.png")
mapBSpline4CP = cv2.imread("images/map_test_4_BSpline_4CP_600x10.png")
testResult = test_similarity(refBSpline4CP, mapBSpline4CP)
print_test_result(2, "B-Spline (4 control points)", testResult, 1, 0.95)

# initialize the figure
# fig = plt.figure("Images")
# images = ("A", refBlackToWhite), ("B", mapBlackToWhite), #("C", imgC)
# # loop over the images# compare the images
# compare_images(refBlackToWhite, mapBlackToWhite, "A vs. B")

# for (i, (name, image)) in enumerate(images):
# 	# show the image
# 	ax = fig.add_subplot(1, len(images), i + 1)
# 	ax.set_title(name)
# 	plt.imshow(image, cmap = plt.cm.gray)
# 	plt.axis("off")

# show the figure
# plt.show()
