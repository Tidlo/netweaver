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
        this.routes = [
            {
                destination: '127.0.0.0',
                mask: 8,
                nextHop: "127.0.0.1"
            },
            {
                destination: '127.0.0.1',
                mask: 32,
                nextHop: "127.0.0.1"
            },
            {
                destination: '127.255.255.255',
                mask: 32,
                nextHop: "127.0.0.1"
            },
            {
                destination: '255.255.255.255',
                mask: 32,
                nextHop: "127.0.0.1"
            }

        ];
    }

    deleteRoute(routeDestination) {
        this.routes = this.routes.filter(p => p.destination !== routeDestination);
    }
}

export default Router;
