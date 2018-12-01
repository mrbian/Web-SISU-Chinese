import React, { Component } from 'react';
import { Table, Pagination } from '@icedesign/base';
import PropTypes from 'prop-types';
import IceContainer from '@icedesign/container';

import { enquireScreen } from 'enquire-js';

export default class SimpleTable extends Component {
  static displayName = 'SimpleTable';

  static propTypes = {
    deleteItem: PropTypes.func,
    tableData: PropTypes.array,
  };

  static defaultProps = {
    deleteItem: () => {},
    tableData: [],
  };

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
      // console.log('In here state is changed', this.state);
      this.forceUpdate();
    });
    // console.log('In here state is not changed', this.state);
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

  renderOperations(value, index, record) {
    // 不能用index，因为删除后绑定的index是不变的，而实际的index是改变了的
    return <div style={styles.operButton} onClick={() => { this.props.deleteItem(record); }} >删除</div>;
  }

  render() {
    return (
      <div className="simple-table">
        <IceContainer style={{ paddingTop: '0px' }}>
          <Table
            dataSource={this.state.tableData}
            className="basic-table"
            hasBorder={false}
          >
            <Table.Column title="句子" dataIndex="pz" width={320} />
            <Table.Column title="分数" dataIndex="zh" width={85} />
            <Table.Column title="证书级别" dataIndex="jb" width={85} />
            <Table.Column title="操作" dataIndex="oper" width={85} cell={this.renderOperations.bind(this)} ></Table.Column>
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
  operButton: {
    background: '#eb544c',
    width: '32px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    borderRadius: '50px',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
  },
};
