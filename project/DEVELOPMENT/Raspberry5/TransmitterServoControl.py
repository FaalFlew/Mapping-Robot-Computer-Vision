from gpiozero import Servo
from time import sleep

myGPIO = 17

min_pulse_width = 0.5 / 1000
max_pulse_width = 2.5 / 1000  

servo = Servo(myGPIO, min_pulse_width=min_pulse_width, max_pulse_width=max_pulse_width)

try:
    while True:
        # Move the servo from -1.0 to +1.0
        print("Moving servo from -1.0 to +1.0")
        for value in range(-10, 11):
            servo.value = value / 10
            print(servo.value)
            sleep(0.5)

        # Move the servo from +1.0 to -1.0
        print("Moving servo from +1.0 to -1.0")
        for value in range(10, -11, -1):
            servo.value = value / 10
            print(servo.value)
            sleep(0.5)

except KeyboardInterrupt:
    servo.detach()  
    print("\nTerminated: GPIO pin released.")