function prüfeObParkplatzBesetzt () {
    distanzAuto = smartfeldSensoren.measureInCentimetersV2(DigitalPin.P0)
    if (distanzAuto < 10) {
        istParkplatzBesetzt = true
    } else {
        istParkplatzBesetzt = false
    }
    return istParkplatzBesetzt
}
function sendeParkplatzStatusMitLoRaWAN (parkplatzBesetzt: boolean) {
    if (parkplatzBesetzt) {
        datenZumSenden = 1
    } else {
        datenZumSenden = 0
    }
    if (IoTCube.getStatus(eSTATUS_MASK.JOINED)) {
        IoTCube.addDigitalInput(datenZumSenden, 1)
        IoTCube.SendBuffer(IoTCube.getCayenne())
        basic.pause(2000)
    }
}
let datenZumSenden = 0
let istParkplatzBesetzt = false
let distanzAuto = 0
smartfeldAktoren.displayInit(128, 64)
IoTCube.LoRa_Join(
eBool.enable,
eBool.enable,
10,
8
)
let gesendeterParkplatzStatus = !(prüfeObParkplatzBesetzt())
let gesendeteLichtstaerke = -100
basic.showIcon(IconNames.Pitchfork)
smartfeldAktoren.displayWriteStrNewLine("IoT cube ready!")
basic.forever(function () {
    istParkplatzBesetzt = prüfeObParkplatzBesetzt()
    if (istParkplatzBesetzt != gesendeterParkplatzStatus) {
        music.playTone(262, music.beat(BeatFraction.Whole))
        gesendeterParkplatzStatus = istParkplatzBesetzt
        sendeParkplatzStatusMitLoRaWAN(istParkplatzBesetzt)
    }
    basic.pause(500)
})
