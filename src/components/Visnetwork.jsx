import {DataSet, Network} from 'vis';
import React, {createRef} from "react";
// import local resources
import routerIcon from '../img/router.png';
import clientIcon from '../img/client.png';
import switchIcon from '../img/switch.png';
import {Button, Dialog, Pane} from "evergreen-ui";
import ClientConfigDialog from "./ClientConfigDialog";
import SelectPortDialog from "./SelectPortDialog";
import Client from '../devices/Client'
import Router from "../devices/Router";
import Switch from "../devices/Switch";

let nodes = new DataSet();

// create an array with edges
let edges = new DataSet();

// define network data, include nodes and edges
let data = {nodes, edges};

let routerNumbers = 1;
let clientNumbers = 1;
let switchNumbers = 1;

let callBack = function () {
};

function addClient() {
    let id = 'client' + clientNumbers;
    clientNumbers++;
    try {
        nodes.add({
            id: id,
            label: id,
            image: clientIcon,
            shape: 'image',
            icon: 'desktop',
            device: new Client()
        });
    } catch (err) {
        alert(err);
    }
}

function addRouter() {
    let id = 'router' + routerNumbers;
    routerNumbers++;
    try {
        nodes.add({
            id: id,
            label: id,
            image: routerIcon,
            shape: 'image',
            device: new Router(),
        });
    } catch (err) {
        alert(err);
    }
}

function addSwitch() {
    let id = 'switch' + switchNumbers;
    switchNumbers++;
    try {
        nodes.add({
            id: id,
            label: id,
            image: switchIcon,
            shape: 'image',
            device: new Switch(),
        });
    } catch (err) {
        alert(err);
    }
}


// initialize your network!
class Visnetwork extends React.Component {

    constructor(props) {
        super(props);
        this.network = {};
        this.appRef = createRef();
        this.state = {
            isClientDialogShown: false,
            isRouterDialogShown: false,
            isSwitchDialogShown: false,
            isPortDialogShown: false,
            focusedNode: null,
            nodes: null,
            edgeData: {},
            isDeleteButtonShown: 'none',
            fromNode: {device: new Client()},
            toNode: {device: new Client()},
        };
        //initialize network
        addSwitch();
        addSwitch();
        addClient();
        addClient();
        addClient();
        addClient();
        addRouter();
        edges = new DataSet([
            {from: 'client1', to: 'switch1'},
            {from: 'client2', to: 'switch1'},
            {from: 'client3', to: 'switch2'},
            {from: 'client4', to: 'switch2'},
            {from: 'router1', to: 'switch1'},
            {from: 'router1', to: 'switch2'},
        ]);
        data = {nodes, edges};
    }

    componentDidMount() {
        // define network options
        let options = {
            locale: 'en',
            manipulation: {
                initiallyActive: true,
                enabled: false,
                addEdge: function (data, callback) {
                    //avoid self-loop
                    if (data.from === data.to) {
                        return;
                    }
                    //extract the callback function to higher scope
                    callBack = callback;
                    showSelectPortDialog(data);
                },
            },
        };

        let showSelectPortDialog = (data) => {
            //set isPortDialogShown to true to popup dialog
            this.setState({
                isPortDialogShown: true,
                edgeData: data,
                fromNode: nodes.get(data.from),
                toNode: nodes.get(data.to),
            });
            console.log(this.state.fromNode);
        };

        this.network = new Network(this.appRef.current, data, options);

        console.log(this.network);

        let showDialog = (params) => {
            if (!params.nodes.length > 0)
                return;

            if (params.nodes[0].includes('router')) {
                this.setState({isRouterDialogShown: true, focusedNode: nodes.get(params.nodes[0])});
            } else if (params.nodes[0].includes('client')) {
                this.setState({isClientDialogShown: true, focusedNode: nodes.get(params.nodes[0])});
            } else if (params.nodes[0].includes('switch')) {
                this.setState({isSwitchDialogShown: true, focusedNode: nodes.get(params.nodes[0])});
            }
        };

        /**
         * Mouse event handlers
         */

        this.network.on("doubleClick", function (params) {
            showDialog(params);
        });
        this.network.on("click", params => handleClick(params));

        let handleClick = (params) => {
            console.log(params.edges);
            if (params.edges.length > 0 || params.nodes.length > 0) {
                this.setState({isDeleteButtonShown: 'inline-block',});
            } else {
                this.setState({isDeleteButtonShown: 'none',});
            }
        };

        this.network.on("oncontext", function (params) {
            params.event = "[original event]";
            console.log(JSON.stringify(params, null, 4));
        });
    }

