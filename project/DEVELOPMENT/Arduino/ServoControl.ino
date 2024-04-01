#include <Servo.h>

const int servoPin = 9;
Servo servo;

void setup() {
  servo.attach(servoPin);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Enter angle");
  
  while (!Serial.available()) {}
  int desiredAngle = Serial.parseInt();
  desiredAngle = constrain(desiredAngle, 0, 180);
  servo.write(desiredAngle);
  delay(500);
  
  while (Serial.available()) {
    Serial.read();
  }
}
