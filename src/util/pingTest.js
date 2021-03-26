function pingTest(network, sourceNodeId, destinationNodeId) {
    let nodes = network.body.data.nodes;
    let loopFlag = true;

    let source = nodes.get(sourceNodeId);
    let current = source;
    let destination = nodes.get(destinationNodeId);

    //status stores the status of current node to next node with value true or false.
    let result = [];
    console.log(network);
    console.log(nodes);
    console.log(current);
    console.log(destination);
    //loop count to avoid infinite loop
    let loopCount = 0;
    //iteration starts here
    while (loopFlag && loopCount < 1000) {
        loopCount++;
        //if current is the destination
        if (current.id === destinationNodeId) {
            console.log('reached destination');
            loopFlag = false;
            result.push({current: current, ableToNext: null});
            break;
        }

        //if current device is a client
        if (current.id.includes('client')) {
            let toNodeId = toNodeIdOf(current, current.device.ports[0]);
            //if client linked with client
            if (toNodeId.includes('client')) {
                //if destination is not linked device
                if (toNodeId !== destination.id) {
                    // failed connection
                    result.push({current: current, ableToNext: false});
                    console.log('two client don\'t match');
                    break;
                } else {
                    //judge whether they are in same subnet
                    if (isInSameSubnet(current, destination)) {
                        // connection success
                        result.push({current: current, ableToNext: true});
                        current = current = nodes.get(toNodeId);
                    } else {
                        result.push({current: current, ableToNext: false});
                        console.log('two client don\'t match');
                        break;
                    }
                }
            }
            //if client linked with switch
            else if (toNodeId.includes('switch')) {
                //just sent packet to switch
                result.push({current: current, ableToNext: true});
                current = nodes.get(toNodeId);
            }
            //if client linked with router
            else if (toNodeId.includes('router')) {
                result.push({current: current, ableToNext: true});
                current = nodes.get(toNodeId);
            }
        }
        //if current is switch
        else if (current.id.includes('switch')) {
            //search destination ip next neighbors
            let searchedPort = current.device.ports.find(p =>
              toNodeIdOf(current, p) === destination.id
            );
            //if find destination device is linked with current switch
            if (searchedPort) {
                console.log('destination device is linked with current switch');
                // and same vlan
                if (isInSameSubnet(source, destination)) {
                    //sent packet to it
                    result.push({current: current, ableToNext: true});
                    current = nodes.get(toNodeIdOf(current, searchedPort));
                } else {
                    result.push({current: current, ableToNext: false});
                    console.log('two client don\'t match');
                    break;
                }

            } else {
                //if not find, sent packet to all neighbors except source device
                searchedPort = current.device.ports.find(p => {
                    return toNodeIdOf(current, p).includes('router');
                });
                result.push({current: current, ableToNext: true});
                current = nodes.get(toNodeIdOf(current, searchedPort));
            }
        }
        //if current is router
        else if (current.id.includes('router')) {
            //decide next port via rout table
            let searchedRoutes = current.device.routes.filter(r => {
                return isRouteMatch(r.destination, r.mask, destination.device.ip, destination.device.mask);
            });
            //if found record, resent it
            if (searchedRoutes.length > 0) {
                //if port is in subnet with destination ip
                let searchedPort = current.device.ports.find(p => isRouteMatch(p.bindIP, destination.device.mask, destination.device.ip, destination.device.mask));
                if (searchedPort) {
                    //directly send packet to it
                    result.push({current: current, ableToNext: true});
                    current = nodes.get(toNodeIdOf(current, searchedPort));
                }
                //if not in same subnet
                else {
                    //send to next gateway(router)
                    let nextRouterId = toNodeIdOf(current, current.device.ports.find(p => p.edgeData.to.includes('router')));
                    if (nextRouterId) {
                        result.push({current: current, ableToNext: true});
                        current = nodes.get(nextRouterId);
                    } else {
                        result.push({current: current, ableToNext: false});
                        break;
                    }
                }
            }
            //if not found, connection failed.
            else {
                console.log('can\'t reach destination : device type error.');
                break;
            }
        }
    }
    console.log('status: ', result);
    return result;
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
