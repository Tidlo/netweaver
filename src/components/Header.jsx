import React, {Component} from 'react';
import {Button, Heading, Pane} from "evergreen-ui";
import logo from '../img/logo.png'

class Header extends Component{
    render() {
        return (
            <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
                <Pane flex={1} alignItems="center" display="flex">
                    <img src={logo} alt="logo" height={32}/>
                    <Heading size={600} marginLeft={8}>Net Weaver</Heading>
                </Pane>
                <Pane>
                    <Button
                        marginRight={12}
                        display={this.props.isPrintManualButtonShown ? 'inline-block' : 'none'}
                        onClick={this.props.printManual}>打印</Button>
                    <Button appearance="primary" onClick={this.props.showExportCodeDialog}>导出</Button>
                </Pane>
            </Pane>
        );
    }
}
export default Header;