    disableClientDialog() {
        this.setState({
            isClientDialogShown: false
        });
    };

    disablePortDialog() {
        this.setState({
            isPortDialogShown: false
        })
    }

    updateClientNode(form) {
        try {
            nodes.update({
                id: this.state.focusedNode.id,
                label: form.label,
            });
        } catch (err) {
            alert(err);
        }
        this.state.focusedNode.device.updateInfo(form);
    }

    /**
     * handler for add edge button to trigger callback.
     */
    addEdge = () => {
        console.log();
        this.network.addEdgeMode();
    };

    confirmAddEdge = (data) => {
        console.log(data);
        if (typeof data.to === 'object')
            data.to = data.to.id;
        if (typeof data.from === 'object')
            data.from = data.from.id;

        this.state.fromNode.device.occupyPort(data.fromPort);
        this.state.toNode.device.occupyPort(data.toPort);
        callBack(data);
    };

    cancelAddEdge = () => {
        callBack(null);
        this.network.disableEditMode();
    };

    render() {
        return (
            <Pane>
                <Pane
                    width={1000}
                    marginTop={4}
                    marginBottom={4}
                    elevation={1}>
                    <div className="network" ref={this.appRef}/>
                </Pane>

                <ClientConfigDialog
                    disableClientDialog={() => this.disableClientDialog()}
                    isShown={this.state.isClientDialogShown}
                    nodes={nodes}
                    focusedNode={this.state.focusedNode}
                    updateClientNode={(p) => this.updateClientNode(p)}/>

                <SelectPortDialog
                    isShown={this.state.isPortDialogShown}
                    disablePortDialog={() => this.disablePortDialog()}
                    confirmAddEdge={(p) => this.confirmAddEdge(p)}
                    cancelAddEdge={() => this.cancelAddEdge()}
                    edgeData={this.state.edgeData}
                    fromNode={this.state.fromNode}
                    toNode={this.state.toNode}
                />

                <Dialog
                    isShown={this.state.isRouterDialogShown}
                    title="路由器配置"
                    intent="danger"
                    onCloseComplete={() => this.setState({isClientDialogShown: false})}
                    confirmLabel="Delete Something">
                    Dialog content
                </Dialog>

                <Dialog
                    isShown={this.state.isSwitchDialogShown}
                    title="交换机配置"
                    intent="danger"
                    onCloseComplete={() => this.setState({isSwitchDialogShown: false})}
                    confirmLabel="Delete Something">
                    Dialog content
                </Dialog>


                <Button marginRight={12} height={40} iconBefore="desktop" onClick={addClient}>主机</Button>
                <Button marginRight={12} height={40} iconBefore="exchange" onClick={addSwitch}>交换机</Button>
                <Button marginRight={12} height={40} iconBefore="search-around" onClick={addRouter}>路由器</Button>
                <Button marginRight={12} height={40} iconBefore="new-link" onClick={this.addEdge}>连线</Button>
                <Button marginRight={12} height={40} iconBefore="trash" intent="danger"
                        display={this.state.isDeleteButtonShown}
                        onClick={() => this.network.deleteSelected()}>删除</Button>

            </Pane>
        );
    }
}

export default Visnetwork;