#include <Wire.h>
#include <MPU6050.h>

MPU6050 mpu;

float RateYaw;
float YawAngle = 0;

unsigned long prevTime = 0;

void gyro_signals(void) {
  // switch on the low pass filter
  Wire.beginTransmission(0x68);
  Wire.write(0X1A);
  Wire.write(0x05);
  Wire.endTransmission();

  // set the sensitivity scale factor
  Wire.beginTransmission(0x68);
  Wire.write(0x1B);
  Wire.write(0x08); // set full scale range to +/- 500 degrees per second
  Wire.endTransmission();

  //access registers storing gyro measurements
  Wire.beginTransmission(0x68);
  Wire.write(0x43);
  Wire.endTransmission();

  Wire.requestFrom(0x68, 6);


  int16_t GyroZ = Wire.read() << 8 | Wire.read(); // Read gyro around the Z axis


  RateYaw = (float)GyroZ / 65.5;
}

void setup() {
  Serial.begin(57600);
  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
  Wire.setClock(400000);
  Wire.begin();
  delay(250);
  Wire.beginTransmission(0x68);
  Wire.write(0x6B);
  Wire.write(0x00);
  Wire.endTransmission();
}

void loop() {
  gyro_signals();

  unsigned long currentTime = millis(); 
  float elapsedTime = (currentTime - prevTime) / 1000.0;
  prevTime = currentTime; // update previous time

  YawAngle += RateYaw * elapsedTime; // integrate the yaw rate to obtain yaw angle

  // yaw angle stays within 0 to 360 degrees
  if (YawAngle < 0) {
    YawAngle += 360;
  }
  else if (YawAngle >= 360) {
    YawAngle -= 360;
  }

  Serial.print(" Yaw Angle [°]= ");
  Serial.println(YawAngle);
  delay(1000);
}