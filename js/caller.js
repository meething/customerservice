var peers = ['https://livecodestream-eu.herokuapp.com/gun'];
var opt = { peers: peers, localStorage: false, radisk: false };
const gun = Gun(opt);

let STATE = "IDLE"
switchButton();

if (sessionStorage.getItem("pid") == null) {
    sessionStorage.setItem("pid", gun._.opt.pid)
}

function callOwner(event) {
    if (STATE == "IDLE") {
        STATE = "RINGING"
        gun.get(window.location.hostname).put({ id: sessionStorage.getItem("pid"), action: "call" });
    } else {
        STATE = "IDLE"
        gun.get(window.location.hostname).put({ id: sessionStorage.getItem("pid"), action: "hangup" });
    }
    switchButton()
}

function switchButton() {
    let button = document.getElementById("call_button");
    try {
        document.getElementById("state").innerText = STATE;
        switch (STATE) {
            case "RINGING":
                // code block
                button.classList.remove("busy");
                button.classList.add("ringing");
                break;
            case "CALLING":
                button.classList.remove("ringing");
                button.classList.add("busy");
                break;
            case "IDLE":
            default:
                button.classList.remove("ringing");
                button.classList.remove("busy");
                break;
        }
    } catch (e) {
        console.log("Something went wrong setting buttons state");
    }
}

gun.get(window.location.hostname).on(function (data, key) {
    if (sessionStorage.getItem("pid") !== data.id) return;

    if (data.action == "answer") {
        STATE = "CALLING";
        switchButton();
        console.log("Answering go to Meething")
    }

    if (data.action == "reject") {
        STATE = "IDLE";
        switchButton();
        console.log("Rejected show notification")
    }

}, true);
