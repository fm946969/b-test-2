def 感測海龜位置():
    if pins.digital_read_pin(DigitalPin.P2) == 0:
        發出命令("Led", False)
        if 水缸水位過低:
            發出命令("Pump1", False)
            發出命令("Pump2", False)
        else:
            發出命令("Pump1", True)
            發出命令("Pump2", True)
    else:
        發出命令("Led", True)
        發出命令("Pump1", False)
        發出命令("Pump2", False)
def 發出命令(裝置名稱: str, 是否啟動: bool):
    if 是否啟動:
        radio.send_value(裝置名稱, 255)
    else:
        radio.send_value(裝置名稱, 0)
樂園水位過高 = False
水缸水位過低 = False
當前區域 = 0
水缸水位過低 = False
pins.set_pull(DigitalPin.P2, PinPullMode.PULL_UP)
pins.set_pull(DigitalPin.P12, PinPullMode.PULL_UP)
MuseIoT.initialize_wifi()
radio.set_group(66)

def on_forever():
    global 水缸水位過低, 樂園水位過高
    水缸水位過低 = Muse21.read_input_sensor(AnalogPin.P0) > 350
    樂園水位過高 = Muse21.read_input_sensor(AnalogPin.P1) < 500
    感測海龜位置()
    if 樂園水位過高:
        發出命令("Pump3", True)
    else:
        發出命令("Pump3", False)
basic.forever(on_forever)
