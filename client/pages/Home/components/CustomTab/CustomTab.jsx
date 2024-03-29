import React, { Component } from 'react';
import { Search, Grid, Tab } from '@icedesign/base';
import Request from 'superagent';
import IceContainer from '@icedesign/container';
import { ToastContainer } from 'react-toastr';
import tableExport from 'table-export';
import CustomTable from '../CustomTable';
import './CustomTab.scss';


const { Row, Col } = Grid;

const columns = [
  // {
  //   title: 'id',
  //   key: 'id',
  //   dataIndex: 'id',
  // },
  {
    title: '句子',
    key: 'pz',
    dataIndex: 'pz',
    width: 300,
  },
  {
    title: '总分',
    key: 'zh',
    dataIndex: 'zh',
    width: 80,
  },
  {
    title: '证书级别',
    key: 'jb',
    dataIndex: 'jb',
    width: 80,
  },
  // {
  //   title: '操作',
  //   key: 'oper',
  //   dataIndex: 'oper',
  //   cell: () => <div style={styles.operButton}>拷贝</div>,
  // },
];

export default class CustomTab extends Component {
  static displayName = 'CustomTab';

  constructor(props) {
    super(props);
    this.state = {
      skey: '',
      exportTableElements: [],
    };
  }

  /**
   * 分批获取数据，一般一次1000条
   * @param skey
   * @param pageSize
   * @param page
   * @param result
   * @param callback
   */
  requestData(skey, pageSize, page, result, callback) {
    Request
      .get('/api/bbchsk')
      .query({ skey })
      .query({ limit: pageSize })
      .query({ offset: (page - 1) * pageSize })
      .set('Accept', 'application/json')
      .timeout({
        deadline: 600000,
      })
      .then(res => {
        res = JSON.parse(res.text);
        const total = parseInt(res.msg.total, 10);
        if (res.code === 0 || total === 0) {
          alert('数据请求发生错误');
          callback(total, result);
          return;
        }
        result.push(...res.msg.instances);
        this.container.success(`共有${total}条数据，已请求${(pageSize * page) < total ? Math.round(100 * (page * pageSize) / total) : 100}％`);
        if (total < pageSize || pageSize * page >= total) {
          // 不向下请求就是结束，
          callback(total, result);
        } else {
          this.requestData(skey, pageSize, page + 1, result, callback);
        }
      });
  }

  /**
   * 导出搜索
   * @param event
   */
  exportTable(event) {
    const isExcel = event.target.dataset.software === 'excel';
    let self = this;
    if (!self.state.skey) {
      alert('请先输入搜索内容');
      return;
    }
    // 显示遮罩层
    showMask();
    // 显示提示
    this.container.warning('请求时间较长，请耐心等待', '注意', {
      closeButton: true,
    });
    this.requestData(self.state.skey, 1000, 1, [], (total, resultArr) => {
      // 隐藏遮罩层
      hideMask();
      // 去重用数组
      let uniqueArr = [];
      const elements = resultArr.filter((ele) => {
        if (!uniqueArr[parseInt(ele.id, 10)]) {
          uniqueArr[parseInt(ele.id, 10)] = 1;
          return true;
        }
        return false;
      }).map((ele, idx) => {
        return <tr key={idx}><td>{ele.pz}</td><td>{ele.zh}</td><td>{ele.jb}</td></tr>;
      });
      self.setState({
        exportTableElements: elements,
      });
      if (isExcel) {
        tableExport('exportTable', `"${self.state.skey}"语料库`, 'xls');
      } else {
        tableExport('exportTable', `"${self.state.skey}"语料库`, 'doc');
      }
    });
  }

  /**
   * 点击搜索时的回调函数，更新CustomTable的props，触发其请求数据
   * @param obj
   */
  onSearch(obj) {
    const key = obj.key;
    this.setState({
      skey: key,
    });
  }

  render() {
    return (
      <IceContainer>
        <ToastContainer
          ref={ref => this.container = ref}
          className="toast-top-right"
          style={{
            zIndex: 1000,
          }}
        />
        <Row style={{ justifyContent: 'space-between' }}>
          <div>
            <Search
              size="large"
              style={{ width: '100%' }}
              searchText="搜索"
              placeholder="请输入要搜索的关键字"
              onSearch={this.onSearch.bind(this)}
            />
          </div>
          <div>
            <div data-software="excel" onClick={this.exportTable.bind(this)} style={Object.assign(styles.excelButton)}>
              导出到excel
            </div>
            <div data-software="word" onClick={this.exportTable.bind(this)} style={Object.assign(styles.wordButton)}>
              导出到word
            </div>
          </div>
        </Row>
        <CustomTable skey={this.state.skey} limit={6} dataSource={this.state.dataSource} columns={columns} />
        <table id="exportTable" style={styles.exportTable}>
          <thead>
            <tr>
              <th>句子</th>
              <th>分数</th>
              <th>证书级别</th>
            </tr>
          </thead>
          <tbody>
            { this.state.exportTableElements }
          </tbody>
        </table>
      </IceContainer>
    );
  }
}

const styles = {
  navItem: {
    height: '60px',
    lineHeight: '60px',
    borderRadius: '4px',
    border: '1px solid #d2d4d7',
    textAlign: 'center',
    color: '#546970',
    fontWeight: '600',
    cursor: 'pointer',
  },
  navItemActive: {
    background: '#09f',
    color: '#fff',
  },
  levelNumber: {
    fontSize: '20px',
  },
  levelSuffix: {
    fontSize: '14px',
  },
  levelTime: {
    fontSize: '20px',
    paddingLeft: '20px',
  },
  operButton: {
    background: '#a683eb',
    width: '32px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    borderRadius: '50px',
    color: '#fff',
    fontSize: '12px',
  },
  excelButton: {
    background: 'rgb(34,103,60)',
    width: '100px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '4px',
    color: '#fff',
    display: 'inline-block',
    cursor: 'pointer',
  },
  wordButton: {
    background: 'rgb(46,81,157)',
    width: '100px',
    height: '32px',
    lineHeight: '32px',
    textAlign: 'center',
    fontSize: '12px',
    borderRadius: '4px',
    color: '#fff',
    display: 'inline-block',
    marginLeft: '8px',
    cursor: 'pointer',
  },
  exportTable: {
    display: 'none',
  },
};
