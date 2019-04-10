import React, {Component} from 'react';
import {Dialog, TextInputField} from "evergreen-ui";

const ipRegex = "\\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\\b";

class ClientConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editingClientLabel: '',
            editingClientIP: '',
            editingClientMask: '',
            editingClientGateway: '',
            ipValidationMessage: null,
            maskValidationMessage: null,
            isInputValidate: true,
        }
    }

    handleConfirm = () => {
        if (this.isAllInputValidate()) {
            this.props.disableClientDialog();
            let form = {
                label: this.state.editingClientLabel.length === 0 ? this.props.focusedNode.label : this.state.editingClientLabel,
                ip: this.state.editingClientIP.length === 0 ? this.props.focusedNode.device.ip : this.state.editingClientIP,
                mask: this.state.editingClientMask.length === 0 ? this.props.focusedNode.device.mask : this.state.editingClientMask,
                gateway: this.state.editingClientGateway.length === 0 ? this.props.focusedNode.device.gateway : this.state.editingClientGateway,
            };

            this.props.updateClientNode(form);
        }
        this.clearInputField();
    };

    handleCancel = () => {
        this.setState({
            ipValidationMessage: null,
        });
        this.props.disableClientDialog();
        this.clearInputField();
    };

    /**
     * Check whether all input fields of dialog are validate
     * @returns {boolean}
     */
    isAllInputValidate = () => {
        return !(
            this.state.ipValidationMessage
        );
    };

    /**
     * Reset states for input fields.
     */
    clearInputField = () => {
        this.setState({
            editingClientLabel: '',
            editingClientIP: '',
            editingClientMask: '',
            editingClientGateway: '',
        });
    };

    render() {
        return (
            <Dialog
                isShown={this.props.isShown}
                title="主机配置"
                intent="none"
                onCloseComplete={this.props.disableClientDialog}
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
                confirmLabel="确认"
                cancelLabel="取消">
                <TextInputField
                    label="主机名"
                    placeholder="Client"
                    onChange={e => this.setState({editingClientLabel: e.target.value})}
                    defaultValue={this.props.focusedNode == null ? '' : this.props.focusedNode.label}
                />
                <TextInputField
                    label="IP地址"
                    placeholder="10.1.1.1"
                    validationMessage={this.state.ipValidationMessage}
                    isInvalid={this.state.ipValidationMessage !== null}
                    onChange={e => {
                        if (e.target.value.match(ipRegex)) {
                            this.setState({
                                editingClientIP: e.target.value,
                                ipValidationMessage: null,
                            });
                        } else {
                            this.setState({ipValidationMessage: 'IP 格式有误'})
                        }
                    }}
                    defaultValue={this.props.focusedNode == null ? '' : this.props.focusedNode.device.ip}
                />
                <TextInputField
                    label="子网掩码"
                    placeholder="255.255.255.0"
                    onChange={e => this.setState({editingClientMask: e.target.value})}
                    defaultValue={this.props.focusedNode == null ? '' : this.props.focusedNode.device.mask}
                />
                <TextInputField
                    label="网关"
                    placeholder="10.1.1.0"
                    onChange={e => this.setState({editingClientGateway: e.target.value})}
                    defaultValue={this.props.focusedNode == null ? '' : this.props.focusedNode.device.gateway}
                />
            </Dialog>
        );
    }
}

export default ClientConfigDialog;