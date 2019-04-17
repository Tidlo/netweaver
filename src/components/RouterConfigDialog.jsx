import React, {Component} from 'react';
import {Dialog} from "evergreen-ui";

class RouterConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
                onCloseComplete={this.handleCancel}
                confirmLabel="确认"
                cancelLabel="取消">

                Dialog content

            </Dialog>
        )
    }
}

export default RouterConfigDialog;