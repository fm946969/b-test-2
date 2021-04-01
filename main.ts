function 感測海龜位置() {
    if (pins.digitalReadPin(DigitalPin.P2) == 0) {
        發出命令("Led", false)
        if (水缸水位過低) {
            發出命令("Pump1", false)
            發出命令("Pump2", false)
        } else {
            發出命令("Pump1", true)
            發出命令("Pump2", true)
        }
        
    } else {
        發出命令("Led", true)
        發出命令("Pump1", false)
        發出命令("Pump2", false)
    }
    
}

function 發出命令(裝置名稱: string, 是否啟動: boolean) {
    if (是否啟動) {
        radio.sendValue(裝置名稱, 255)
    } else {
        radio.sendValue(裝置名稱, 0)
    }
    
}

let 樂園水位過高 = false
let 水缸水位過低 = false
let 當前區域 = 0
水缸水位過低 = false
pins.setPull(DigitalPin.P2, PinPullMode.PullUp)
pins.setPull(DigitalPin.P12, PinPullMode.PullUp)
MuseIoT.initializeWifi()
radio.setGroup(66)
basic.forever(function on_forever() {
    
    水缸水位過低 = Muse21.ReadInputSensor(AnalogPin.P0) > 350
    樂園水位過高 = Muse21.ReadInputSensor(AnalogPin.P1) < 500
    感測海龜位置()
    if (樂園水位過高) {
        發出命令("Pump3", true)
    } else {
        發出命令("Pump3", false)
    }
    
})
