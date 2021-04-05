def 感測海龜位置():
    global Led, Pump1, Pump2
    if 一號運動感應器:
        閘門(True)
        Led = True
    else:
        閘門(False)
        Led = False
        led.unplot(0, 0)
    if 一號運動感應器 and 二號運動感應器 and 水缸有足夠水:
        Pump1 = True
    else:
        Pump1 = False
    if 二號運動感應器 and 水缸有足夠水:
        Pump2 = True
    else:
        Pump2 = False
def 發出命令():
    global 命令
    命令 = 0
    if Led:
        命令 += 1
        led.plot(0, 0)
    else:
        led.unplot(0, 0)
    if Pump1:
        命令 += 10
        led.plot(1, 0)
    else:
        led.unplot(1, 0)
    if Pump2:
        命令 += 100
        led.plot(2, 0)
    else:
        led.unplot(2, 0)
    if Pump3:
        命令 += 1000
        led.plot(3, 0)
    else:
        led.unplot(3, 0)
    radio.send_number(命令)
def 閘門(開啟: bool):
    global 閘門已開
    if 閘門已開 != 開啟:
        if 開啟:
            Muse21.control360_servo(Muse21.Servo.SERVO8, Muse21.ServoDirection.ANTICLOCKWISE, 60)
        else:
            Muse21.control360_servo(Muse21.Servo.SERVO8, Muse21.ServoDirection.CLOCKWISE, 60)
        basic.pause(3000)
        Muse21.control360_servo(Muse21.Servo.SERVO8, Muse21.ServoDirection.CLOCKWISE, 0)
        閘門已開 = 開啟
樂園水位過高 = False
資訊 = ""
命令 = 0
二號運動感應器 = False
一號運動感應器 = False
閘門已開 = False
Pump3 = False
Pump2 = False
Pump1 = False
Led = False
水缸有足夠水 = False
水缸有足夠水 = False
Led = False
Pump1 = False
Pump2 = False
Pump3 = False
pins.set_pull(DigitalPin.P2, PinPullMode.PULL_UP)
pins.set_pull(DigitalPin.P12, PinPullMode.PULL_UP)
MuseIoT.initialize_wifi()
radio.set_transmit_power(7)
radio.set_group(66)
閘門已開 = False

def on_forever():
    global 資訊, 水缸有足夠水, 樂園水位過高, 一號運動感應器, 二號運動感應器, Pump3
    資訊 = ""
    水缸有足夠水 = Muse21.read_input_sensor(AnalogPin.P0) < 350
    樂園水位過高 = Muse21.read_input_sensor(AnalogPin.P1) < 500
    一號運動感應器 = pins.digital_read_pin(DigitalPin.P2) == 0
    二號運動感應器 = pins.digital_read_pin(DigitalPin.P12) == 0
    感測海龜位置()
    if 樂園水位過高:
        Pump3 = True
    else:
        Pump3 = False
    發出命令()
    資訊 = "W" + str(Muse21.read_input_sensor(AnalogPin.P0)) + "," + str(Muse21.read_input_sensor(AnalogPin.P1)) + ",A" + str(pins.digital_read_pin(DigitalPin.P2)) + str(pins.digital_read_pin(DigitalPin.P12)) + "C" + str(命令)
    MuseOLED.write_string_new_line(資訊)
    basic.pause(2000)
basic.forever(on_forever)
