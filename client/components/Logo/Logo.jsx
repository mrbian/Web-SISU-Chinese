import React, { Component } from 'react';

// const LIGHT = require('./images/TB1saOBbYGYBuNjy0FoXXciBFXa-218-58.png');
// const DARK = require('./images/TB1saOBbYGYBuNjy0FoXXciBFXa-218-58.png');

const logo = require('./images/20971626_160722003690_2.png');

export default class Logo extends Component {
  render() {
    // const { isDark } = this.props;
    // const logo = isDark ? DARK : LIGHT;
    return (
      <a href="/" style={{ display: 'block', marginTop: '6px' }}>
        <img src={logo} width="200" height="45" alt="logo" />
      </a>
    );
  }
}
