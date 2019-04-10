class Client {
    constructor() {
        this.gateway = '';
        this.ip = '';
        this.mask = '';
    }

    updateInfo(newInfo) {
        this.ip = newInfo.ip;
        this.mask = newInfo.mask;
        this.gateway = newInfo.gateway;
    }
}

export default Client;
