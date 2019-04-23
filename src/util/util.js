let generateClientCode = function (network) {
    console.log(network);
    let nodes = network.body.data.nodes;
    let rawString = '# 客户机\n';
    nodes.forEach(node => {
        if (node.id.includes("client")) {
            rawString += "## " + (node.label) + "\n\n";
            rawString += "|    IP地址   | 子网掩码 |    网关    |\n| ---------- | ------- |-----------|\n";
            rawString += "|" + (node.device.ip ? node.device.ip : "");
            rawString += "|" + (node.device.mask ? node.device.mask : "");
            rawString += "|" + (node.device.gateway ? node.device.gateway : "");
            rawString += "|\n\n";
        }
    });
    // console.log(rawString);
    return rawString;
};

let generateSwitchCode = (network) => {
    let nodes = network.body.data.nodes;
    let rawString = '# 交换机\n';
    nodes.forEach(node => {
        if (node.id.includes("switch")) {
            rawString += "## " + (node.label) + "\n\n";
            rawString += "|    本机端口   | 目标机 |    目标端口    |\n| ---------- | ------- |-----------|\n";

            let occupiedPorts = node.device.ports.filter(p => p.occupied);
            occupiedPorts.forEach(port => {
                rawString += "|" + port.name;
                rawString += "|" + port.edgeData.to;
                rawString += "|" + port.edgeData.toPort + "|\n";
            });

            let vlanSet = new Set();
            occupiedPorts.forEach(p => {
                vlanSet.add(p.defaultVLAN.toString());
                p.allowPass.forEach(a => {
                    vlanSet.add(a);
                });
            });
            //code below generates code to configuration switch vlan
            rawString += "```ensp\n";
            rawString += "sys\n" +
                "sysname " + node.label + "\n";
            if (vlanSet.size > 1) {
                rawString += "vlan batch " + [...vlanSet].join(' ') + "\n\n";
                occupiedPorts.forEach(port => {
                    switch (port.linkType) {
                        case "hybrid":
                            break;
                        case "access":
                            rawString += "interface " + port.name.charAt(0) + " " + port.name.substring(3, port.name.length) + "\n" +
                                "port link-type access\n" +
                                "port default vlan " + port.defaultVLAN + "\n\n";
                            break;
                        case "trunk":
                            rawString += "interface " + port.name.charAt(0) + " " + port.name.substring(3, port.name.length) + "\n" +
                                "port link-type trunk\n" +
                                "port trunk allow-pass vlan " + port.allowPass.join(' ') + "\n\n";
                            break;
                        default:
                            console.log("error");
                    }
                });
            }
            rawString += "display vlan\n```\n";
        }
    });
    //console.log(rawString);
    return rawString;
};

let generateRouterCode = (network) => {
    let nodes = network.body.data.nodes;
    let rawString = '# 路由器\n';
    nodes.forEach(node => {
        if (node.id.includes("router")) {
            rawString += "## " + (node.label) + "\n\n";
            rawString += "|    本机端口   | 目标机 |    目标端口    |\n| ---------- | ------- |-----------|\n";

            let occupiedPorts = node.device.ports.filter(p => p.occupied);
            occupiedPorts.forEach(port => {
                rawString += "|" + port.name;
                rawString += "|" + port.edgeData.to;
                rawString += "|" + port.edgeData.toPort + "|\n";
            });

            //code below generates code to configuration switch vlan
            rawString += "```ensp\n";
            rawString += "sys\n" +
                "sysname " + node.label + "\n";

            //generate code for port bind ip
            occupiedPorts.forEach(port => {
                rawString += "interface " + port.name + "\n";
                rawString += "ip address " + port.bindIP + " " + port.bindMask + "\n";
            });
            rawString += "quit\n";
            let i = 0;
            node.device.routes.forEach(route => {
                i++;
                if (i > 4)
                    rawString += "ip route-static " + route.destination + " " + route.mask + " " + route.nextHop + "\n";
            });
        }
    });
    return rawString;
};

let generateCode = (network) => {
    return generateClientCode(network) + generateSwitchCode(network) + generateRouterCode(network);
};

