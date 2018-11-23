import React, { Component } from 'react';
import { Table, Pagination } from '@icedesign/base';
import Request from 'superagent';
import PropTypes from 'prop-types';
import './CustomTable.scss';


export default class Home extends Component {
  static displayName = 'Home';

  static defaultProps = {
    columns: [],
    dataSource: [],
    limit: 6,
    skey: '',
  };

  static propTypes = {
    columns: PropTypes.array,
    dataSource: PropTypes.array,
    skey: PropTypes.string,
    limit: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: this.props.dataSource,
      total: 0,
      pageSize: this.props.limit,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.skey !== this.props.skey || nextProps.limit !== this.props.limit) {
      this.refreshData(nextProps.skey);
    }
  }

  /**
   * 得到服务器爬虫返回的数据
   * @param skey
   */
  refreshData(skey) {
    Request
      .get('/api/bbchsk')
      .query({ skey: skey || this.props.skey })
      .query({ limit: this.props.limit })
      .query({ offset: (this.state.current - 1) * this.props.limit })
      .timeout({
        deadline: 300000,
      })
      .then(res => {
        res = JSON.parse(res.text);
        if (res.code && parseInt(res.msg.total, 10)) {
          const total = parseInt(res.msg.total, 10);
          // 去重
          let uniqueArr = [];
          let result = res.msg.instances.filter((ele) => {
            if (!uniqueArr[parseInt(ele.id, 10)]) {
              uniqueArr[parseInt(ele.id, 10)] = 1;
              return true;
            } else {
              return null;
            }
          });
          this.setState({
            dataSource: result,
            total,
          });
        } else {
          alert('无法检索到相应内容');
        }
      });
  }

  handlePagination = (current) => {
    console.log(current);
    this.setState({
      current,
    });
    this.refreshData();
  };

  render() {
    const { columns } = this.props;

    return (
      <div>
        <Table
          dataSource={this.state.dataSource}
          hasBorder={false}
          className="custom-table"
        >
          {columns.map((item) => {
            return (
              <Table.Column
                title={item.title}
                dataIndex={item.dataIndex}
                key={item.key}
                width={item.width}
                sortable={item.sortable || false}
                cell={item.cell || ((value) => value)}
              />
            );
          })}
        </Table>
        <Pagination
          style={styles.pagination}
          current={this.state.current}
          total={this.state.total}
          pageSize={this.state.pageSize}
          onChange={this.handlePagination}
        />
      </div>
    );
  }
}

const styles = {
  pagination: {
    margin: '20px 0 0',
    textAlign: 'center',
  },
};
