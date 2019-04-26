import React from 'react';
import {Button, Card, Heading, Pane, SelectMenu} from "evergreen-ui";

let util = require('../util/util.js');

class PingTestPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            testNode1: '',
            testNode2: '',
            testResult: null,
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
                marginBottom={12}
            >
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
                    selected={this.state.testNode1}
                    onSelect={item => this.setState({testNode1: item.value})}>
                    <Button>{this.state.testNode1 || '源节点'}</Button>
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
                    selected={this.state.testNode2}
                    onSelect={item => this.setState({testNode2: item.value})}>
                    <Button marginLeft={12}>{this.state.testNode2 || '目标节点'}</Button>
                </SelectMenu>

                <Button
                    marginLeft={12}
                    height={32}
                    display={'inline-block'}
                    appearance="primary"
                    onClick={() => {
                        console.log(this.props.network);
                        let testResult = util.pingTest(this.props.network, this.state.testNode1, this.state.testNode2);
                        this.setState({testResult});
                    }}>
                    测试
                </Button>

                <Pane display={"flex"} flexDirection={'column'} alignItems={'center'}
                      justifyContent={'space-around'}>
                    <Heading size={500} marginTop="default">{this.state.testResult ? '最短路径' : ''}</Heading>
                    <Heading size={600}

                             marginTop="default">{this.state.testResult ? this.state.testResult.path.join(' -> ') : '不存在通路'}</Heading>
                </Pane>
                </Pane>
            </Card>
        );
    }
}

export default PingTestPanel;