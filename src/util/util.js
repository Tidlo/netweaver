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
            node.device.routes.forEach(route => {
                rawString += "ip route-static " + route.destination + " " + route.mask + " " + route.nextHop + "\n";
            });
        }
    });
    return rawString;
};

let generateCode = (network) => {
    return generateClientCode(network) + generateSwitchCode(network) + generateRouterCode(network);
};
export {generateCode};