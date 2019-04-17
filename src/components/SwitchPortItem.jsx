import React, {Component} from 'react';
import {Button, Pane, Paragraph, SelectMenu, TagInput, Text} from "evergreen-ui";

class SwitchPortItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowPass: ['1'],
        };
    }

    render() {
        return (
            <Pane>
                <Paragraph>{this.props.port.name}</Paragraph>
                {this.props.port.linkType === 'hybrid' ?
                    <Pane marginLeft={12}>
                        <Text>端口模式</Text>
                        <SelectMenu
                            hasTitle={false}
                            hasFilter={false}
                            height={99}
                            width={110}
                            title="Select name"
                            options={
                                ['hybrid', 'access', 'trunk']
                                    .map(label => ({label, value: label}))
                            }
                            selected={this.props.port.linkType}
                            onSelect={item => this.props.updatePortLinkType({
                                name: this.props.port.name,
                                linkType: item.value
                            })}
                        >
                            <Button marginLeft={12}>{this.props.port.linkType || 'Select name...'}</Button>
                        </SelectMenu>
                    </Pane>
                    : ''
                }
                {this.props.port.linkType === 'access' ?
                    <TagInput
                        tagProps={{color: 'green', isSolid: true}}
                        inputProps={{placeholder: '允许通过的 VLAN 号'}}
                        values={this.state.allowPass}
                        onChange={allowPass => {
                            this.setState({allowPass})
                        }}/>
                    : ''
                }
                {this.props.port.linkType === 'trunk' ?
                    <TagInput
                        tagProps={{color: 'green', isSolid: true}}
                        inputProps={{placeholder: '允许通过的 VLAN 号'}}
                        values={this.state.allowPass}
                        onChange={allowPass => {
                            this.setState({allowPass})
                        }}/>
                    : ''
                }
            </Pane>
        );

    }
}

export default SwitchPortItem;