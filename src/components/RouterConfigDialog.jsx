import React, {Component} from 'react';
import {Button, Dialog, IconButton, Pane, Tab, Table, Tablist, TextInputField, TrashIcon} from "evergreen-ui";

let util = require('../util/util');
const ipRegex = "\\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\\b";

class RouterConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: '',
            mask: '',
            nextHop: '',
            selectedIndex: 0,
            tabs: ['端口配置', '路由规则'],
            ipValidationMessage: null,
        };
    }

    handleConfirm = () => {
        this.props.disableRouterDialog();
        console.log(this.props.focusedNode.device.ports);
    };

    handleCancel = () => {
        this.props.disableRouterDialog();
    };

    render() {
        return (
            <Dialog
                isShown={this.props.isShown}
                title="路由器配置"
                intent="none"
                width={700}
                height={800}
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
                onCloseComplete={this.handleCancel}
                confirmLabel="确认"
                cancelLabel="取消">
                <Pane>
                    <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                        {this.state.tabs.map((tab, index) => (
                            <Tab
                                key={tab}
                                id={tab}
                                onSelect={() => this.setState({selectedIndex: index})}
                                isSelected={index === this.state.selectedIndex}
                                aria-controls={`panel-${tab}`}>
                                {tab}
                            </Tab>
                        ))}
                    </Tablist>
                    <Pane>
                        <Pane
                            key={'端口配置'}
                            id={`panel-端口配置`}
                            role="tabpanel"
                            aria-labelledby={'端口配置'}
                            aria-hidden={0 !== this.state.selectedIndex}
                            display={0 === this.state.selectedIndex ? 'block' : 'none'}>
                            {
                                this.props.focusedNode && this.props.focusedNode.device.ports.filter(port => port.occupied)
                                    .map(port =>
                                        <Pane display={"flex"} alignItems={'center'}
                                              justifyContent={'space-around'} key={port.name}>
                                            <TextInputField
                                                flex={2}
                                                margin={12}
                                                label={port.name + " --> " + util.getDestination(this.props.focusedNode, port)}
                                                description={"IP地址"}
                                                placeholder={"端口绑定IP"}
                                                validationMessage={this.state.ipValidationMessage}
                                                isInvalid={this.state.ipValidationMessage !== null}
                                                defaultValue={this.props.focusedNode && port.bindIP}
                                                onChange={e => {
                                                    if (e.target.value.match(ipRegex)) {
                                                        port.bindIP = e.target.value;
                                                        this.setState({
                                                            editingClientIP: e.target.value,
                                                            ipValidationMessage: null,
                                                        });
                                                    } else {
                                                        this.setState({ipValidationMessage: 'IP 格式有误'})
                                                    }
                                                }}
                                            />
                                            <TextInputField
                                                flex={1}
                                                margin={12}
                                                marginTop={32}
                                                label={" "}
                                                description={"掩码"}
                                                placeholder={"端口绑定IP的掩码"}
                                                validationMessage={this.state.ipValidationMessage}
                                                isInvalid={this.state.ipValidationMessage !== null}
                                                defaultValue={this.props.focusedNode && port.bindMask}
                                                onChange={e => {
                                                    port.bindMask = e.target.value;
                                                }}
                                            />
                                        </Pane>
                                    )
                            }
                        </Pane>

                        <Pane
                            key={'路由规则'}
                            id={`panel-路由规则`}
                            role="tabpanel"
                            aria-labelledby={'路由规则'}
                            aria-hidden={1 !== this.state.selectedIndex}
                            display={1 === this.state.selectedIndex ? 'block' : 'none'}>
                            <Pane>
                                <Table>
                                    <Table.Head>
                                        <Table.TextHeaderCell flex={1}>目标网络</Table.TextHeaderCell>
                                        <Table.TextHeaderCell flex={1}/>
                                        <Table.TextHeaderCell flex={3}>下一跳</Table.TextHeaderCell>
                                        <Table.TextHeaderCell flex={4}>子网掩码</Table.TextHeaderCell>
                                    </Table.Head>
                                    <Table.VirtualBody height={200}>
                                        {this.props.focusedNode
                                        && this.props.focusedNode.device
                                        && this.props.focusedNode.device.routes
                                        && this.props.focusedNode.device.routes.map(route => (
                                            <Table.Row key={route.destination}>
                                                <Table.TextCell>{route.destination}</Table.TextCell>
                                                <Table.TextCell>{route.nextHop}</Table.TextCell>
                                                <Table.TextCell isNumber>{route.mask}</Table.TextCell>
                                                <Table.Cell flex={'none'}>
                                                    <IconButton icon={TrashIcon} intent="danger" onClick={() => {
                                                        this.props.focusedNode.device.deleteRoute(route.destination);
                                                        this.forceUpdate();
                                                    }}/>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.VirtualBody>
                                </Table>
                            </Pane>

                            <Pane
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-around'}>
                                <TextInputField
                                    marginLeft={12}
                                    label={"目标网络"}
                                    value={this.state.destination}
                                    onChange={e => this.setState({destination: e.target.value})}/>
                                <TextInputField
                                    marginLeft={12}
                                    label={"下一跳"}
                                    value={this.state.nextHop}
                                    onChange={e => this.setState({nextHop: e.target.value})}/>
                                <TextInputField
                                    marginLeft={12}
                                    label={"子网掩码"}
                                    value={this.state.mask}
                                    onChange={e => this.setState({mask: e.target.value})}/>
                                <Button
                                    onClick={() => {
                                        console.log(this.state);
                                        this.props.focusedNode.device.addRoute({
                                            destination: this.state.destination,
                                            mask: this.state.mask,
                                            nextHop: this.state.nextHop,
                                        });
                                        this.setState({
                                            destination: '',
                                            mask: '',
                                            nextHop: '',
                                        });
                                    }}
                                    marginRight={24}>
                                    添加
                                </Button>
                            </Pane>
                        </Pane>

                    </Pane>
                </Pane>
            </Dialog>
        );
    }
}

export default RouterConfigDialog;