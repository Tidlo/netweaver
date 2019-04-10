import React from 'react';
import {Button, Dialog, Icon, Pane, SelectMenu} from "evergreen-ui";

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
        this.props.disablePortDialog();
        let edgeInfo = {
            ...this.props.edgeData,
            fromPort: this.state.fromPort,
            toPort: this.state.toPort,
        };
        this.props.confirmAddEdge(edgeInfo);
    };

    handleCancel = () => {
        this.props.disablePortDialog();
        this.props.cancelAddEdge();
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
                onCloseComplete={this.props.disablePortDialog}
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
                            height={200}
                            width={100}
                            options={
                                ['GE 0/0/0', 'GE 0/0/1', 'GE 0/0/2', 'GE 0/0/3', 'GE 0/0/4']
                                    .map(label => ({label, value: label}))
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
                            height={200}
                            width={100}
                            options={
                                ['GE 0/0/0', 'GE 0/0/1', 'GE 0/0/2', 'GE 0/0/3', 'GE 0/0/4']
                                    .map(label => ({label, value: label}))
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