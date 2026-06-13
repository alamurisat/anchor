// Anchor device firmware
//
// Sends two signals over USB serial (9600 baud) that the Anchor caregiver
// dashboard listens for via the Web Serial API:
//   LOUD_SOUND      - the sound sensor crossed the threshold
//   BUTTON_PRESSED  - the help button was pressed
//
// Wiring assumed here (simplest, no extra resistors):
//   - Sound sensor analog out -> A0
//   - Push button between pin 2 and GND (uses the internal pull-up)
//
// With INPUT_PULLUP the pin reads HIGH when idle and LOW when pressed,
// so a press is the HIGH -> LOW transition.

const int soundPin = A0;
const int buttonPin = 2;

const int soundThreshold = 500;

int lastButtonState = HIGH;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  int soundValue = analogRead(soundPin);
  if (soundValue > soundThreshold) {
    Serial.println("LOUD_SOUND");
    delay(1000);
  }

  int buttonState = digitalRead(buttonPin);
  // Fire once on the press (idle HIGH -> pressed LOW), with a short debounce.
  if (buttonState == LOW && lastButtonState == HIGH) {
    Serial.println("BUTTON_PRESSED");
    delay(50);
  }
  lastButtonState = buttonState;

  delay(100);
}
