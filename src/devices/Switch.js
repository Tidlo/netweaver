import Device from "./Device";

class Switch extends Device {
    constructor() {
        super();
        for (let i = 1; i < 25; i++) {
            this.ports.push({
                name: 'GE 0/0/' + i,
                occupied: false,
                pvid: 1,
                defaultVLAN: 1,
                linkType: 'hybrid',
                allowPass: [],
            })
        }
    }

    setPortAllowPass(portName, allowPass) {
        let port = this.ports.find(port => port.name === portName);
        port.allowPass = [...new Set(port.allowPass.concat(allowPass))];
    }
}

export default Switch;