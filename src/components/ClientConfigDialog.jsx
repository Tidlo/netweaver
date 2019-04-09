import React, { Component } from 'react';
import {Pane, Button, Heading, Dialog} from "evergreen-ui";
//todo use independent dialog for each devices.
class ClientConfigDialog extends Component {
    render() {
        return (
            <Dialog
                title="交换机配置"
                intent="danger"
                onCloseComplete={() => this.setState({ isSwitchDialogShown: false })}
                confirmLabel="Delete Something">
                Dialog content
            </Dialog>
        );
    }
}

export default ClientConfigDialog;