import {DataSet, Network} from 'vis';
import React, {createRef} from "react";
// import local resources
import routerIcon from '../img/router.png';
import clientIcon from '../img/client.png';
import switchIcon from '../img/switch.png';
import {Button, Dialog, Pane} from "evergreen-ui";
import ClientConfigDialog from "./ClientConfigDialog";


let nodes = new DataSet();

// create an array with edges
let edges = new DataSet();

// define network data, include nodes and edges
let data = {nodes, edges};

let routerNumbers = 1;
let clientNumbers = 1;
let switchNumbers = 1;

function addRouter() {
    let id = 'router' + routerNumbers;
    routerNumbers++;
    try {
        nodes.add({
            id: id,
            label: id,
            image: routerIcon,
            shape: 'image',
            routerConfig: {
                rule: 'rule1',
            },
        });
    } catch (err) {
        alert(err);
    }
}

function addClient() {
    const ip = '192.168.1.2';
    let id = 'client' + clientNumbers;
    clientNumbers++;
    try {
        nodes.add({
            id: id,
            label: ip,
            image: clientIcon,
            shape: 'image',
            ip: ip,
            mask: '',
            gateway: '',
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
            isEdgeDialogShown: false,
            focusedNode: null,
            nodes: null,
            // editingClientLabel: '',
            // editingClientIP:'',
            // editingClientMask:'',
            // editingClientGateway:'',
            // ipValidationMessage:null,
            // isInputValidate:true,

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
                enabled: true,
                addEdge: function (data, callback) {
                    if (data.from === data.to) {
                        return;
                    }
                    editEdgeWithoutDrag();
                },
            },
        };

        let editEdgeWithoutDrag = () => {
            this.setState({isEdgeDialogShown: true});
        };

        this.network = new Network(this.appRef.current, data, options);
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

        this.network.on("doubleClick", function (params) {
            showDialog(params);
        });

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

    updateClientNode(form) {
        try {
            nodes.update({
                id: this.state.focusedNode.id,
                label: form.label,
                ip: form.ip,
                mask: form.mask,
                gateway: form.gateway,
            });
        } catch (err) {
            alert(err);
        }
    }

    addEdge = () => {
        console.log(this.network);
        this.network.addEdgeMode();
    };

    render() {

        return (
            <div>
                <div className="network" ref={this.appRef}/>
                <Pane>
                    <ClientConfigDialog
                        disableClientDialog={() => this.disableClientDialog()}
                        isShown={this.state.isClientDialogShown}
                        nodes={nodes}
                        focusedNode={this.state.focusedNode}
                        updateClientNode={(p) => this.updateClientNode(p)}
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

                    <Dialog
                        isShown={this.state.isEdgeDialogShown}
                        title="选择端口"
                        intent="danger"
                        onCloseComplete={() => this.setState({isEdgeDialogShown: false})}
                        confirmLabel="Delete Something">
                        Dialog content
                    </Dialog>

                </Pane>
                <Button marginRight={12} height={40} iconBefore="desktop" onClick={addClient}>主机</Button>
                <Button marginRight={12} height={40} iconBefore="exchange" onClick={addSwitch}>交换机</Button>
                <Button marginRight={12} height={40} iconBefore="search-around" onClick={addRouter}>路由器</Button>
                <Button marginRight={12} height={40} iconBefore="new-link" onClick={this.addEdge}>连线</Button>

            </div>
        );
    }
}

export default Visnetwork;