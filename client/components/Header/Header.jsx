import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Balloon, Icon } from '@icedesign/base';
import Menu, { SubMenu, Item as MenuItem } from '@icedesign/menu';
import FoundationSymbol from 'foundation-symbol';
import IceImg from '@icedesign/img';
import { headerMenuConfig } from '../../menuConfig';
import Logo from '../Logo';
import './Header.scss';

@withRouter
export default class Header extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { location = {} } = this.props;
    const { pathname } = location;
    return (
      <div className="header-container">
        <div className="header-content">
          <div className="header-navbar">
            <Logo isDark />
            <Menu
              className="header-navbar-menu"
              onClick={this.handleNavClick}
              selectedKeys={[pathname]}
              defaultSelectedKeys={[pathname]}
              mode="horizontal"
            >
              {headerMenuConfig &&
                headerMenuConfig.length > 0 &&
                headerMenuConfig.map((nav, index) => {
                  if (nav.children && nav.children.length > 0) {
                    return (
                      <SubMenu
                        triggerType="click"
                        key={index}
                        title={
                          <span>
                            {nav.icon ? (
                              <FoundationSymbol size="small" type={nav.icon} />
                            ) : null}
                            <span>{nav.name}</span>
                          </span>
                        }
                      >
                        {nav.children.map((item, idx) => {
                          const linkProps = {};
                          if (item.external) {
                            if (item.newWindow) {
                              linkProps.target = '_blank';
                            }

                            linkProps.href = item.path;
                            return (
                              <MenuItem key={idx}>
                                <a {...linkProps}>
                                  <span>{item.name}</span>
                                </a>
                              </MenuItem>
                            );
                          }
                          linkProps.to = item.path;
                          return (
                            <MenuItem key={idx}>
                              <Link {...linkProps}>
                                <span>{item.name}</span>
                              </Link>
                            </MenuItem>
                          );
                        })}
                      </SubMenu>
                    );
                  }
                  const linkProps = {};
                  if (nav.external) {
                    if (nav.newWindow) {
                      linkProps.target = '_blank';
                    }
                    linkProps.href = nav.path;
                    return (
                      <MenuItem key={index}>
                        <a {...linkProps}>
                          <span>
                            {nav.icon ? (
                              <FoundationSymbol size="small" type={nav.icon} />
                            ) : null}
                            {nav.name}
                          </span>
                        </a>
                      </MenuItem>
                    );
                  }
                  linkProps.to = nav.path;
                  return (
                    <MenuItem key={index}>
                      <Link {...linkProps}>
                        <span>
                          {nav.icon ? (
                            <FoundationSymbol size="small" type={nav.icon} />
                          ) : null}
                          {nav.name}
                        </span>
                      </Link>
                    </MenuItem>
                  );
                })}
            </Menu>
          </div>

        </div>
      </div>
    );
  }
}
