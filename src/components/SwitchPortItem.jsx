import React, {Component} from 'react';
import {Button, Pane, Paragraph, SelectMenu, TagInput, Text, TextInput} from "evergreen-ui";

class SwitchPortItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allowPass: ['1'],
            defaultVLAN: 1,
        };
    }
    render() {
        return (
            <Pane>
                <Paragraph>{this.props.port.name}</Paragraph>
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
                        onSelect={item => {
                            this.props.updatePortLinkType({
                                name: this.props.port.name,
                                linkType: item.value
                            });
                            this.forceUpdate();
                        }
                        }
                    >
                        <Button marginLeft={12}>{this.props.port.linkType || 'Select name...'}</Button>
                    </SelectMenu>
                    <TagInput
                        marginLeft={12}
                        display={this.props.port.linkType === 'trunk' ? 'inline-block' : 'none'}
                        tagProps={{color: 'green', isSolid: true}}
                        inputProps={{placeholder: '允许通过的 VLAN 号'}}
                        values={this.props.port.allowPass}
                        onChange={allowPass => {
                            this.setState({allowPass});
                            this.props.device.setPortAllowPass(this.props.port.name, allowPass);
                            console.log(this.props.port.allowPass);
                        }}/>
                    <Pane
                        display={this.props.port.linkType === 'access' ? 'inline-block' : 'none'}
                        marginLeft={12}
                    >
                        <Text>默认VLAN</Text>
                        <TextInput
                            marginLeft={8}
                            name="text-input-name"
                            width={200}
                            value={this.props.port.defaultVLAN}
                            onChange={e => {
                                this.setState({defaultVLAN: e.target.value});
                                this.props.port.defaultVLAN = e.target.value;
                            }}
                        />

                    </Pane>
                </Pane>


            </Pane>
        );

    }
}

export default SwitchPortItem;