let getDestination = (node, port) => {
    let destinationDevice = '';
    let destinationPort = '';
    let edgeData = port.edgeData;
    if (node.label === port.edgeData.from) {
        destinationDevice = port.edgeData.to;
        destinationPort = port.edgeData.toPort;
    } else if (node.label === port.edgeData.to) {
        destinationDevice = port.edgeData.from;
        destinationPort = port.edgeData.fromPort;
    }
    return destinationDevice + "." + destinationPort;
};

let judge = (network) => {
    let score = 100;
    let nodes = network.data.nodes;
    let edges = network.data.edges;

    //if switch access port linked to non-client device, -10

    //if switch hybrid port linked to client device, -10
    return score;
};

function isConnected(network, client1, switch1, router1) {
    let binIp1 = '';
    if (!client1.device.ip) return false;
    client1.device.ip.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        for (let i = 0; i < 8 - tmp.length; i++) {
            tmp = '0'.concat(tmp);
        }
        binIp1 += tmp;
    });
    let ip1 = parseInt(binIp1, 2);
    let binIp2 = '';
    let port1 = router1.device.ports.find(p => p.occupied && (p.edgeData.from === switch1.id || p.edgeData.to === switch1.id));
    if (port1) {
        port1.bindIP.split('.').forEach(part => {
            let tmp = parseInt(part).toString(2);
            for (let i = 0; i < 8 - tmp.length; i++) {
                tmp = '0'.concat(tmp);
            }
            binIp2 += tmp;
        });
    } else {
        return false;
    }

    let ip2 = parseInt(binIp2, 2);
    console.log('port bind ip', ip2);
    let maskStr1 = '';
    let maskStr2 = '';
    let count1 = parseInt(client1.device.mask);
    let count2 = parseInt(port1.bindMask);
    for (let i = 0; i < 32; i++) {
        if (count1 > 0) {
            maskStr1 += '1';
            count1--;
        } else {
            maskStr1 += '0';
        }
        if (count2 > 0) {
            maskStr2 += 1;
            count2--;
        } else {
            maskStr2 += '0';
        }
    }
    let mask1 = parseInt(maskStr1, 2);
    let mask2 = parseInt(maskStr2, 2);
    // two clients in same subnet divided by ip
    if ((ip1 & mask1) === (ip2 & mask2)) {
        console.log("router test passed");
        return true;
    }
    return false;
}

function isInSameSubnet(network, client1, switch1, client2) {
    let binIp1 = '';
    client1.device.ip.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        for (let i = 0; i < 8 - tmp.length; i++) {
            tmp = '0'.concat(tmp);
        }
        binIp1 += tmp;
    });
    let ip1 = parseInt(binIp1, 2);
    let binIp2 = '';
    client2.device.ip.split('.').forEach(part => {
        let tmp = parseInt(part).toString(2);
        for (let i = 0; i < 8 - tmp.length; i++) {
            tmp = '0'.concat(tmp);
        }
        binIp2 += tmp;
    });
    let ip2 = parseInt(binIp2, 2);
    let maskStr1 = '';
    let maskStr2 = '';
    let count1 = parseInt(client1.device.mask);
    let count2 = parseInt(client2.device.mask);
    for (let i = 0; i < 32; i++) {
        if (count1 > 0) {
            maskStr1 += '1';
            count1--;
        } else {
            maskStr1 += '0';
        }
        if (count2 > 0) {
            maskStr2 += 1;
            count2--;
        } else {
            maskStr2 += '0';
        }
    }
    let mask1 = parseInt(maskStr1, 2);
    let mask2 = parseInt(maskStr2, 2);
    // two clients in same subnet divided by ip
    if ((ip1 & mask1) === (ip2 & mask2)) {
        //check the vlan
        console.log(switch1);
        // let fromPort = network.nodes.get(client1.ports[0].edgeData)
        let port1 = switch1.device.ports.find(p => p.occupied && (p.edgeData.from === client1.id || p.edgeData.to === client1.id));
        let port2 = switch1.device.ports.find(p => p.occupied && (p.edgeData.from === client2.id || p.edgeData.to === client2.id));
        if (port1.linkType !== 'trunk' && port2.linkType !== 'trunk' && port1.defaultVLAN === port2.defaultVLAN) {
            console.log('passed');
            return true;
        }
    }
    return false;
}

