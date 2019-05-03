import React from 'react';
import {Badge, Button, Card, Heading, Pane, SelectMenu} from "evergreen-ui";
import {pingTest} from '../util/pingTest.js';

let util = require('../util/util.js');

class PingTestPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceNodeId: '',
            destinationNodeId: '',
            testResult: null,
            pseudoStatus: [true, true, false, true, true],
        };
    }

    render() {
        // noinspection ThisExpressionReferencesGlobalObjectJS
        return (
            <Card
                background={'white'}
                width={900}
                elevation={0}
                padding={12}
                marginBottom={12}>
                <Heading>连通性测试</Heading>
                <Pane marginTop={12}>
                <SelectMenu
                    hasTitle={false}
                    hasFilter={false}
                    height={this.props.network ? this.props.network.body.data.nodes.length * 33 : 0}
                    width={200}
                    options={
                        this.props.network ?
                            this.props.network.body.data.nodes
                                .map(node => ({label: node.label, value: node.id})) :
                            [{label: '', value: ''}]
                    }
                    selected={this.state.sourceNodeId}
                    onSelect={item => this.setState({sourceNodeId: item.value})}>
                    <Button>{this.state.sourceNodeId || '源节点'}</Button>
                </SelectMenu>

                <SelectMenu
                    hasTitle={false}
                    hasFilter={false}
                    height={this.props.network ? this.props.network.body.data.nodes.length * 33 : 0}
                    width={200}
                    options={
                        this.props.network ?
                            this.props.network.body.data.nodes
                                .map(node => ({label: node.label, value: node.id})) :
                            [{label: '', value: ''}]
                    }
                    selected={this.state.destinationNodeId}
                    onSelect={item => this.setState({destinationNodeId: item.value})}>
                    <Button marginLeft={12}>{this.state.destinationNodeId || '目标节点'}</Button>
                </SelectMenu>

                <Button
                    marginLeft={12}
                    height={32}
                    display={'inline-block'}
                    appearance="primary"
                    onClick={() => {
                        console.log(this.props.network);
                        let testResult = pingTest(this.props.network, this.state.sourceNodeId, this.state.destinationNodeId);
                        this.setState({testResult});
                    }}>
                    测试
                </Button>

                <Pane display={"flex"} flexDirection={'column'} alignItems={'center'}
                      justifyContent={'space-around'}>
                    <Heading size={500} marginTop="default">{this.state.testResult ? '最短路径' : ''}</Heading>
                    {/*<Heading size={600} marginTop="default">*/}
                    {/*    {this.state.testResult ? this.state.testResult.path.join(' -> ') : '不存在通路'}*/}
                    {/*</Heading>*/}
                    <Pane>
                        {this.state.pseudoStatus.map(status => {
                            return (
                                status ?
                                    <Badge color="green" isSolid marginRight={8}>Pass</Badge> :
                                    <Badge color="red" isSolid marginRight={8}>Fail</Badge>
                            )
                        })}
                    </Pane>
                </Pane>
                </Pane>
            </Card>
        );
    }
}

export default PingTestPanel;