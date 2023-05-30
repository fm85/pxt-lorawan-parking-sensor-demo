function prüfeObParkplatzBesetzt () {
    distanzAuto = grove.measureInCentimetersV2(DigitalPin.P0)
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
    IoTCube.addDigitalInput(datenZumSenden, 1)
    IoTCube.SendBuffer(IoTCube.getCayenne())
    basic.pause(5100)
}
let differenzLichtstärke = 0
let gemesseneLichtstärke = 0
let datenZumSenden = 0
let istParkplatzBesetzt = false
let distanzAuto = 0
IoTCube.LoRa_Join(
eBool.enable,
eBool.enable,
10,
8
)
let gesendeterParkplatzStatus = !(prüfeObParkplatzBesetzt())
let gesendeteLichtstaerke = -100
basic.showIcon(IconNames.Yes)
basic.clearScreen()
basic.forever(function () {
    istParkplatzBesetzt = prüfeObParkplatzBesetzt()
    if (istParkplatzBesetzt != gesendeterParkplatzStatus) {
        music.playTone(262, music.beat(BeatFraction.Whole))
        gesendeterParkplatzStatus = istParkplatzBesetzt
        sendeParkplatzStatusMitLoRaWAN(istParkplatzBesetzt)
    }
    gemesseneLichtstärke = input.lightLevel()
    differenzLichtstärke = Math.abs(gesendeteLichtstaerke - gemesseneLichtstärke)
    if (differenzLichtstärke > 50) {
        music.playTone(523, music.beat(BeatFraction.Whole))
        gesendeteLichtstaerke = gemesseneLichtstärke
        IoTCube.addIlluminance(gesendeteLichtstaerke, 1)
        IoTCube.SendBuffer(IoTCube.getCayenne())
        basic.pause(5000)
    }
    basic.pause(500)
})
