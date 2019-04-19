import React, {Component} from 'react';
import {Button, Dialog, IconButton, Pane, Table, TextInputField} from "evergreen-ui";

class RouterConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            destination: '',
            mask: '',
            nextHop: '',
        };
    }

    handleConfirm = () => {
        this.props.disableRouterDialog();
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

                <Table>
                    <Table.Head>

                        <Table.TextHeaderCell flex={1}>
                            目标网络
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flex={1}>

                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flex={3}>
                            下一跳
                        </Table.TextHeaderCell>
                        <Table.TextHeaderCell flex={4}>
                            子网掩码
                        </Table.TextHeaderCell>

                    </Table.Head>
                    <Table.Body>
                        {this.props.focusedNode
                        && this.props.focusedNode.device
                        && this.props.focusedNode.device.routes
                        && this.props.focusedNode.device.routes.map(route => (
                            <Table.Row key={route.destination}
                                       onSelect={() => console.log(route.destination)}>
                                <Table.TextCell>{route.destination}</Table.TextCell>
                                <Table.TextCell>{route.nextHop}</Table.TextCell>
                                <Table.TextCell isNumber>
                                    {route.mask}
                                </Table.TextCell>
                                <Table.Cell flex={'none'}>
                                    <IconButton icon="trash" intent="danger" onClick={() => {
                                        this.props.focusedNode.device.deleteRoute(route.destination);
                                        this.forceUpdate();
                                    }}/>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                <Pane
                    marginTop={36}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-around'}
                >
                    <TextInputField
                        marginLeft={12}
                        label={"目标网络"}
                        value={this.state.destination}
                        onChange={e => this.setState({destination: e.target.value})}/>
                    <TextInputField
                        marginLeft={12}
                        label={"子网掩码"}
                        value={this.state.mask}
                        onChange={e => this.setState({mask: e.target.value})}/>
                    <TextInputField
                        marginLeft={12}
                        label={"下一跳"}
                        value={this.state.nextHop}
                        onChange={e => this.setState({nextHop: e.target.value})}/>

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
            </Dialog>
        )
    }
}

export default RouterConfigDialog;