let pingTest = (network, node1, node2) => {
    let nodes = network.body.data.nodes;
    let edges = network.body.data.edges;

    let neighborsOf = [];
    //console.log(Object.values(preEdges._data));
    nodes.forEach(node => {
        neighborsOf[node.id] = [];
        Object.values(edges._data).filter(e => e.from === node.id || e.to === node.id)
            .forEach(ed => {
                if (ed.from === node.id)
                    neighborsOf[node.id].push(ed.to);
                else if (ed.to === node.id)
                    neighborsOf[node.id].push(ed.from)
            });
    });

    let path = shortestPath(neighborsOf, node1, node2);
    let passStatus = [];
    if (path.length > 1) {


        //traverse from source to destination

        let prev = node1;
        let current = path[1];
        let next = path[2];
        for (let i = 1; i < path.length - 1; i++) {
            next = path[i + 1];
            //if(testPass){
            console.log('this turn:', prev, current, next);
            // client-switch-client
            if (prev.includes('client') && current.includes('switch') && next.includes('client')) {
                //if in same subnet
                if (isInSameSubnet(network, nodes.get(prev), nodes.get(current), nodes.get(next))) {
                    passStatus.push(true);
                    passStatus.push(true);
                    prev = current;
                    current = next;
                    i++;
                    next = path[i + 1];
                    console.log(prev, current, next, 'passed');
                    continue;
                }
            }
            //client-switch-router
            if (prev.includes('client') && current.includes('switch') && next.includes('router')) {
                console.log(prev, current, next, 'testing');
                if (isConnected(network, nodes.get(prev), nodes.get(current), nodes.get(next))) {
                    passStatus.push(true);
                    passStatus.push(true);
                    prev = current;
                    current = next;
                    i++;
                    next = path[i + 1];
                    console.log(prev, current, next, 'passed');
                    continue;
                }
            }
            //router-switch-client
            if (prev.includes('router') && current.includes('switch') && next.includes('client')) {
                console.log(prev, current, next, 'testing');
                if (isConnected(network, nodes.get(next), nodes.get(current), nodes.get(prev))) {
                    passStatus.push(true);
                    passStatus.push(true);
                    prev = current;
                    current = next;
                    i++;
                    next = path[i + 1];
                    console.log(prev, current, next, 'passed');
                    continue;
                }
            }
            //switch-router-switch
            if (prev.includes('switch') && current.includes('router') && next.includes('switch')) {
                console.log(prev, current, next, 'testing');
                if (isConnected(network, nodes.get(next), nodes.get(current), nodes.get(prev))) {
                    passStatus.push(true);
                    passStatus.push(true);
                    prev = current;
                    current = next;
                    i++;
                    next = path[i + 1];
                    console.log(prev, current, next, 'passed');
                    continue;
                }
            }
            prev = current;
            current = next;
            console.log(passStatus);
            //}else{
            passStatus.push(false);
            //}
        }
        console.log(passStatus);
    }

    return {
        path: path,
        passStatus: passStatus,
    };
};

function shortestPath(neighborsOf, source, target) {
    if (source === target) {
        console.log(source);
        return [source, target];
    }
    let queue = [source],
        visited = {source: true},
        predecessor = {},
        tail = 0;
    while (tail < queue.length) {
        let u = queue[tail++],  // pop a vertex off the queue
            neighbors = neighborsOf[u];
        for (let i = 0; i < neighbors.length; ++i) {
            let v = neighbors[i];
            if (visited[v]) {
                continue;
            }
            visited[v] = true;
            if (v === target) {   // if the path is complete
                let path = [v];   // backtrack through the path
                while (u !== source) {
                    path.push(u);
                    u = predecessor[u];
                }
                path.push(u);
                path.reverse();
                console.log(path.join(' -> '));
                return path;
            }
            predecessor[v] = u;
            queue.push(v);
        }
    }
    console.log('there is no path from ' + source + ' to ' + target);
    return null;
}

let DFS = (source, neighborsOf) => {
    let visited = {source: true};
    let tail = 0;
    let queue = [{vertex: source, count: 0}];
    while (tail < queue.length) {
        let u = queue[tail].vertex,
            count = queue[tail++].count;
        console.log('distance from ' + source + ' to ' + u + ': ' + count);
        neighborsOf[u].forEach(function (v) {
            if (!visited[v]) {
                visited[v] = true;
                queue.push({vertex: v, count: count + 1});
            }
        });
    }
};

export {generateCode, getDestination, judge, pingTest};