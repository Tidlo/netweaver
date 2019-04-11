import Device from "./Device";

class Router extends Device {
    constructor() {
        super();
        for (let i = 0; i < 9; i++) {
            this.ports.push({
                name: 'Ethernet 0/0/' + i,
                occupied: false,
            });
        }
    }

}

export default Router;
