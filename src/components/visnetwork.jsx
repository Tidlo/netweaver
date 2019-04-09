import {DataSet, Network} from 'vis';
import React, {createRef} from "react";
// import local resources
import routerIcon from '../img/router.png';
import clientIcon from '../img/client.png';
import switchIcon from '../img/switch.png';
import {Button, Dialog, Pane, TextInputField} from "evergreen-ui";
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
            mask:'',
            gateway:'',
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

const ipRegex = "\\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\\b";

// initialize your network!
class VisNetwork extends React.Component {

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
            editingClientLabel: '',
            editingClientIP:'',
            editingClientMask:'',
            editingClientGateway:'',
            ipValidationMessage:null,
            isInputValidate:true,

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
            // console.log(params);
            // console.log(params.nodes[0]);
            // console.log(this.state);
            // console.log(nodes);
            // console.log(nodes.get(params.nodes[0]));
            // console.log(this.state.focusedNode);
        };

        this.network.on("doubleClick", function (params) {
            showDialog(params);
        });

        this.network.on("oncontext", function (params) {
            params.event = "[original event]";
            console.log(JSON.stringify(params, null, 4));
        });
    }



    render() {
        let addEdge = () => {
            console.log(this.network);
            this.network.addEdgeMode();
        };

        let handleCancel = () => {
            this.setState({
                ipValidationMessage:null,
            isClientDialogShown: false
            });
        };

        let handleConfirm = ()=>{
            console.log(isAllInputValidate());
            if(isAllInputValidate()){
                console.log(isAllInputValidate());
                this.setState({isClientDialogShown: false});
                try {
                    nodes.update({
                        id: this.state.focusedNode.id,
                        label: this.state.editingClientLabel
                    });
                } catch (err) {
                    alert(err);
                }
            }else{

            }
        };

        let isAllInputValidate = ()=>{
            return !(
                this.state.ipValidationMessage
            );
        };

        return (
            <div>
                <div className="network" ref={this.appRef}/>
                <Pane>
                    <Dialog
                        isShown={this.state.isClientDialogShown}
                        title="主机配置"
                        intent="none"
                        onCloseComplete={() => {
                            this.setState({isClientDialogShown: false});
                        }}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        confirmLabel="确认"
                        cancelLabel="取消">

                        <TextInputField
                            label="主机名"
                            placeholder="Client"
                            onChange={e => this.setState({editingClientLabel: e.target.value})}
                            defaultValue={this.state.focusedNode == null?'':this.state.focusedNode.label}
                        />

                        <TextInputField
                            label="IP地址"
                            placeholder="10.1.1.1"
                            validationMessage={this.state.ipValidationMessage}
                            onChange={e => {
                                if(e.target.value.match(ipRegex)){
                                    this.setState({
                                        editingClientIP: e.target.value,
                                        ipValidationMessage:null,
                                    });
                                }
                                else{
                                    this.setState({ipValidationMessage:'IP 格式有误'})
                                }

                            }}
                            defaultValue={this.state.focusedNode == null?'':this.state.focusedNode.ip}
                        />
                        <TextInputField
                            label="子网掩码"
                            placeholder="255.255.255.0"
                            onChange={e => this.setState({editingClientMask: e.target.value})}
                            defaultValue={this.state.focusedNode == null?'':this.state.focusedNode.mask}
                        />
                        <TextInputField
                            label="网关"
                            placeholder="10.1.1.0"
                            onChange={e => this.setState({editingClientGateway: e.target.value})}
                            defaultValue={this.state.focusedNode == null?'':this.state.focusedNode.gateway}
                        />
                    </Dialog>

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
                <Button marginRight={12} height={40} iconBefore="new-link" onClick={addEdge}>连线</Button>

            </div>
        );
    }
}

export default VisNetwork;