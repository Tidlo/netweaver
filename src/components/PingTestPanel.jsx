import React from 'react';
import {Badge, Button, Card, Heading, Pane, SelectMenu} from "evergreen-ui";
import {pingTest} from '../util/pingTest.js';

class PingTestPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sourceNodeId: '',
            destinationNodeId: '',
            testResult: [],
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

                <Pane marginTop={12} marginLeft={24}>
                    <Heading size={700}>连通性测试</Heading>
                    <Pane marginTop={24}>
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
                                // let testResult = [
                                //     {current:{id:'client1'},ableToNext:true},
                                //     {current:{id:'switch1'},ableToNext:true},
                                //     {current:{id:'router1'},ableToNext:true},
                                //     {current:{id:'client2'},ableToNext:null},];

                                if (this.state.sourceNodeId && this.state.destinationNodeId) {
                                    let testResult = pingTest(this.props.network, this.state.sourceNodeId, this.state.destinationNodeId);
                                    this.setState({testResult});
                                }

                            }}>
                            测试
                        </Button>
                    </Pane>
                </Pane>

                <Pane display={"flex"} flexDirection={'column'} alignItems={'center'}>

                    <Pane display={"flex"} flexDirection={'row'} alignItems={'center'} marginTop={'default'}>
                        {this.state.testResult.map(status => {
                            return (
                                <Pane display={'flex'} key={status.current.id}>
                                    <Heading size={600} marginTop={20} marginRight={8}>{status.current.id}</Heading>
                                    <Pane display={status.ableToNext === null ? 'none' : 'block'}>
                                        {status.ableToNext ?
                                            <Badge color="green" isSolid marginRight={8}>Pass</Badge> :
                                            <Badge color="red" isSolid marginRight={8}>Fail</Badge>
                                        }
                                        <Pane marginTop={-15}>
                                            <svg className={'right-arrow'} xmlns="http://www.w3.org/2000/svg" width="48"
                                                 height="48" viewBox="0 0 24 24">
                                                <path fill="none" d="M0 0h24v24H0V0z"/>
                                                <path
                                                    d="M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z"/>
                                            </svg>
                                        </Pane>
                                    </Pane>
                                </Pane>
                            );
                        })}
                    </Pane>
                </Pane>

            </Card>
        );
    }
}

export default PingTestPanel;