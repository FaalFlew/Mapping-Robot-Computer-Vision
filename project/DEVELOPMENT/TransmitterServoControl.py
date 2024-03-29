import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
servoPin = 11
buttonChannel = 5 

GPIO.setup(servoPin, GPIO.OUT)
GPIO.setup(buttonChannel, GPIO.IN)

pwm = GPIO.PWM(servoPin, 50)
pwm.start(7)

def rotate_servo(desired_position):
    if desired_position < 0 or desired_position > 180:
        print("Error: position must be between 0 and 180 degrees.")
        return
    DC = 1.0 / 18.0 * desired_position + 2
    pwm.ChangeDutyCycle(DC)

try:
    while True:
        # Check if the button is pressed
        if GPIO.input(buttonChannel) == GPIO.HIGH:
            desired_position = float(input("Enter position 0-180 degrees: "))
            rotate_servo(desired_position)

finally:
    pwm.stop()
    GPIO.cleanup()
