class Device {
    constructor() {
        this.ports = [];
    }

    occupyPort(portName, edgeData) {
        let port = this.ports.find(port => port.name === portName);
        port.occupied = true;
        port.edgeData = edgeData;
    }

    releasePort(portName) {
        console.log(portName);
        if (!portName) return;
        let port = this.ports.find(port => port.name === portName);
        port.occupied = false;
        port.edgeData = null;
    }
}

export default Device;