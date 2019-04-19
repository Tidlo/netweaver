import React, {Component} from 'react';
import {Dialog} from "evergreen-ui";
import ReactMarkdown from "react-markdown";

class ExportCodeDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rawString: "# heading1 \n\n## heading2 \n\n ```javascript\n\nconsole.log()\n\n```",
        };
    }

    render() {
        return (
            <Dialog
                isShown={this.props.isShown}
                title="配置说明"
                intent="none"
                onCloseComplete={this.props.disableExportCodeDialog}
                onConfirm={this.props.disableExportCodeDialog}
                confirmLabel="确认">
                <ReactMarkdown source={this.state.rawString}/>
            </Dialog>
        );
    }
}

export default ExportCodeDialog;