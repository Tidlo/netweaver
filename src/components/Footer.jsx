import {Heading, Pane} from "evergreen-ui";
import React from "react";
import logo from '../img/logo_c.png'

class Footer extends React.Component {
  render() {
    return (
      <Pane
        // position={"absolute"}
        // bottom={0}
        // right={0}
        marginBottom={'32px'}
        width={'100vw'}
        display="flex" alignItems="center" padding={16} background="tint2" borderRadius={3}>
        <Pane marginLeft={100} flex={1} alignItems="center" display="flex">
          {/*left side*/}

        </Pane>
        <Pane marginRight={150} alignItems="center" display="flex">
          {/*right side*/}
          <img src={logo} alt="" width={24}/>
          <Heading size={500} marginLeft={4}>FocJoe</Heading>
        </Pane>
      </Pane>
    );
  }
}

export default Footer;