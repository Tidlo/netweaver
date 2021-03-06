import {DataSet, Network} from 'vis';
import React, {createRef} from "react";
import {HotKeys} from "react-hotkeys";
// import local resources
import routerIcon from '../img/router.png';
import clientIcon from '../img/client.png';
import switchIcon from '../img/switch.png';
import {
    Button,
    Card,
    DesktopIcon,
    ExchangeIcon,
    NewLinkIcon,
    Pane,
    Paragraph,
    SearchAroundIcon,
    Tooltip,
    TrashIcon
} from "evergreen-ui";
import ClientConfigDialog from "./ClientConfigDialog";
import SelectPortDialog from "./SelectPortDialog";
import Client from '../devices/Client'
import Router from "../devices/Router";
import Switch from "../devices/Switch";
import SwitchConfigDialog from "./SwitchConfigDialog";
import RouterConfigDialog from "./RouterConfigDialog";
import ExportCodeDialog from "./ExportCodeDialog";
import Header from "./Header";
import ReactMarkdown from "react-markdown";
import '../App.css';
// import PingTestPanel from "./PingTestPanel";
// import Footer from "./Footer";

let util = require('../util/util.js');

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
            device: new Client({
                ip: `192.168.1.${clientNumbers}`,
                gateway: '255.255.255.0'
            })
        });
    } catch (err) {
        alert(err);
    }
    return id;
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
    return id;
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
    return id;
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
            isExportCodeDialogShown: false,
            isPrintManualButtonShown: false,
            focusedNode: null,  //currently focused node while dialog opening
            nodes: [],    //current nodes IDs
            edges: null,    //reference to this.network.body.edges
            edgeData: {},
            isDeleteButtonShown: 'none',
            fromNode: {device: new Client()},
            toNode: {device: new Client()},
            rawString: '',
            network: null,
            selectedEdge: null,
            width: 900,
        };
        edges = new DataSet([]);
        data = {nodes, edges};
    }

    //When I wrote this, only God and I understood what I was doing
    componentDidMount() {
        // define network options
        let options = {
            width: '900px',
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
            console.log(this.state.edgeData);
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
            //console.log(this.state.focusedNode);
        });
        this.network.on("click", params => handleClick(params));

        let handleClick = (params) => {
            if (params.edges.length > 0 || params.nodes.length > 0) {
                this.setState({
                    isDeleteButtonShown: 'inline-block',
                    selectedEdge: params.edges[0],
                });
            } else {
                this.setState({isDeleteButtonShown: 'none',});
            }
        };

        this.network.on("oncontext", function (params) {
            params.event = "[original event]";
            console.log(JSON.stringify(params, null, 4));
        });

        this.setState({network: this.network});  //state won't change in this scope

        this.forceUpdate();
    }

    showExportCodeDialog() {
        let string = util.generateCode(this.network);
        this.setState({
            isExportCodeDialogShown: true,
            isPrintManualButtonShown: true,
            rawString: string,
        });
    }

    disableExportCodeDialog() {
        this.setState({
            isExportCodeDialogShown: false
        });
    };

    disableClientDialog() {
        this.setState({
            isClientDialogShown: false
        });
    };

    disablePortDialog() {
        this.setState({
            isPortDialogShown: false
        });
    }

    disableSwitchDialog() {
        this.setState({
            isSwitchDialogShown: false,
        });
    }

    disableRouterDialog() {
        this.setState({
            isRouterDialogShown: false,
        });
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
        this.network.addEdgeMode();
    };

    confirmAddEdge = (data) => {
        console.log(data);
        if (typeof data.to === 'object')
            data.to = data.to.id;
        if (typeof data.from === 'object')
            data.from = data.from.id;

        this.state.fromNode.device.occupyPort(data.fromPort, data);
        this.state.toNode.device.occupyPort(data.toPort, data);
        callBack(data);
    };

    cancelAddEdge = () => {
        callBack(null);
        this.network.disableEditMode();
    };


    deleteSelected = () => {
        let selectedEdge = this.network.body.data.edges.get(this.state.selectedEdge);
        console.log(selectedEdge);
        if (selectedEdge.size > 0) {
            this.network.body.data.nodes.get(selectedEdge.from).device.releasePort(selectedEdge.fromPort);
            this.network.body.data.nodes.get(selectedEdge.to).device.releasePort(selectedEdge.toPort);
        }

        this.network.deleteSelected();
    };
    printManual = () => {
        window.print();
    };

    render() {
        const hotKeyHandlers = {
            DELETE_SELECTED: this.deleteSelected,
            ADD_ROUTER: addRouter,
            ADD_SWITCH: addSwitch,
            ADD_CLIENT: addClient,
            ADD_EDGE: this.addEdge,
        };
        return (
          <HotKeys handlers={hotKeyHandlers}>
              <Pane background={"tint1"} minHeight={'100vh'}>
                  <Header
                    network={this.network}
                    isShown={this.state.isExportCodeDialogShown}
                    isPrintManualButtonShown={this.state.isPrintManualButtonShown}
                    disableExportCodeDialog={() => this.disableExportCodeDialog()}
                    showExportCodeDialog={() => this.showExportCodeDialog()}
                    printManual={() => this.printManual()}
                  />
                  <Pane
                    display={"flex"}
                    alignItems={'center'}
                    flexDirection={"column"}
                    justifyContent={'space-around'}>
                      <Card
                        background={'white'}
                        marginTop={4}
                        marginBottom={8}
                        elevation={1}>
                          <Pane
                            width={this.state.width}
                            borderBottom={'muted'}>
                              <div id={'topology'} className="network" ref={this.appRef}/>
                          </Pane>
                          <Pane
                            width={this.state.width}
                            padding={8}>
                              <Tooltip content={'快捷键 C'}>
                                  <Button marginRight={12} height={40} iconBefore={DesktopIcon} onClick={() => {
                                      //this set state will trigger update for PingTestPanel component
                                      this.setState({nodes: [...this.state.nodes, addClient()]}); //this is
                                  }}>主机</Button>
                              </Tooltip>
                              <Tooltip content={'快捷键 S'}>
                                  <Button marginRight={12} height={40} iconBefore={ExchangeIcon}
                                          onClick={() => this.setState({nodes: [...this.state.nodes, addSwitch()]})}>交换机</Button>
                              </Tooltip>

                              <Tooltip content={'快捷键 R'}>
                                  <Button marginRight={12} height={40} iconBefore={SearchAroundIcon}
                                          onClick={() => this.setState({nodes: [...this.state.nodes, addRouter()]})}>路由器</Button>
                              </Tooltip>
                              <Tooltip content={'快捷键 E'}>
                                  <Button marginRight={12} height={40} iconBefore={NewLinkIcon}
                                          onClick={this.addEdge}>连线</Button>
                              </Tooltip>

                              <Tooltip content={'快捷键 Delete'}>
                                  <Button marginRight={12} height={40} iconBefore={TrashIcon} intent="danger"
                                          display={this.state.isDeleteButtonShown}
                                          onClick={() => this.deleteSelected()}>删除</Button>
                              </Tooltip>

                          </Pane>
                      </Card>
                      {/*<PingTestPanel*/}
                      {/*    nodes={this.state.nodes}*/}
                      {/*    network={this.state.network}*/}
                      {/*/>*/}
                      <Card
                        background={'white'}
                        elevation={1}
                        minHeight={'100px'}
                        height={'auto'}
                        display={"flex"}
                        alignItems={'center'}
                        justifyContent={'center'}
                        id="manual"
                        marginBottom={"32px"}
                        width={this.state.width}>
                          {
                              this.state.rawString
                                ? <ReactMarkdown className={"markdown-body"} source={this.state.rawString}/>
                                : <Pane display={"flex"}
                                        alignItems={'center'}
                                        flexDirection={'column'}
                                        justifyContent={'center'}>
                                    <Paragraph color={'muted'}> 点击任意设备按钮添加新设备 </Paragraph>
                                    <Paragraph color={'muted'}> 双击任意设备图标进入配置界面 </Paragraph>
                                </Pane>
                          }
                      </Card>
                  </Pane>

                  {/*dialogs*/}
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

                  <RouterConfigDialog
                    isShown={this.state.isRouterDialogShown}
                    disableRouterDialog={() => this.disableRouterDialog()}
                    focusedNode={this.state.focusedNode}
                    device={this.state.focusedNode}
                  />

                  <SwitchConfigDialog
                    isShown={this.state.isSwitchDialogShown}
                    disableSwitchDialog={() => this.disableSwitchDialog()}
                    focusedNode={this.state.focusedNode}
                  />

                  <ExportCodeDialog
                    rawString={this.state.rawString}
                    isShown={this.state.isExportCodeDialogShown}
                    disableExportCodeDialog={() => this.disableExportCodeDialog()}
                  />
                  {/*<Footer/>*/}
              </Pane>
          </HotKeys>
        );
    }
}

export default Visnetwork;