function 感測海龜位置 () {
    if (一號運動感應器) {
        Led = true
    } else {
        Led = false
        led.unplot(0, 0)
    }
    if (一號運動感應器 && 二號運動感應器 && 水缸有足夠水) {
        Pump1 = true
    } else {
        Pump1 = false
    }
    if (二號運動感應器 && 水缸有足夠水) {
        Pump2 = true
    } else {
        Pump2 = false
    }
}
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
let 樂園水位過高 = false
let 資訊 = ""
let 命令 = 0
let 二號運動感應器 = false
let 一號運動感應器 = false
let Pump3 = false
let Pump2 = false
let Pump1 = false
let Led = false
let 水缸有足夠水 = false
水缸有足夠水 = false
Led = false
Pump1 = false
Pump2 = false
Pump3 = false
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
MuseIoT.initializeWifi()
radio.setTransmitPower(7)
radio.setGroup(66)
basic.forever(function () {
    資訊 = ""
    水缸有足夠水 = Muse21.ReadInputSensor(AnalogPin.P0) < 350
    樂園水位過高 = Muse21.ReadInputSensor(AnalogPin.P1) < 500
    一號運動感應器 = pins.digitalReadPin(DigitalPin.P2) == 0
    二號運動感應器 = pins.digitalReadPin(DigitalPin.P12) == 0
    感測海龜位置()
    if (樂園水位過高) {
        Pump3 = true
    } else {
        Pump3 = false
    }
    發出命令()
    資訊 = "W" + Muse21.ReadInputSensor(AnalogPin.P0) + "," + Muse21.ReadInputSensor(AnalogPin.P1) + ",A" + pins.digitalReadPin(DigitalPin.P2) + pins.digitalReadPin(DigitalPin.P12) + "C" + 命令
    MuseOLED.writeStringNewLine(資訊)
    basic.pause(2000)
})
