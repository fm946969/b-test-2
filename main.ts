function 感測海龜位置 () {
    閘門(一號運動感應器)
    Led = 一號運動感應器
    Pump1 = 一號運動感應器 && 二號運動感應器 && 水缸有足夠水
    Pump2 = 二號運動感應器 && 水缸有足夠水 && !(Pump1)
}
input.onButtonPressed(Button.A, function () {
    door_spd = 75 - door_spd
    led.plotBrightness(2, 2, Math.map(door_spd, 0, 75, 0, 255))
})
function 發出命令 () {
    命令 = 0
    if (Led) {
        命令 += 1
        led.plot(0, 0)
    } else {
        led.unplot(0, 0)
    }
    if (Pump1) {
        命令 += 10
        led.plot(1, 0)
    } else {
        led.unplot(1, 0)
    }
    if (Pump2) {
        命令 += 100
        led.plot(2, 0)
    } else {
        led.unplot(2, 0)
    }
    if (Pump3) {
        命令 += 1000
        led.plot(3, 0)
    } else {
        led.unplot(3, 0)
    }
    radio.sendNumber(命令)
}
function 閘門 (開啟: boolean) {
    if (閘門已開 != 開啟) {
        if (開啟) {
            led.plot(0, 4)
            Muse21.control360Servo(Muse21.Servo.Servo8, Muse21.ServoDirection.clockwise, door_spd)
            basic.pause(4250)
        } else {
            led.plot(4, 4)
            Muse21.control360Servo(Muse21.Servo.Servo8, Muse21.ServoDirection.anticlockwise, door_spd)
            basic.pause(3500)
        }
        led.unplot(0, 4)
        led.unplot(4, 4)
        Muse21.control360Servo(Muse21.Servo.Servo8, Muse21.ServoDirection.clockwise, 0)
        閘門已開 = 開啟
    }
}
let 樂園水位過高 = false
let 資訊 = ""
let 命令 = 0
let 二號運動感應器 = false
let 一號運動感應器 = false
let door_spd = 0
let 閘門已開 = false
let Pump3 = false
let Pump2 = false
let Pump1 = false
let Led = false
let 水缸有足夠水 = false
MuseIoT.initializeWifi()
basic.pause(5000)
radio.setTransmitPower(7)
radio.setGroup(66)
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
水缸有足夠水 = false
Led = false
Pump1 = false
Pump2 = false
Pump3 = false
閘門已開 = false
door_spd = 75
led.plot(2, 2)
basic.forever(function () {
    資訊 = ""
    水缸有足夠水 = Muse21.ReadInputSensor(AnalogPin.P0) < 700
    樂園水位過高 = Muse21.ReadInputSensor(AnalogPin.P1) < 400
    一號運動感應器 = pins.digitalReadPin(DigitalPin.P2) == 0
    二號運動感應器 = pins.digitalReadPin(DigitalPin.P12) == 0
    感測海龜位置()
    Pump3 = 樂園水位過高
    發出命令()
    資訊 = "W" + Muse21.ReadInputSensor(AnalogPin.P0) + "," + Muse21.ReadInputSensor(AnalogPin.P1) + ",A" + pins.digitalReadPin(DigitalPin.P2) + pins.digitalReadPin(DigitalPin.P12) + "C" + 命令
    MuseOLED.writeStringNewLine(資訊)
    basic.pause(2000)
})
