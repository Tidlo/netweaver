import React, {Component} from 'react';
import {Dialog, Pane, Paragraph, Tab, Tablist} from "evergreen-ui";
import SwitchPortItem from "./SwitchPortItem";

class SwitchConfigDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowPass: ['1'],
            selectedIndex: 0,
            tabs: ['基础配置', '高级配置'],
        };
    }

    handleConfirm = () => {
        this.props.disableSwitchDialog();
    };

    handleCancel = () => {
        this.props.disableSwitchDialog();
    };

    updatePortLinkType = (param) => {
        this.props.focusedNode.device.ports.find(p => p.name === param.name).linkType = param.linkType;
        //console.log(this.props.focusedNode.device.ports.find(p => p.name===param.name).linkType);
        // console.log(typeof this.props.focusedNode.device.ports.find(param.name).linkType);

    };

    render() {
        return (
            <Dialog
                isShown={this.props.isShown}
                title="交换机配置"
                intent="none"
                onConfirm={this.handleConfirm}
                onCancel={this.handleCancel}
                onCloseComplete={this.handleCancel}
                confirmLabel="确认"
                cancelLabel="取消">

                {/*for a single port*/}
                <Pane>
                    <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
                        {this.state.tabs.map((tab, index) => (
                            <Tab
                                key={tab}
                                id={tab}
                                onSelect={() => this.setState({selectedIndex: index})}
                                isSelected={index === this.state.selectedIndex}
                                aria-controls={`panel-${tab}`}
                            >
                                {tab}
                            </Tab>
                        ))}
                    </Tablist>
                    <Pane padding={16} background={"tint1"} flex="1">
                        {this.state.tabs.map((tab, index) =>
                            <Pane
                                key={tab}
                                id={`panel-${tab}`}
                                role="tabpanel"
                                aria-labelledby={tab}
                                aria-hidden={index !== this.state.selectedIndex}
                                display={index === this.state.selectedIndex ? 'block' : 'none'}>
                                {
                                    this.props.focusedNode &&
                                    index === 0 ? this.props.focusedNode.device.ports.filter(port => port.occupied)
                                            .map(port =>
                                                <SwitchPortItem
                                                    key={port.name}
                                                    port={port}
                                                    device={this.props.focusedNode.device}
                                                    updatePortLinkType={(p) => this.updatePortLinkType(p)}
                                                />
                                            )
                                        : <Paragraph>高级配置</Paragraph>
                                }
                            </Pane>
                        )}

                    </Pane>
                </Pane>

                <Pane>

                </Pane>

            </Dialog>
        )
    }
}

export default SwitchConfigDialog;