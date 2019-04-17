import React from 'react';
import {Button, Dialog, Icon, Pane, SelectMenu, toaster} from "evergreen-ui";

let fromDeviceIcon = 'cross';
let toDeviceIcon = 'cross';

class SelectPortDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromPort: '',
            fromDevice: {},
            toPort: '',
            toDevice: {},
        };
    }

    handleConfirm = () => {
        if (this.state.fromPort.length > 0 && this.state.toPort.length > 0) {
            this.props.disablePortDialog();
            let edgeInfo = {
                ...this.props.edgeData,
                fromPort: this.state.fromPort,
                toPort: this.state.toPort,
            };
            this.props.confirmAddEdge(edgeInfo);
            this.setState({fromPort: '', toPort: ''});
        } else {

            toaster.notify('请选择端口', {
                id: 'notify-select-port',
                duration: 1,
            });
        }

    };

    handleCancel = () => {
        this.props.disablePortDialog();
        this.props.cancelAddEdge();
        this.setState({fromPort: '', toPort: ''});
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps && nextProps.edgeData && nextProps.edgeData.from && nextProps.edgeData.from.length > 0) {
            switch (nextProps.edgeData.from.substring(0, 6)) {
                case 'client':
                    fromDeviceIcon = 'desktop';
                    break;
                case 'router' :
                    fromDeviceIcon = 'search-around';
                    break;
                case 'switch' :
                    fromDeviceIcon = 'exchange';
                    break;
                default:
                    fromDeviceIcon = 'cross';
            }

            switch (nextProps.edgeData.to.substring(0, 6)) {
                case 'client':
                    toDeviceIcon = 'desktop';
                    break;
                case 'router' :
                    toDeviceIcon = 'search-around';
                    break;
                case 'switch' :
                    toDeviceIcon = 'exchange';
                    break;
                default:
                    toDeviceIcon = 'cross';
            }
        }
        return true;
    }

    render() {
        return (
            <Dialog
                isShown={this.props.isShown}
                title="选择端口"
                intent="none"
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
                onCloseComplete={this.handleCancel}
                confirmLabel="确认"
                cancelLabel="取消">
                <Pane
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <Pane
                        float="left"
                        heitht={200}
                        margin={16}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center">
                        <Icon
                            margin={32}
                            color="muted"
                            icon={fromDeviceIcon}
                            size={96}/>
                        <SelectMenu
                            hasTitle={false}
                            hasFilter={false}
                            height={
                                this.props.fromNode.device.ports
                                    .filter(port => !port.occupied).length * 33
                            }
                            width={140}
                            options={
                                this.props.fromNode.device.ports
                                    .filter(port => !port.occupied)
                                    .map(port => ({label: port.name, value: port.name}))
                            }
                            selected={this.state.fromPort}
                            onSelect={item => this.setState({fromPort: item.value})}>
                            <Button>
                                {this.state.fromPort || '选择端口'}
                            </Button>
                        </SelectMenu>
                    </Pane>
                    <Pane float="left">
                        <Icon
                            color="success"
                            icon="link"
                            size={16}/>
                    </Pane>
                    <Pane
                        float="left"
                        heitht={200}
                        margin={16}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center">
                        <Icon
                            margin={32}
                            color="muted"
                            icon={toDeviceIcon}
                            size={96}/>

                        <SelectMenu
                            display="block"
                            hasTitle={false}
                            hasFilter={false}
                            height={
                                this.props.toNode.device.ports
                                    .filter(port => !port.occupied).length * 33
                            }
                            width={140}
                            options={
                                this.props.toNode.device.ports
                                    .filter(port => !port.occupied)
                                    .map(port => ({label: port.name, value: port.name}))
                            }
                            selected={this.state.toPort}
                            onSelect={item => this.setState({toPort: item.value})}>
                            <Button>
                                {this.state.toPort || '选择端口'}
                            </Button>
                        </SelectMenu>
                    </Pane>
                </Pane>

            </Dialog>);
    }
}

export default SelectPortDialog;