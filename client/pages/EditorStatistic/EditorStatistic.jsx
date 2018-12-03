import React, { Component } from 'react';
import { Grid } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import tableExport from 'table-export';
import { ToastContainer } from 'react-toastr';
import ChartPie from './components/ChartPie';
import SimpleTable from './components/SimpleTable';
import BraftEditor from './components/BraftEditor';
import './toastr.scss';
import './EditorStatistic.scss';

const { Row, Col } = Grid;

export default class EditorStatistic extends Component {
  static displayName = 'EditorStatistic';

  constructor(props) {
    super(props);
    this.state = {
      result: [],
      cachedRes: [],
      count: 0,
      total: 0,
      name: '谓语..宾语',
    };
  }

  deleteItem(item) {
    const l = this.state.result.length;
    for (let i = 0; i < l; i += 1) {
      if (item.id === this.state.result[i].id) {
        this.state.result.splice(i, 1);
        break;
      }
    }
    const cl = this.state.cachedRes.length;
    for (let i = 0; i < cl; i += 1) {
      if (item.id === this.state.cachedRes[i].id) {
        this.state.cachedRes.splice(i, 1);
        break;
      }
    }
    // 更新total和cachedRes  todo: 数据一团糟，应该全部在本文件下进行各种操作的！
    this.setState({
      result: this.state.result,
      cachedRes: this.state.cachedRes,
      count: this.state.count - 1,
      total: this.state.total - 1,
    });
    this.container.success(item.pz, '删除成功', {
      closeButton: true,
    });
  }

  exportTable(event) {
    const isExcel = event.target.dataset.software === 'excel';
    if (isExcel) {
      tableExport('exportTable', `"${this.state.name}统计结果"`, 'xls');
    } else {
      tableExport('exportTable', `"${this.state.name}"统计结果`, 'doc');
    }
  }

  reset() {
    this.setState({
      count: 0,
      total: 0,
      result: [],
      name: '谓语...宾语',
      cachedRes: [],
    });
  }

  /**
   * 当编辑器开始检索
   * @param searchModeText
   * @param content
   * @param predicateValue
   * @param objectValue
   */
  onSearch(searchModeText, content, predicateValue, objectValue) {
    if (searchModeText === '谓宾过滤模式') {
      let cachedRes = content.map((ele, idx) => {
        ele = ele.text.split(/[\s\n]+/g);
        return {
          id: idx,
          pz: ele[0] || '无',
          zh: ele[1] ? parseInt(ele[1], 10) : '无',
          jb: ele[2] || '无',
        };
      });
      const p_o_regx = new RegExp(`${predicateValue}({[^C]+})+[^到^\n]*${objectValue}|${predicateValue}[^{^到]{1}[^到^\n]*${objectValue}|${predicateValue}${objectValue}`);
      let result = cachedRes.filter((ele) => {
        return p_o_regx.test(ele.pz) && ele.pz !== '无';
      });
      this.setState({
        total: cachedRes.length,
        count: result.length,
        name: `${predicateValue}...${objectValue}`,
        cachedRes,
        result,
      });
    }
  }

  render() {
    return (
      <div className="editor-statistic-page">
        <ToastContainer
          ref={ref => this.container = ref}
          className="toast-top-right"
          style={{
            zIndex: 1000,
          }}
        />
        <BraftEditor onSearch={this.onSearch.bind(this)} reset={this.reset.bind(this)} />
        <IceContainer>
          <h4 style={styles.title}>
            统计
            <div style={{ float: 'right' }}>
              <div data-software="excel" onClick={this.exportTable.bind(this)} style={styles.excelButton}>导出到Excel</div>
              <div data-software="word" onClick={this.exportTable.bind(this)} style={styles.wordButton}>导出到Word</div>
            </div>
          </h4>
          <Row style={{ paddingLeft: '20px' }} wrap>
            <Col l="10">
              <ChartPie count={this.state.count} total={this.state.total} name={this.state.name}/>
            </Col>
            <Col l="14">
              <SimpleTable tableData={this.state.result} deleteItem={this.deleteItem.bind(this)}/>
            </Col>
          </Row>
          <table id="exportTable" style={styles.exportTable}>
            <thead>
            <tr>
              <td width="300px">句子</td>
              <td width="60px">分数</td>
              <td width="60px">证书级别</td>
            </tr>
            </thead>
            <tbody>
            {
              this.state.result.map((ele) => {
                return <tr key={parseInt(ele.id, 10)}>
                  <td>{ele.pz}</td>
                  <td>{ele.zh}</td>
                  <td>{ele.jb}</td>
                </tr>;
              })
            }
            </tbody>
          </table>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '0',
  },
  title: {
    margin: '0 0 20px',
    padding: '15px 20px',
    fonSize: '16px',
    color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '500',
    borderBottom: '1px solid #f0f0f0',
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
