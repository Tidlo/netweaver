import Device from "./Device";

class Client extends Device {
    constructor(props) {
        super();
        this.gateway = props?.gateway;
        this.ip = props?.ip;
        this.mask = '';
        this.ports.push({
            name: 'Ethernet 0/0/1',
            occupied: false,
        });
    }

    updateInfo(newInfo) {
        this.ip = newInfo.ip;
        this.mask = newInfo.mask;
        this.gateway = newInfo.gateway;
    }
}

export default Client;
