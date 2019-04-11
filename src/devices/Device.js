class Device {
    constructor() {
        this.ports = [];
    }

    occupyPort(portName) {
        this.ports.find(port => port.name === portName).occupied = true;
    }
}

export default Device;