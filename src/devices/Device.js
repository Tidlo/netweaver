class Device {
    constructor() {
        this.ports = [];
    }

    occupyPort(portName, edgeData) {
        let port = this.ports.find(port => port.name === portName);
        port.occupied = true;
        port.edgeData = edgeData;
    }
}

export default Device;