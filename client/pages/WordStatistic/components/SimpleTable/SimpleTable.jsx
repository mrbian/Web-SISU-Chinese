import React, { Component } from 'react';
import { Table, Pagination } from '@icedesign/base';
import IceContainer from '@icedesign/container';

import { enquireScreen } from 'enquire-js';

export default class SimpleTable extends Component {
  static displayName = 'SimpleTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
      tableData: [],
      originTableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 6,
    };
  }

  componentDidMount() {
    this.enquireScreenRegister();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      tableData: Array.from(nextProps.tableData).splice(0, this.state.pageSize),
      originTableData: Array.from(nextProps.tableData),
      total: nextProps.tableData.length,
      currentPage: 1,
    }, function () {
      console.log('In here state is changed', this.state);
      this.forceUpdate();
    });
    console.log('In here state is not changed', this.state);
  }

  enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    }, mediaCondition);
  };

  changePage = (currentPage) => {
    this.setState({
      tableData: Array.from(this.state.originTableData).splice((currentPage - 1) * this.state.pageSize, this.state.pageSize),
      currentPage,
    });
  };

  render() {
    return (
      <div className="simple-table">
        <IceContainer style={{ paddingTop: '0px' }}>
          <Table
            dataSource={this.state.tableData}
            className="basic-table"
            hasBorder={false}
          >
            <Table.Column title="句子" dataIndex="pz" />
          </Table>
          <div style={styles.paginationWrapper}>
            <Pagination
              current={this.state.currentPage}
              pageSize={this.state.pageSize}
              total={this.state.total}
              onChange={this.changePage}
              type={this.state.isMobile ? 'simple' : 'normal'}
            />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  operation: {
    marginRight: '12px',
    textDecoration: 'none',
  },
  paginationWrapper: {
    textAlign: 'center',
    paddingTop: '10px',
  },
};
