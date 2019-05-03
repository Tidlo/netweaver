function pingTest(network, sourceNodeId, destinationNodeId) {
    let edges = network.body.data.edges;
    let nodes = network.body.data.nodes;
    let loopFlag = true;
    console.log('is route match?', isRouteMatch('192.168.2.11', '24', '192.168.2.22', '24'));

    let current = nodes.get(sourceNodeId);
    let destination = nodes.get(destinationNodeId);

    //status stores the status of current node to next node with value true or false.
    let status = [];
    console.log(network);
    console.log(nodes);
    console.log(current);
    console.log(destination);
    let loopCount = 0;
    //iteration starts here
    while (loopFlag && loopCount < 20) {
        loopCount++;
        console.log('loopCount', loopCount);
        console.log('current node is ', current);

        //if current is the destination
        if (current.id === destinationNodeId) {
            console.log('reached destination');
            loopFlag = false;
            status.push(true);
            break;
        }

        //if current device is a client
        if (current.id.includes('client')) {
            console.log('current is client');
            let toNodeId = toNodeIdOf(current, current.device.ports[0]);
            console.log('to node device type:', toNodeId);
            //if client linked with client
            if (toNodeIdOf(current, current.device.ports[0]).includes('client')) {
                console.log('current is linked to another client');
                //if destination is not linked device
                let currentNodePortDestination = toNodeIdOf(current, current.device.ports[0]);

                if (currentNodePortDestination !== destination.id) {
                    // failed connection
                    console.log('two client don\'t match');
                    loopFlag = false;
                } else {
                    // connection success
                    console.log('reach destination');
                    loopFlag = false;
                }
            }
            //if client linked with switch
            else if (toNodeIdOf(current, current.device.ports[0]).includes('switch')) {
                console.log('current is linked to switch');
                //just sent packet to switch
                current = nodes.get(toNodeIdOf(current, current.device.ports[0]));
            }
            //if client linked with router
            else if (toNodeId.includes('router')) {
                console.log('current is linked to router');
                current = nodes.get(toNodeId);
            }
        }
        //if current is switch
        else if (current.id.includes('switch')) {
            console.log('current is switch');
            //search destination ip next neighbors
            let searchedPorts = current.device.ports.filter(p => {
                return toNodeIdOf(current, p) === destination.id;
            });
            console.log(searchedPorts);
            //if find destination ip is in same subnet
            if (searchedPorts.length === 1) {
                console.log('destination is in same vlan with switch');
                // and same vlan
                if (true) {
                    //sent packet to it
                    current = nodes.get(toNodeIdOf(current, searchedPorts[0]));
                }

            } else {
                console.log('destination is not in neighbors, send packet to router');
                //if not find, sent packet to all neighbors except source device
                searchedPorts = current.device.ports.filter(p => {
                    return toNodeIdOf(current, p).includes('router');
                });
                current = nodes.get(toNodeIdOf(current, searchedPorts[0]));
            }
        }
        //if current is router
        else if (current.id.includes('router')) {
            console.log('current is router');
            //decide next port via rout table
            let searchedRoutes = current.device.routes.filter(r => {
                return isRouteMatch(r.destination, r.mask, destination.device.ip, destination.device.mask);
            });
            console.log('current routes', current.device.routes);
            console.log('searched routes', searchedRoutes);
            //if found record, resent it
            if (searchedRoutes.length > 0) {
                //if port is in subnet with destination ip
                let searchedPort = current.device.ports.find(p => isRouteMatch(p.bindIP, destination.device.mask, destination.device.ip, destination.device.mask));
                if (searchedPort) {
                    //directly send packet to it
                    current = nodes.get(toNodeIdOf(current, searchedPort));
                }
                //if not in same subnet
                else {
                    //send to gateway(next router)
                    current = nodes.get(toNodeIdOf(current, current.device.ports.find(p => p.edgeData.to.includes('router'))));
                }
            }
            //if not found, connection failed.
            else {
                loopFlag = false;
                console.log('can\'t reach destination');
            }
        }
        // loopFlag = false;
    }
    return status;
}


function isInSameSubnet(node1, node2) {
    // if any node not assigned ip, return false.
    if (!node1.device.ip || !node2.device.ip) return false;

    let binaryIP1 = '';
    node1.device.ip.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        for (let i = 0; i < 8 - tmp.length; i++) {
            tmp = '0'.concat(tmp);
        }
        binaryIP1 += tmp;
    });
    let decimalIP1 = parseInt(binaryIP1, 2);

    let binaryIP2 = '';
    node2.device.ip.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        for (let i = 0; i < 8 - tmp.length; i++) {
            tmp = '0'.concat(tmp);
        }
        binaryIP2 += tmp;
    });
    let decimalIP2 = parseInt(binaryIP2, 2);
    let mask1 = parseInt(node1.device.mask);
    let mask2 = parseInt(node2.device.mask);
    //transfer mask number(0-32) to decimal mask number.
    mask1 = Math.pow(2, 32) - Math.pow(2, 32 - mask1);
    mask2 = Math.pow(2, 32) - Math.pow(2, 32 - mask2);

    return (decimalIP1 & mask1) === (decimalIP2 & mask2);
}

function isRouteMatch(ip1, maskNum1, ip2, maskNum2) {
    // if any node not assigned ip, return false.

    let binaryIP1 = '';
    ip1.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        let len = 8 - tmp.length;
        for (let i = 0; i < len; i++) {
            tmp = '0'.concat(tmp);
        }
        binaryIP1 += tmp;
    });
    let decimalIP1 = parseInt(binaryIP1, 2);

    let binaryIP2 = '';
    ip2.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        let len = 8 - tmp.length;
        for (let i = 0; i < len; i++) {
            tmp = '0'.concat(tmp);
        }
        binaryIP2 += tmp;
    });
    let decimalIP2 = parseInt(binaryIP2, 2);
    let mask1 = parseInt(maskNum1);
    let mask2 = parseInt(maskNum2);
    //transfer mask number(0-32) to decimal mask number.
    mask1 = Math.pow(2, 32) - Math.pow(2, 32 - mask1);
    mask2 = Math.pow(2, 32) - Math.pow(2, 32 - mask2);
    // todo : deal with two different mask number e.g. 24 and 30
    return (decimalIP1 & mask1) === (decimalIP2 & mask2);
}

function toNodeIdOf(fromNode, fromPort) {
    if (!fromNode || !fromPort) return '';
    let edgeData = fromPort.edgeData;
    if (!edgeData) return '';
    if (edgeData.to === fromNode.id) {
        return edgeData.from;
    } else {
        return edgeData.to;
    }

}

export {pingTest};
