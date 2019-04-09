import React, {Component} from 'react';
import {Button, Heading, Pane} from "evergreen-ui";

class Header extends Component{
    render() {
        return (
            <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
                <Pane flex={1} alignItems="center" display="flex">
                    <Heading size={600}>Net Weaver</Heading>
                </Pane>
                <Pane>
                    {/* Below you can see the marginRight property on a Button. */}
                    <Button marginRight={16}>重置</Button>
                    <Button appearance="primary">导出</Button>
                </Pane>
            </Pane>
        );
    }
}
export default Header;

